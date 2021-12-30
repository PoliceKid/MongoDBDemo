const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://hieu:aisizkh123@cluster0.18km4.mongodb.net/test";
const dbName="PoliceKidDB";

async function searchProduct(condition,collectionName){
    var dbo = await getDbo();
  
    var results= await dbo.collection(collectionName).find({price: {$gt:condition}}).toArray();
    return results;
}

async function insertOneIntoCollection(documentToInsert,collectionName){
    const dbo = await getDbo();
    await dbo.collection(collectionName).insertOne(documentToInsert);
}
async function SelectProduct(condition,collectionName ){
    const dbo = await getDbo();
    var results= await dbo.collection(collectionName).findOne(condition);
    return results;
}
async function deleteOne(condition,collectionName){
    const dbo = await getDbo();
    await dbo.collection(collectionName).deleteOne(condition);
}
async function UpdateOne(condition,newValues,collectionName){
    const dbo = await getDbo();
    await dbo.collection(collectionName).updateOne(condition,newValues);
}
async function CheckUser(username,password,collectionName){
    const dbo = await getDbo();
   var results = dbo.collection(collectionName).findOne({$and:[{username:username},{password:password}]});
    if(results!=null){
        return true;
    }
    else{
        return false;
    }
}
async function getDbo() {
    const client = await MongoClient.connect(url);
    const dbo = client.db(dbName);
    return dbo;
}
module.exports= {searchProduct,insertOneIntoCollection,deleteOne,SelectProduct,UpdateOne,CheckUser}