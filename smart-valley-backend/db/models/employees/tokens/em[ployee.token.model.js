import mongoose,{Schema, Types} from "mongoose";
const empTokenSchema=new Schema(
{
token:
{
    type:String,
    required:true,
    unique:true,
},
employee:
{
    type:Types.ObjectId,
    ref:"employee",
    required:true,
},
userAgent:
{
    type:String,
},
isValid:
{
    type:Boolean,
    default:true,
},
},{timestamps:true,toObject:{virtuals:true},toJSON:{virtuals:true},strictQuery:true});
const empTokenModel=mongoose.model("empToken",empTokenSchema);
export default empTokenModel;