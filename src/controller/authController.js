const User = require('../models/users');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    try{
        const {name, email, password} = req.body;

        const isExist = await User.findOne({email});
        
        if(isExist){
            return res.status(401).json({message: "Email is already used"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const user = await User.create({    
            name, email, password: hashed
        })

        const token = jwt.sign(
            {id: user._id, name: user.name},
            process.env.JWT_SECRET,
            {expiresIn: '2d'}
        );

        res.status(201).json({
            message: "register successfully",
            token,
            user: {
                id: user.id,
                name: user.name
            }
        })
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

const login = async (req, res) => {
    try{

        const{email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({message: 'Email is not registered'})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
             return res.status(401).json({message: 'invalid password'})
        }

        const token = jwt.sign(
            {id: user._id, name: user.name},
            process.env.JWT_SECRET,
            { expiresIn: '2d'}
        )

        res.status(200).json({
            token, 
            user: {
                id: user._id, name: user.name
            }
        })
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

const getUser = async (req, res) => {
    try{
        const users = await User.find({ _id: {$ne: req.user.id}})
            .select(`-password`)
            .sort({isOnline: -1, name: 1})

        res.status(200).json(users)
    }catch(err){
        res.status(500).json({message: err,message})
    }
}

module.exports = {register, login, getUser}