import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema=  new mongoose.Schema({
    fullName: {
       type:String,
       required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,

    },
    bio:{
        type:String,
        default:"",

    },
    profilePic:{
        type:String,
        default:"",
    },
       nativeLanguage:{
        type:String,
        default:"",
    },
       learningLanguage:{
        type:String,
        default:"",
    },
       location:{
        type:String,
        default:"",
    },
       isOnboard:{
        type:Boolean,
        default:false,
    },
    friends:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
    ]

},{timestamps:true})



userSchema.pre("save", async function (next) {   /// this trying to say before you save a user to the data base do this in this case hash the password
  if (!this.isModified("password")) return next(); // this means if the user is trying to update something other than the password just dont do the hashing staf just move to the next 

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {   // this is a function that is used to check or compare the password that we got from the body
  const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
  return isPasswordCorrect;
};


const User=mongoose.model('User',userSchema);
export default User;