const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('./Employee')

app.use(bodyParser.json())

const Employee = mongoose.model("employee")


const mongoUri = "mongodb+srv://dhanu:dhanu@tickettool.lmayz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on("connected", () => {
    console.log("Connected")
})
mongoose.connection.on("error", (err) => {
    console.log("Error", err)
})

app.get('/', (req, res) => {
    Employee.find({}).then(data => {
        res.send(data)
    }).catch(err => {
        console.log(err)
    })


})


app.post('/send', (req, res) => {
    const employee = new Employee({
        name: req.body.name,
        location: req.body.location,
        image: req.body.image,
        details: req.body.details,
    })
    employee.save()
        .then(data => {
            console.log(data)
            res.send(data)
        }).catch(err => {
            console.log(err)
        })

})

app.post('/delete', (req, res) => {
    Employee.findByIdAndRemove(req.body.id)
        .then(data => {
            console.log(data)
            res.send(data)
        })
        .catch(err => {
            console.log(err)
        })
})

app.post('/update', (req, res) => {
    Employee.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
        location: req.body.location,
        image: req.body.image,
        details: req.body.details,
    }).then(data => {
        console.log(data)
        res.send(data)
    })
        .catch(err => {
            console.log(err)
        })
})

app.listen(3000, () => {
    console.log("server running")
})
