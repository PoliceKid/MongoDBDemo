var multer = require('multer');
const path = require("path");

var storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './uploads');
    },
    filename: function (req, file, callback) {
            callback(null, file.fieldname + '-' +Date.now()+path.extname(file.originalname));
    }

})
const fileFilter = (req, file, cb) => {
    if(file.mimeType==='image/jpeg' || file.mimeType==='image/png'||file.mimeType==='image/jpg'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
}
var upload = multer ({
    storage:storage,
    limits:{
    fileSize:1024*1024*5
    },
    
});
module.exports = upload