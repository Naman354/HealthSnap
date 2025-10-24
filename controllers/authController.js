import User, { validatePassword } from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1h"});
}

export const register = async (req, res) => {
    const {fullname, email, password} = req.body;
    try {
        if(!validatePassword(password)) {
            return res.status(400).json({message: "Password must be atleast  8 char, include uppercase, lowercase, number, and special character."});
        }

        const userExists =  await User.findOne({email});
        if(userExists) return res.status(400).json({message: "User Already Exists"});

        const user = await User.create({fullname, email, password});
        res.status(201).json({
            _id:user.id,
            fullname:user.fullname,
            email: user.email,
        });
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(user && await user.matchPassword(password)) {
            res.json({
                _id:user.id,
                fullname:user.fullname,
                email:user.email,
                token:generateToken(user.id),
            });
        } else {
            res.status(401).json({message:"Invalid email or password"});
        }
    } catch(err) {
        res.status(500).json({message: err.message});
    }
};