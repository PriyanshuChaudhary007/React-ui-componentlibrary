import { genToken } from "../configs/token.js"
import { authCookieOptions, cookieOptions } from "../configs/cookie.js"
import User from "../models/user.model.js"



export const googleSignup = async (req,res) => {
    try {
        const {name , email} = req.body
        let user= await User.findOne({email})
        if(!user){
            user = await User.create({
            name , email 
        })
        }
        let token =await genToken(user._id)
        res.cookie("token", token, authCookieOptions)
        return res.status(200).json(user)


    } catch (error) {
        console.log(error)
         return res.status(500).json({message:`googleSignup  ${error}`})
    }
    
}

export const logOut = async(req,res)=>{
    try {
        res.clearCookie("token", cookieOptions)
        return res.status(200).json({message:"logOut Successfully"})
    } catch (error) {
        return res.status(500).json({message:`logout Error ${error}`})
    }
}
