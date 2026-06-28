const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')


router.post('/register', async(req, res) => {
    try{
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({email})

        if(existingUser) {
            return res.status(400).json({
                message : "User Already exists"
            })
        }


        const hashedpassword = await bcrypt.hash(password, 10)

        const user = new User({
            username,
            email,
            password : hashedpassword
        })

        await user.save()

        res.status(201).json({
            message : "Registered Successful"
        });


    }catch(error){
        res.status(500).json({
            message : error.message
        })
    }
});


router.post('/login', async(req, res) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email })

        if(!user){
            return res.status(400).json({
                message : "User not exists"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({
                message : "Invalid Password"
            })
        }

        const token = jwt.sign(
            {id : user._id},
            process.env.JWT_SECRET,
            {expiresIn : '7d'}
        )

        res.status(200).json({
            message : "Login Successful",
            token,
            user : {
                id : user._id,
                username : user.username,
                email : user.email,
            }
        })



    }catch(error){
        res.status(500).json({
            message : error.message
        })
    }
})


module.exports = router;