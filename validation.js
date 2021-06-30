function checkEmpty(value){
    return value.trim().length != 0;
}

function checkAlphabet(value){
    let regex = /^[a-zA-Z]+$/;
    return regex.test(value);
}

function checkLength(value,minLength,maxLength){
    if(value.trim().length < minLength || value.trim().length > maxLength)
        return false;
    return true;
}

function checkPhone(value){
    let regex = /^[0-9]+$/;
    return regex.test(value) && value.trim().length==10;
}
function checkPrice(value){
    let regex = /^[0-9]+$/;
    return regex.test(value) && value!=0;
}
module.exports = {checkEmpty,checkAlphabet,checkLength,checkPhone,checkPrice}