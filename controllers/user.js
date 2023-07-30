import {User} from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middlewares/error.js";

export const login = async(req,res,next) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email}).select("+password");
        if(!user) 
            return next(new ErrorHandler("Invalid Email or Password",400));
        // if(!user) return res.status(404).json({
        //     success:false,
        //     message:"Invalid Email or Password",
        // })
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch)  return next(new ErrorHandler("Invalid Email or Password",400));
        // if(!isMatch) return res.status(404).json({
        //     success:false,
        //     message:"Invalid Email or Password",
        // })

        sendCookie(user,res,`Welcome back, ${user.name}`, 200)
    } catch (error) {
        next(error);
    }
}
export const register = async(req,res) => {

    try {
        const {name,email,password} = req.body;
        let user = await User.findOne({email});
        // if(user) return res.status(404).json({
        //     success:false,
        //     message:"",
        // })
        if(user) 
            return next(new ErrorHandler("User Already Exists",400));
        const hashedPassword = await bcrypt.hash(password,10);
        user = await User.create({name,email,password:hashedPassword})
    
        sendCookie(user,res,"Registered Successfully",201);
    } catch (error) {
        next(error);
    }
}

// export const specialFunc = (req,res) => {
//     res.json({
//         success: true,
//         message: "Just Joking",
//     })
// }

export const getMyProfile = (req,res) => {
    // const id = "myid";
    
    // const user = await User.findById(decoded._id);
    res.status(200).json({
        success:true,
        user:req.user,
    })
}

// export const updateUser = async(req,res) => {
//     const { id } = req.params;
//     const user = await User.findById(id)
//     // console.log(req.params);
//     res.json({
//         success: true,
//         message: "Updated",
//     })
// }


// export const deleteUser = async(req,res) => {
//     const { id } = req.params;
//     const user = await User.findById(id)
//     // console.log(req.params);

//     await user.deleteOne();
//     res.json({
//         success: true,
//         message: "Deleted",
//     })
// }


export const logout = (req,res) => {
    res.status(200).cookie("token","",{
        expires:new Date(Date.now()),
        sameSite: process.env.NODE_ENV==="Development"?"lax":"none",
        secure:process.env.NODE_ENV==="Development"? false:true,
    })
    .json({
        success:true, 
        user:req.user,
    })
}