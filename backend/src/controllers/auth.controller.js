import User from "../models/User.js"
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";
export  async function signup(req,res){
    const {email,password,fullName}= req.body;
    try {
        if(!email|| !password||!fullName){
            return res.status(400).json({messsage:"ALl fields are required"})
        }

        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 charachters"})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
        }  



        const exsistingUser= await User.findOne({email});
        if(exsistingUser){
            return res.status(400).json({message:"Email already in use"})
        }


         const idx = Math.floor(Math.random() * 100) + 1; // generate a num between 1-100
          const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

           const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
            });

            
    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("Error creating Stream user:", error);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d",})


        res.cookie("jwt",token,{
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevent XSS attacks,
            sameSite: "strict", // prevent CSRF attacks
            secure: process.env.NODE_ENV === "production",

        })

        res.status(201).json({success:true, user:newUser})
    } catch (error) {
        console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
    }
}

export const login= async (req,res)=>{
   
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password); // here the matchpawword function come from the userschema which we have created a function in the userschema to check the password we gotis the same with the one hashed and saved in the password database
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks,
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}



export const logout =(req,res)=>{
    res.clearCookie("jwt");
    res.status(200).json({success:true , message:"logout successful"})
}

export const onboard = async (req,res)=>{
  try {
    const userId=req.user._id
    const {fullName,bio,nativeLanguage,learningLanguage,location} = req.body;

    if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
      return res.status(400).json({
        message: "All fields are required",
        missingField: [
          !fullName && "fullName", // this means if the user didib=nt provide fullName we will add "fullname in the array" 
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location ?  "location" : false,
        ].filter(Boolean),
      

      })

    }

    const updatedUser=await User.findByIdAndUpdate(userId, {
        ...req.body, // here we are saying that it can take every thing from the req.body which is the same as saying fullName,Bio...
        isOnboard:true,  
    } , {new:true} // this is for the reason of by default the update method of the mongodb will not give us the updated user so we have to use the new option to get the updated user
   )

   if (!updatedUser){
    return res.status(404).json({ message: "User not found" });}
   

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      })
      console.log("stream user updated " + updatedUser.fullName);
    } catch (streamerror) {
      console.log("error updating stream user " + streamerror.message);
    }

    

   res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    
  }
}