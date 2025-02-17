import {User} from "../models/user.model.js";

export const authCallback = async(req, res) => {
    try {
        const {id, firstName, lastName, imageUrl} = req.user;
        const user = await User.findOne({clerkId: id})
        if(!User){
            await User.create({
                clerkId: id,
                name: `${firstName} ${lastName}`,
                imageUrl,
            })
        }
        res.status(200).json({success: true});
    } catch (err){
        console.log("Error in auth callback", err);
        res.status(500).json({success: false});
    }
}