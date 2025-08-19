import express from 'express' // eslint-disable-disable-next-line
import { protectRoute } from '../middleware/auth.middleware.js';
import { sendFriendRequest, getOutgoingFriendRequests,getMyFriends,getRecommendedUsers, getFriendRequests, acceptFriendRequest } from '../controllers/user.controller.js';

const router = express.Router(); // eslint-disable-next-line
// this means apply the auth middleware to all routes
router.use(protectRoute);



router.get("/",getRecommendedUsers);
router.get("/friends",getMyFriends)

router.post("/friend-request/:id",sendFriendRequest)
router.put("/friend-request/:id/accept",acceptFriendRequest)

router.get("/friend-requests" , getFriendRequests)

router.get("/outgoing-friend-requests", getOutgoingFriendRequests)


//todo forget password
// email verification




export default router; // eslint-disable-next-line