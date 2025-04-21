import mongoose,{Schema, Types} from "mongoose";
const participntsSchema=new Schema(
{
user:
{
    type:Types.ObjectId,
    ref:"user",
    required:true,
},
course:
{
    type:Types.ObjectId,
    ref:"course",
    required:true,
}
},{timestamps:true,toObject:{virtuals:true},toJSON:{virtuals:true},strictQuery:true});

const participntsModel=mongoose.model("partcipnts",participntsSchema);


export default participntsModel;



