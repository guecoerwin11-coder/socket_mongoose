const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
    try{

        const authHead = req.headers.authtorization?.split(' ')[1];

        if(!authHead){
            return res.status(403).json({message: 'Invalid Token, access denied'})
        }

        const decode = jwt.verify(authHead, process.env.JWT_SECRET);

        req.user = decode;
        next()
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

module.exports = protect;