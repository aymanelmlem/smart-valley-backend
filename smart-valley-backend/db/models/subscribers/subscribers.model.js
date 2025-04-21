import mongoose,{Schema, Types} from "mongoose";

const subscribersSchema=new Schema(
{
subscribeId:
{
    type:Types.ObjectId,
    ref:"user",
    required:[true,"the id os subscribers is required"],
},
courseId:
{
    type:Types.ObjectId,
    ref:"course",
    required:true,
},
state:
{
    type:String,
    enum:["notSeenYet","noActionTaken","paused","payed","notPayed","rejectedRequest"],
    default:"notSeenYet",
}
},{timestamps:true,toObject:{virtuals:true},toJSON:{virtuals:true},strictQuery:true});

const subscribersModel=mongoose.model("subscriber",subscribersSchema);
export default subscribersModel;