const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },

    title : {
        type : String,
        required : true
    },

    description : {
        type : String,
    },

    status : {
        type : String,
        default : "Pending",
        enum : ["Pending", "Completed"] // Optional: restricts values to only these two
    },
    dueDate : {
        type : Date
    },
}, {
    timestamps : true
});


module.exports = mongoose.model("Task", taskSchema);