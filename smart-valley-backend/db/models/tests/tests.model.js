
import mongoose, { Schema, Types } from "mongoose";
const testsSchema = new Schema(
  {
    testName: {
      type: String,
      required: true,
    },
    forCourse: {
      type: Types.ObjectId,
      ref: "course",
      required: true,
    },
    testQuestions: {
      type: [
        {
          question: { type: String, required: true, min: 1, max: 30000 },
          questionsChooses: {
            type: [
              {
                chooseNumber: {
                  type: String,
                  required: true,
                  min: 1,
                  max: 30000,
                },
                choose: { type: String, required: true, min: 1, max: 30000 },
                chooseId:{type:String,min:5,max:6,require:true},
              },
            ],
            required: false,
          },
          questionPhoto: { type: String,},
          questionNote: { type: String, min: 1, max: 1000 },
          questionMarks:{type:Number,required:true,min:0,max:1000},
          questionAnswer: {
            type: [
              {
                chooseId:{type:String,required:true,min:4,max:10},
                choose:{type:String,required:true,min:1,max:20000,},
                answerId:{type:String,required:true,min:4,max:10}
              },
            ],
          },
          questionId: {
            type: String,
            min: 5,
            max: 6,
            required: true,
            unique: true,
          },
        },
      ],
      required: true,
    },
    acceptAnwers:{
      type:Boolean,
      default:true,
    },
    autoCorrectOrNot:
    {
      type:Boolean,
      required:true,
    }
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    strictQuery: true,
  }
);
// the test model and make it now:
const testModel=mongoose.model("test",testsSchema);

export default testModel;