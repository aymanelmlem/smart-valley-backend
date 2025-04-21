import mongoose,{ mongo, Schema, Types } from "mongoose";

const resultsSchema=new Schema(
{
student:
{
type:Types.ObjectId,
ref:"partcipnts",
required:true,
},
test:
{
    type:Types.ObjectId,
    ref:"test",
    required:true,
},
finalResult:
{
    type:Boolean,
    required:true,
},
questionOfTest:
{
    type:[{}],
    required:true,
},
studentsAnswers:
{
type:[{type:{},required:true}],
required:true,
},
restOfQuestions:
{
    type:[
        {
            type:
            {
                question:{type:String,required:true},
                mark:{type:Number,required:true},
                studentAnswer:{type:String,required:true},
                questionId:{type:String,required:true},
                
            }
        }
    ],
    required:false,
},
totalMarksOfTest:
{
    type:Number,
    required:true,
},
studentMarks:
{
    type:String,
    required:true,
},
correctAnswers:
{
    type:[{type:
        {

        },
    }],
    required:false,
},
wrongAnswers:
{
    type:[{type:
        {

        },
    }],
    required:false,
},
abilityToseen:
{
    type:String,
    required:true,
    enum:["underMarking","marked"],
}
},{timestamps:true,toObject:{virtuals:true},toJSON:{virtuals:true},strictQuery:true});

const resultsModel=mongoose.model("result",resultsSchema);

export default resultsModel;