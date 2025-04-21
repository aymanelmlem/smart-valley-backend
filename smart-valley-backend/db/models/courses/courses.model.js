import mongoose,{Schema, Types} from "mongoose";
const coursesSchema=new Schema(
{
courseName:
{
    type:String,
    required:[true,"the courseName is required"],
},
courseHours:
{
    type:String,
    required:false,
},
courseDescription:
{
    type:String,
    required:true,
},
coursePicture:
{
    type:{public_id:{type:String},secure_url:{type:String}},
    default:{secure_url:"https://th.bing.com/th/id/OIP.afNN71LYRc9tIlOvk6EKUwHaE8?w=234&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"},
},
coursePrice:
{
    type:String,
    required:[true,"course price is required"],
},
instructor:
{
    type:Types.ObjectId,
    ref:"employee",
    required:[true,"instructor id required"],
},
accesibleByAnyOne:
{
    type:
    {
        videoUrl:{type:[{type:{urlId:{type:String,required:true},url:{type:String,required:true}},required:false}],required:true},
        describtion:{type:[{describtionId:{type:String,required:true},describtionContent:{type:String,required:true}}],required:true}
    },
    required:false,
},
whatWillYouLearn:
{
    type:[{id:{type:String,required:true},objective:{type:String,required:true}}],
    required:true,
},
teachedBy:
{
    type:String,
    required:true,
    min:2,
    max:60,
},
category:
{
    type:Types.ObjectId,
    ref:"category",
    required:false,
},
subCategory:
{
    type:{subCategoryId:{type:String,min:5,required:true},subCategory:{type:String,required:true}},
    required:false,
},
},{timestamps:true,toObject:{virtuals:true},toJSON:{virtuals:true},strictQuery:true});
coursesSchema.virtual("sections",{localField:"_id",foreignField:"course",ref:"section"});
const courseModel=mongoose.model("course",coursesSchema);
export default courseModel;