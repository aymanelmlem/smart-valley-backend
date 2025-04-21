import mongoose,{Schema, Types} from "mongoose";
const TokenUserModel=new Schema(
{
userToken:
{
    type:String,
    required:true,
    min:5,
    unique:true,
},
user:
{
    type:Types.ObjectId,
    ref:"user",
    required:true,
},
isValid:
{
    type:Boolean,
    default:true,
},
userAgent:
{
    type:String,
    required:false,
}
},{timestamps:true,toObject:{virtuals:true},toJson:{virtuals:true},strictQuery:true});

const userTokenModel=mongoose.model("userToken",TokenUserModel);
export default userTokenModel;