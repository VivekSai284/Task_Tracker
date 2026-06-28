const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')
require('dotenv').config()

const connectDB = async() => {
    try{
        const con = await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB Connected");
    }catch(error){
        console.log(error);
    }
}

connectDB();

const app = express();

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes);
app.use('/items', taskRoutes)

app.get('/', (req, res) => {
    res.send("Server working...")
});

const PORT = process.env.PORT
app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`);
})


