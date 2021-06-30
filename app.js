const express = require('express')
const hbs = require('hbs')
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
app.use(express.static('public'))

const dbHandler = require('./databaseHandler')

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
app.get('/edit', async(req,res)=>{
    const id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    const condition = {"_id":ObjectID(id)};

    var productToEdit= await dbHandler.SelectProduct(condition,"Product");
    res.render('edit',{product:productToEdit})
})
app.post('/update',async(req,res)=>{
    const id= req.body.id;
    const nameInput = req.body.txtName;
    const priceInput = req.body.txtPrice;
    const newValues =  {$set:{name:nameInput, price: priceInput}};

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
app.post('/doInsert',async(req,res)=>{
    const nameInput = req.body.txtName;
    const priceInput = req.body.txtPrice;
     const imgUrlInput= req.body.imgUrl;
    var newProduct ={name:nameInput,price:priceInput,img:imgUrlInput ,size :{width:20,length:40}}
    await dbHandler.insertOneIntoCollection(newProduct,"Product");
    res.render('index')
})
app.post('/login', async(req,res)=>{
    const nameInput = req.body.txtName;
    const passwordInput= req.body.txtPassword;
  //  const newUser = {username:nameInput,password:passwordInput};
    const found =await dbHandler.CheckUser(nameInput,passwordInput,"Users");
    if(found){
        req.session.username = nameInput;
        res.render('index',{loginName:nameInput})
    }
    else{
        res.render('index',{errorMsg:"Login failed!"})
    }
    //res.redirect('/');
})
app.g
app.get('/register',(req,res)=>{
    res.render('register')
})
app.post('/doRegister', async(req,res)=>{
    const nameInput = req.body.txtName;
    const passwordInput= req.body.txtPassword;
    const newUser = {username:nameInput,password:passwordInput};
    await dbHandler.insertOneIntoCollection(newUser,"Users");
    res.redirect('/');
})
app.get('/insert',(req,res)=>{
    res.render('insert')
})
app.get('/',(req,res)=>{
    var userName ='Not logged In';
    if(req.session.username){
        userName = req.session.username;
    }
    res.render('login',{loginName:userName})
})
var PORT =process.env.PORT||5000;
app.listen(PORT);
console.log("Server is running at : "+PORT);