import FriendRequest from "../models/FriendsRequest.js"
import User from "../models/User.js"

export const getRecommendedUsers= async (req,res)=>{
    try {
        const currentUserId= req.user._id
    const currentUser= req.user

// here the conditions are we dont want to see our friends in the recommendation and also we dont want to see our self to be recommmended
    const  recommendedUsers = await User.find({
        //here when we use the $and we are saying that every thing in the array should be true inorder to be recommendedusers to be true
      $and:  [
        { _id: { $ne: currentUserId } }, //this will exclude current user
        { _id: { $nin: currentUser.friends } }, //this will exclude the current user's friends
        {isOnboard: true} //this will exclude users who are not onboarded
      ]
    })
    res.status(200).json( recommendedUsers)
    } catch (error) {
        console.log("error occured in recommended user",error)
        res.status(500).json({success:false, message:"error occured in recommended user"})
    }
}


export async  function getMyFriends(req,res){
    try {
        //here we are geting the friends array which contains the many usersids and from that we use the populate method which help us to get the datas of each ids that were in the friends array
        const user= await User.findById(req.user._id)
        .select("friends") //only the friends field will be selected from the user collection
        .populate("friends","fullName profilePic nativeLanguage leariningLanguage");
    
    res.status(200).json(user.friends)
    console.log(user)
    
    } catch (error) {
           console.log("error occured in friends",error)
        res.status(500).json({success:false, message:"error occured in recommended user"})
    }
}


export async function sendFriendRequest(req,res){
    try {
        const myId= req.user._id;
       const {id:recepientId}= req.params
      
       //preventes sending req to yourself
     if(myId==recepientId){
        return res.status(400).json({success:false,message:"you cant send friend request to yourself"})}
      
        //checks if the resipent is authenticated user
       const recepient= await User.findById(recepientId)

    if(!recepient){
        return res.status(404).json({success:false,message:"user not found"})
    }
    

    // checks if we are already freunds with this user
    if(recepient.friends.includes(myId)) {
        return res.status(400).json({message:"you are already friends with this user"})

    }



    const exsistingRequest= await FriendRequest.findOne({
        // when we say $or we are saying if any of the thing in the array existes it means there is exsistingrequest or exsistingrequest will be true
         $or : [
            {sender:myId , recipient: recepientId}, //so if this line or the second line is true  it means there is an exsisting user
            {sender: recepientId , recipient: myId}
         ]

    })


    if(exsistingRequest){
        return res.status(400).json({message:"you have already sent a friend request to this user"})
    }


    const friendRequest = await FriendRequest.create({
        sender: myId,
        recipient: recepientId,
    })


     res.status(201).json(friendRequest)


    } catch (error) {
        console.log("error occured in sendFriendRequest ",error)
        res.status(500).json({success:false, message:"error occured in recommended user"})
    }
}


export async function acceptFriendRequest(req,res,) {
try {
    const{id:requestId} = req.params // here we are naming the :id params as requestid
     
    const friendsRequest = await FriendRequest.findById(requestId);

    if(!friendsRequest){
        return res.status(404).json({message:"friend request not found"})
    }
    
    //verify the current user is the recipent
    //that means the function is accepting the request that means we are the recipient to check that
    if(friendsRequest.recipient.toString() !== req.user.id) { // in mongodb saying req.user.id rather than req.user._id gives us a plain string form of the _id authomaticaly
        return res.status(400).json({message:"you are not authorized to accept  this request"})
    }
     

    friendsRequest.status = "accepted"

    await friendsRequest.save();

    //add each user to others friends array

    await User.findByIdAndUpdate(friendsRequest.sender,{
        $addToSet : { friends: friendsRequest.recipient},
    })

     await User.findByIdAndUpdate(friendsRequest.recipient,{
        $addToSet : { friends: friendsRequest.sender},
    })
 
    res.status(200),json( {message:"friend request accepted successfully"})
} catch (error) {
 console.log("error occured in acceptFriendRequest",error)
        res.status(500).json({success:false, message:"error occured in recommended user"})
    }


}


export async function getFriendRequests(req,res){
    try {
        const incomingReqs = await FriendRequest.find({
           recipient : req.user._id,  
            status: "pending",
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage"); // the use of using this populate method is to serarch the fields that we have listed using the sender which is an id of the sender field in the friendrequest collection

        const acceptedReqs = await FriendRequest.find({
              sender:req.user_id,
              status: "accepted",
        }).populate("recipient", "fullName profilePic")

        res.status(200).json({incomingReqs,acceptedReqs})
        console.log (incomingReqs)
        console.log(acceptedReqs)
    } catch (error) {
         console.log("error occured in getFriendRequests",error)
        res.status(500).json({success:false, message:"error occured in recommended user"})
    
    }
}

export const getOutgoingFriendRequests=  async (req,res)=>{
  try {
    const outgoingReqs = await FriendRequest.find({
        sender:req.user._id,
        status: "pending",
        }).populate("recipient","fullName profilePic nativeLanguage learningLanguage"); // here it means use the rescpient which is the id of the reciver then gather the listed info from the db
    
        res.status(200).json(outgoingReqs)
  } catch (error) {
     console.log("error occured in getOutgoingFriendRequests  ",error)
        res.status(500).json({success:false, message:"error occured in recommended user"})
    
  }

}