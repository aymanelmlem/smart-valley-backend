import mongoose,{Schema, Types} from "mongoose";
const lessonSchema=new Schema(
{
lessonName:
{
    type:String,
    required:true,
    min:2,
    max:200,
},
lessonDescribtion:
{
    type:String,
    required:true,
    min:2,
    max:300,
},
whatWillYouLeanAfterThisLesson:
{
    type:String,
    required:true,
    min:2,
    max:300,
},

course:
{
    type:Types.ObjectId,
    ref:"course",
    required:true,
},

section:
{
    type:Types.ObjectId,
    ref:"section",
    required:true,
},

videos:
{
type:[{videoUrl:{type:String,required:true,min:2,max:250},videoId:{type:String,required:true,min:5,max:10}}],
required:false,
},

pdfs:
{
type:[{public_id:{type:String},secure_url:{type:String},UploadedId:{type:String,min:5,max:10},uploadText:{type:String,min:2,max:300}}],
default:[],
},

otherRequiredLinks:
{
type:[{link:{type:String,min:5,max:200},Describtion:{type:String,min:2,max:300},linkId:{type:String,min:5,max:10}}],
default:[],
},

timeOfLesson:
{
    type:String,
    required:true,
},
},{timestamps:true,toObject:{virtuals:true},toJSON:{virtuals:true},strictQuery:true});

const lessonModel=mongoose.model("lesson",lessonSchema);

export default lessonModel;