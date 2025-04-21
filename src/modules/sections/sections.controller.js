import { nanoid } from "nanoid";
import courseModel from "../../../db/models/courses/courses.model.js";
import sectionModel from "../../../db/models/sections/section.model.js";
import checkOnCourseUpdateSchema from "../../utils/checkOnCourseUpdate.js";
import { addObjectiveAdd, addObjectiveDelete, addObjectiveUpdate } from "./sections.schema.js";
import lessonModel from "../../../db/models/lessons/lessons.model.js";

// add section controller:
export const addSection=async (req,res,next)=>
{
    try
    {
        // get the id of the user:
        const {_id}=req.data;
        // get  the data fro  the body:
        const data=req.body;
        // get  the id o the course:
        const {course}=data;
        // check if the user he is the owner of the course or not:
        const courseGet=await courseModel.findOne({_id:course});
        if(!courseGet)
        {
            return next(new Error("the course is not exists chekc the id or it may be deleted"));
        }
        if(courseGet.instructor.toString()!=_id.toString())
        {
            return next(new Error("sorry you can't add the section to this course because you are not the instructor of this course"));
        }
        // check on the objectives values:
        const {objectiveFromSection}=data;
        if(objectiveFromSection)
        {
            if(objectiveFromSection.length>0)
            {
                // make the code:
                let arrayWillAdd=[];
                objectiveFromSection.forEach((ele)=>
                {
                    const objectMake={};
                    objectMake.objectiveId=nanoid(5);
                    objectMake.objective=ele;
                    arrayWillAdd.push(objectMake);
                });
                data.objectiveFromSection=arrayWillAdd;
            }
        }
        // make the section document:
        await sectionModel.create(data);
        // get all the sections of the course:
        const allSections=await sectionModel.find({course:course}).sort("createdAt");
        // return the response:
        return res.json({success:true,message:"the section is added sucessfully",courseSections:allSections});
    }
    catch(err)
    {
        return next(err);
    }
}
// update sections:
export const updateSection=async (req,res,next)=>
{
    try
    {
        // get the data:
        const data=req.body;
        // egt the secton data:
        const sectionData=req.section;
        // get the id of the ins:
        const {_id}=req.data;
        // get the id of the section:
        const {sectionId}=req.params;
        // chekc on the course of it exists:
        const {course}=data;
        if(course)
        {
            // check on the course if it exists:
            const courseGet=await courseModel.findOne({_id:course})
            if(!courseGet)
            {
                return next(new Error("the course is not exists check the id or it may be deleted"));
            }
            // cehck on the owner of it:
            if(courseGet.instructor.toString()!=_id.toString())
            {
                return next(new Error("you can't get update the course section because you are not the owner of the cousre"));
            }
        }
        // check on the objective:
        const {objectiveFromSection}=data;
        if(objectiveFromSection)
        {
            if(objectiveFromSection.length>0)
            {
               // check on the query:
               const {objective}=req.query;
               if(!objective)
               {
                return next(new Error("the objective must be send in the query required"));
               }
               if(objective=="add")
               {
                // make the vaidation for add:
                const result=checkOnCourseUpdateSchema(addObjectiveAdd,objectiveFromSection);
                const get=result(req,res,next);
                if(!get)
                {
                    return next(new Error("this is an error ij the validation"));
                }
                // loop and mke the coee:
                let arrayDoIt=[...sectionData.objectiveFromSection];
                for(let i=0;i<objectiveFromSection.length;i++)
                {
                    let objectMake={};
                    objectMake.objectiveId=nanoid(5);
                    objectMake.objective=objectiveFromSection[i];
                    arrayDoIt.push(objectMake);
                }
                data.objectiveFromSection=arrayDoIt;
               }
               else if(objective=="delete")
               {
                // vaidate then make the coe of delete:
                const getVal=checkOnCourseUpdateSchema(addObjectiveDelete,objectiveFromSection);
                const getRes=getVal(req,res,next);
                if(!getRes)
                {
                    return next(new Error("the validation is nit true"));
                }
                for(let i=0;i<objectiveFromSection.length;i++)
                {
                    const updatedSection=await sectionModel.findOneAndUpdate({_id:sectionId,'objectiveFromSection.objectiveId':objectiveFromSection[i]},{$pull:{objectiveFromSection:{objectiveId:objectiveFromSection[i]}}});
                    if(!updatedSection)
                    {
                        return next(new Error("the objective id is not exists or not trues check it and try again"));
                    }
                }
                delete data.objectiveFromSection;
               }
               else if(objective=="update")
               {
                // make the validation for update first:
                const getValidate=checkOnCourseUpdateSchema(addObjectiveUpdate,objectiveFromSection);
                const getRes=getValidate(req,res,next);
                if(!getRes)
                {
                    return next(new Error("the validation have an error"));
                }
                for(let i=0;i<objectiveFromSection.length;i++)
                {
                    let {id,newObjective}=objectiveFromSection[i];
                    const getSectionNew=await sectionModel.findOneAndUpdate({_id:sectionId,'objectiveFromSection.objectiveId':id},{$set:{'objectiveFromSection.$.objective':newObjective}});
                    if(!getSectionNew)
                    {
                        return next(new Error("the objective id is not exists check it and try"));
                    }
                }
                delete data.objectiveFromSection;
               }
               else
               {
                return next(new Error("the value of objective query must be add or delete or update"));
               }
               // validate the values:
            }
            else
            {
                delete data.objectiveFromSection;
            }
        }
        // update:
        const getNewSection=await sectionModel.findOneAndUpdate({_id:sectionId},data,{new:true});
        // reutn the resposne:
        return res.json({success:true,message:"the section is successfully updated",sectionAfterUpdate:getNewSection});
    }
    catch(err)
    {
        return next(err);
    }
}
// delete sections:
export const deleteSection=async (req,res,next)=>
{
try
{
// get the id of the section:
const {sectionId}=req.params;
// delete it:
await sectionModel.deleteOne({_id:sectionId});
// delete all the lessons that assigned to this section:
await lessonModel.deleteMany({section:sectionId});
// get ll the sections:
const sections=await sectionModel.find().sort("createdAt");
// retrunt he response:
return res.json({success:true,message:"the sections with his lessons is deleted sucessfully",sections});
}
catch(err)
{
    return next(err);
}
}
// get all the sections with all filters(name),(hours),(courseId),id of the sections(with no lessons)/ and with lessons if you want:
export const getSections=async (req,res,next)=>
{
    try
    {
        //egtt he id og the section:
        const {courseId}=req.params;
        // cchekc ont it:
        const course=await courseModel.findOne({_id:courseId});
        if(!course)
        {
            return next(new Error("the course is not exists it may be deletd check the id and try again"));
        }
        let sections=[];
        // get the data of the filter:
        const data=req.query;
        // check if it empty:
        if(Object.keys(data).length==0)
        {
            // make tghe dafult:
            sections=await sectionModel.find({course:courseId}).populate([{path:"course"},{path:"lessons"}]).sort("createdAt");
            // return the response:
            return res.json({success:true,sections,sectionsNumbers:sections.length});
        }
        // chekc if the fierlds are empty:
        const mapObject=new Map(Object.entries(data));
        let flag=false;
        mapObject.forEach((value,key)=>
        {
            if(value)
            {
                flag=true;
            }
        });
        if(!flag)
        {
            // make the dafulst:
                        // make tghe dafult:
                        sections=await sectionModel.find({course:courseId}).populate([{path:"course"},{path:"lessons"}]).sort("createdAt");
                        // return the response:
                        return res.json({success:true,sections,sectionsNumbers:sections.length});
        }
        // cehck now on tyhe object:
        let objectFilter={}
        if(data.sectionName)
        {
            objectFilter.sectionName={$regex:data.sectionName,$options:"i"};
        }
        if(data.sectionId)
            objectFilter._id=data.sectionId;
        // retur the response:
        sections=await sectionModel.find({course:courseId,...objectFilter}).populate([{path:"course"},{path:"lessons"}]).sort("createdAt");
        return res.json({success:true,sections,sectionsNumbers:sections.length});
    }
    catch(err)
    {
        return next(err);
    }
}
