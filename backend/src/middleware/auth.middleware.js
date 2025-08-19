import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protectRoute =  async (req, res, next) => {
    try {
        const token =req.cookies.jwt

        if(!token){
            return res.status(401).json({msg:"Please login to access this route"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
      

        if(!decoded){
            return res.status(401).json({message: "Unauthorized - Invalid token"})
        }

        const user= await User.findById(decoded.userId).select("-password"); // here the userId is saved as a payload in the cookie holding the userid which we have given it in the jwt creation
       
        if(!user){
            return res.status(401).json({message: "Unauthorized - User not found"})
        }

        req.user=user;

        next();


    } catch (error) {

        console.log("Error in protected middleware" , error)
        return res.status(500).json({message: "Internal Server Error"})
    }

}