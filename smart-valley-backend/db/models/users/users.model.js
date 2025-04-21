import mongoose,{Schema, Types} from "mongoose";
const userSchema=new Schema(
{
userName:
{
    type:String,
    required:true,
    min:2,
    max:200,
},
userEmail:
{
    type:String,
    required:true,
    unique:true,
    min:5,
    max:200,
},
userAge:
{
    type:Number,
    required:true,
},
profilePicture:
{
    type:{
        public_id:{type:String,min:5,max:400},
        secure_url:{type:String,min:5,max:400}
    },
    default:{secure_url:"https://th.bing.com/th/id/OIP.n2XS9sXAKYZwzTot_PaZ9wHaHa?rs=1&pid=ImgDetMain"},
    required:false,
},
password:
{
    type:String,
    required:true,
    min:8,
    max:20,
},
isActivated:
{
    type:Boolean,
    dafault:false,
},
passCode:
{
    type:String,
    required:false,
},
phoneNumber:
{
   type:String,
   required:true, 
},
likes:
{
    type:[{type:Types.ObjectId,ref:"course"}],
    default:[],
},
cart:
{
    type:[{type:Types.ObjectId,ref:"course"}],
    default:[],
}
},{timestamps:true,toObject:{virtuals:true},toJSON:{virtuals:true},strictQuery:true});


const userModel=mongoose.model("user",userSchema);


export default userModel;