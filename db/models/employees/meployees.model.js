import mongoose,{Schema, Types} from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
const employeeSchema=new Schema(
{
name:
{
type:String,
required:[true,"the name is an required field"],
unique:[true,"this nmae is already exists please enetr your full name"],
min:10,
max:100,
},
email:
{
type:String,
required:[true,"the email is required field"],
unique:[true,"this email is already exists"],
min:5,
max:70,
},
password:
{
type:String,
min:8,
max:20,
},
resetCode:
{
type:String,
min:8,
max:10,
},
emailCode:
{
type:String,
required:true,
unique:true,
min:8,
max:10,
},
isActivated:
{
type:Boolean,
default:false,
},
state:
{
type:String,
enum:["notInQueue",'underRevising','initiallyAccepted','accepted','rejected'],
},
reasonOfReject:
{
    type:String,
    min:5,
},
role:
{
type:String,
required:true,
enum:["admin","instructor","superAdmin"],
},
introductionPerson:
{
type:String,
min:10,
max:500,
},
job:
{
type:String,
},
profilePicture:
{
    type:{public_id:{type:String},secure_url:{type:String}},
    default:{secure_url:"https://www.redinteractive.co.uk/wp-content/uploads/2019/06/avatar-12.jpg"},
    required:false,
},
phone:
{
    type:String,
    required:true,
    unique:[true,"this phone is already exists"],
},
addedBy:
{
    type:Types.ObjectId,
    ref:"employee",
},
revisedBy:
{
    type:Types.ObjectId,
    ref:"employee",
},
pinCode:
{
    type:String,
    min:8,
    max:20,
},
// not added yet in the schema:
subjects:
{
    type:String,
    min:5,
    max:200,
},
address:
{
    type:String,
    required:true,
},
stoppedBySuperAdmin:
{
    type:Boolean,
    default:false,
},
conditionOfStop:
{
    type:String,
},
profileResume:
{
    type:{secure_url:{type:String,},public_id:{type:String,}},
    required:false,
},
payState:
{
    type:Boolean,
},
payResponsible:
{
    type:Types.ObjectId,
    ref:'employee',
},
stoppedBy:
{
    type:Types.ObjectId,
    ref:"employee",
},
loggedForAccepted:
{
    type:Number,
},
profileLinks:
{
    type:{facebook:{link:{type:String}},icon:{type:String,min:5,max:100},linkedin:{link:{type:String},icon:{type:String,}},youtube:{link:{type:String,},icon:{type:String,}},github:{icon:{type:String,},link:{type:String,}}},
    default:{facebook:{icon:"https://static.vecteezy.com/system/resources/previews/017/221/797/non_2x/facebook-logo-transparent-background-free-png.png",link:""},linkedin:{icon:"https://logospng.org/download/linkedin/logo-linkedin-icon-1536.png",link:""},youtube:{icon:"https://logos-world.net/wp-content/uploads/2021/04/Youtube-Music-Logo.png",link:""},github:{icon:"https://th.bing.com/th/id/R.bb04d77a846e6beca811c4be1d8e3442?rik=AHmbuAlB7uHcoA&pid=ImgRaw&r=0",link:""}}
}
}
,{timestamps:true,toObject:{virtuals:true},toJSON:{virtuals:true},strictQuery:true});
employeeSchema.plugin(uniqueValidator,{message:(props)=>`${props.value} is already exists please change it and try again`});
// make the virtual populate with the populate:
employeeSchema.virtual("courses",{localField:"_id",foreignField:"instructor",ref:"course"});
const employeeModel=mongoose.model("employee",employeeSchema);
export default employeeModel;
