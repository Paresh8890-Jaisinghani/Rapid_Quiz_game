const mongoose = require('mongoose');


const contactSchema = new mongoose.Schema({
    Quiz_Score : {type:String,required : true},
    otpcode : {type:String}
})


const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
