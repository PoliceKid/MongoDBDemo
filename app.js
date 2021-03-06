const express = require('express')
const hbs = require('hbs')
const path = require("path");

const session = require('express-session');

var app = express();

app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'abcc##$$0911233$%%%32222', 
    cookie: { maxAge: 60000 }}));

    app.set('view engine','hbs')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://hieu:aisizkh123@cluster0.18km4.mongodb.net/test";

var bodyParser = require('body-parser');
const { Console, debug } = require('console');
app.use(bodyParser.urlencoded({extended:false}));

hbs.registerPartials(path.join(__dirname + '/views/partials/'));
app.use(express.static('/public'))
app.use('/uploads', express.static(path.join(__dirname ,'/uploads')));
const upload = require('./middleWare/upload');

const dbHandler = require('./databaseHandler')
const validation = require('./validation')
var dsNotToDelete=['ao','quan','bep','my goi'];
let isCanDelete = new Boolean(false);

app.get('/view',async(req,res)=>{

    var results= await dbHandler.searchProduct("","Product");
    var userName ='Not logged In';
    if(req.session.username){
        userName = req.session.username;
    }
    res.render('allProduct',{model:results,username:userName})

})

app.post('/search',async(req,res)=>{
    const searchText=req.body.txtName;
    var results= await dbHandler.searchProduct(searchText,"Product");
    res.render('allProduct',{model:results})
})
app.post('/edit', async(req,res)=>{
    const id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    const condition = {"_id":ObjectID(id)};

    var productToEdit= await dbHandler.SelectProduct(condition,"Product");
    res.render('edit',{product:productToEdit})
})
app.post('/update',upload.single('image'),async(req,res)=>{
    const id= req.body.id;
    const nameInput = req.body.txtName;
    const priceInput = req.body.txtPrice;
    const image =  req.file.path;
    var checkPrice = validation.checkPrice(priceInput);
    if(!checkPrice){
        error="Price must be grater than 50";
        res.render('edit',{errorPrice:error})
    }
    const newValues =  {$set:{name:nameInput, price: priceInput,image:image}};
   
    var ObjectID = require('mongodb').ObjectID;
    const condition = {"_id":ObjectID(id)};
    await dbHandler.UpdateOne(condition,newValues,"Product");
    res.redirect('/view');
})
app.get('/delete', async(req,res)=>{
    const id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    const condition = {"_id":ObjectID(id)};

    var productToEdit= await dbHandler.SelectProduct(condition,"Product");
    
    dsNotToDelete.every(eachProduct => {       
        if(productToEdit.name==eachProduct){
   
            isCanDelete =false; 
            return false;           
        }
        else{
            isCanDelete =true;
        }
    });
    console.log(isCanDelete);
    if(!isCanDelete){
        console.log("Can not delete this product");      
    }
    else{
        await dbHandler.deleteOne(condition,"Product");
    }
   
    res.redirect('/view');
})
app.post('/doInsert',upload.single('image'),async(req,res)=>{
    const nameInput = req.body.txtName;
    const priceInput = req.body.txtPrice;
    const image = req.file.path;
    var check = true;
    check &= validation.checkAlphabet(nameInput) & validation.checkPrice(priceInput);
    if(!check){
        err1 = "",err2 = "";
        if(!validation.checkAlphabet(nameInput)) err1 = "Must enter characters";
        if(! validation.checkPrice(priceInput)) err2 = "Must enter number";
        res.render('insert',{err:{err1,err2}})
    }
    else{
        var newProduct ={name:nameInput,price:priceInput,image:image,size :{width:20,length:40}}
        await dbHandler.insertOneIntoCollection(newProduct,"Product");
        res.render('index')
    }

})
app.post('/doLogin', async(req,res)=>{
    const nameInput = req.body.txtName;
    const passwordInput= req.body.txtPassword;
  //  const newUser = {username:nameInput,password:passwordInput};
    const found =await dbHandler.CheckUser(nameInput,passwordInput,"Users");
    if(found){
        req.session.username = nameInput;
        res.redirect('/')
    }
    else{
        res.redirect('/login')
    }
    //res.redirect('/');
})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/logout' , (req,res)=>{
   req.session.destroy((error)=>{
       if(error){
           return console.log(error);
       }
       res.redirect('/')
   })

})
app.get('/register',(req,res)=>{
    res.render('register')
})
app.post('/doRegister', async(req,res)=>{
    const nameInput = req.body.txtName;
    const passwordInput= req.body.txtPassword;
    const phoneInput= req.body.txtPhone;
    const newUser = {username:nameInput,password:passwordInput,phone:phoneInput};
    await dbHandler.insertOneIntoCollection(newUser,"Users");

    var userName ='Not logged In';
    req.session.username = nameInput;
    if(req.session.username){
        userName = req.session.username;
    }
    res.render('index',{loginName:userName})
})
app.get('/insert',(req,res)=>{
    res.render('insert')
})
app.get('/',(req,res)=>{
    var userName ='Not logged In';
    if(req.session.username){
        userName = req.session.username;

        res.render('index',{loginName:userName})
    }
    else{
        res.render('login',{loginName:userName})
        }
})

app.use(express.static(__dirname + "/public"));

var PORT =process.env.PORT||5000;
app.listen(PORT);
console.log("Server is running at : "+PORT);