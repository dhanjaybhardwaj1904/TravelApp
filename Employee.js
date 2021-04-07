const mongoose = require('mongoose')

const EmpoyeeSchema = new mongoose.Schema({
    name: String,
    location: String,
    image: String,
    details: String,
})


mongoose.model("employee",EmpoyeeSchema)