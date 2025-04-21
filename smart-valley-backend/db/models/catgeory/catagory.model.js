import mongoose,{Schema, Types} from "mongoose";
const categorySchema=new Schema(
{
categoryName:
{
    type:String,
    required:[true,"the catgeory name is required"],
    unique:true,
    min:2,
    max:70,
},
addedBy:
{
    type:Types.ObjectId,
    ref:"employee",
    required:true,
},
categoryPicture:
{
    type:
    {
        public_id:{type:String,},
        secure_url:{type:String,},
    },
    required:false,
    default:{secure_url:"https://th.bing.com/th/id/R.9d147188b35e44ca5022800226b0b2c1?rik=opzTAxSBNc7pjQ&riu=http%3a%2f%2fwww.sweetcaptcha.com%2fwp-content%2fuploads%2f2018%2f11%2fonline_certification_courses.jpeg&ehk=LPfNr4yNFgb07ggBWdWnHU4xj7Z9hDqIzLMu3zZsfMY%3d&risl=&pid=ImgRaw&r=0"},
},
subCategory:
{
    type:[{type:{subCategoryId:{type:String,required:true},subCategoryName:{type:String,min:2,max:60,unique:true}}}],
    default:[],
},
},{timestamps:true,toObject:{virtuals:true},toJSON:{virtuals:true},strictQuery:true,});
categorySchema.virtual("courses",{localField:"_id",foreignField:"category",ref:"course"});
const categoryModel=mongoose.model("category",categorySchema);
export default categoryModel;