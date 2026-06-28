const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if(!token){
        return res.status(401).json({
            message: "No token, Acess Denied"
        })
        
    }

    try{
        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = verified;

        next();

    }catch(error){
        res.status(400).json({
            message: "Sign In to create Tasks"
        })
    }
}

module.exports = authMiddleware;