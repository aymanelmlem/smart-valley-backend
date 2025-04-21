import mongoose,{Schema, Types} from "mongoose";
const sectionSchema=new Schema(
{
sectionName:
{
    type:String,
    required:true,
    min:1,
    max:150,
},

sectionDescribtion:
{
    type:String,
    required:true,
    min:1,
    max:250,
},

sectionHours:
{
    type:String,
    min:1,
    max:1000000,
    required:false,
},

course:
{
    type:Types.ObjectId,
    ref:"course",
    required:true,
},

objectiveFromSection:
{
    type:[{objectiveId:{type:String,min:5,max:10,required:true},objective:{type:String,required:true,min:1,max:150}}],
    required:true,
},
},{timestamps:true,toObject:{virtuals:true},toJSON:{virtuals:true},strictQuery:true});
sectionSchema.virtual("lessons",{localField:"_id",foreignField:"section",ref:"lesson"});
const sectionModel=mongoose.model("section",sectionSchema);
export default sectionModel;