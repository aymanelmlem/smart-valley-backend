import courseModel from "../../../db/models/courses/courses.model.js";
import participntsModel from "../../../db/models/participnts/partcipints.model.js";
import subscribersModel from "../../../db/models/subscribers/subscribers.model.js";

// subscriobe to sp course:
export const subscribeOnSpCourse=async (req,res,next)=>
{
    try
    {
        // get the user and get the user id:
        const {_id}=req.data;
        // get the course:
        const {courseId}=req.params;
        // hck eon the course if it exists or not:
        const getCourse=await courseModel.findOne({_id:courseId}).populate([{path:"instructor"}]);
        if(!getCourse)
        {
            return next(new Error("the course is not exists check the id or it may deleted"));
        }
        const {phone}=getCourse.instructor;
        // check now if the course you want to join to is free or not:
        if(getCourse.coursePrice=="free")
        {
            // check now if he join before or not:
            const partCipntsOrNot=await participntsModel.findOne({user:_id,course:courseId});
            if(partCipntsOrNot)
            {
                return next(new Error("you already have this course in your courses lists"));
            }
            // make the document on the participnts model:
            await participntsModel.create({user:_id,course:courseId});
            // returnt he response:
            return res.json({success:true,message:"you joined to the course sucesssfully,now you can access all the data in the course"});
        }
        // check now if the smae user make a same request or not:
        const makenBefore=await subscribersModel.findOne({subscribeId:_id,courseId:courseId});
        if(makenBefore)
        {
            //make the logic first:
            if(makenBefore.state=="notSeenYet"||makenBefore.state=="paused"||makenBefore.state=="noActionTaken")
            {
                return next(new Error("you already have request to this course before it must seen fisrt by the instructor of course then you can make another request"));
            }
            // make the requets:
            await subscribersModel.create({subscribeId:_id,courseId:courseId});
            // retur the response:
            return res.json({success:true,message:`your subscibe request is send to the instructor sucessfully contact with him on this number ${phone} to confirm your reservation`});
        }
        else
        {
                       // make the requets:
                       await subscribersModel.create({subscribeId:_id,courseId:courseId});
                       // retur the response:
                       return res.json({success:true,message:`your subscibe request is send to the instructor sucessfully contact with him on this number ${phone} to confirm your reservation`});
        }
    }
    catch(err)
    {
        return next(err);
    }
}
// remove the request:
export const removeMyRequest=async (req,res,next)=>
{
try
{
// get the id of he user:
const {_id}=req.data;
// get the request id:
const {requestId}=req.params;
const getRequest=await subscribersModel.findOne({_id:requestId});
if(!getRequest)
{
    return next(new Error("there is no request by this id chekc the id and try again or it may be deleted"));
}
// check the user if he is the owener of this request or not:
if(getRequest.subscribeId.toString()!=_id.toString())
{
    return next(new Error("you aren't the owner of this request to make any change on it"));
}
// check the state of the request:
if(getRequest.state!="notSeenYet"&&getRequest.state!="noActionTaken")
{
    return next(new Error("you can't remove this request after this evaluate by the instructor of the course"));
}
// make the query:
await subscribersModel.deleteOne({_id:requestId});
const getMyCoursesState=await subscribersModel.find({subscribeId:_id}).populate([{path:"courseId"}]);
// retur the resonse:
return res.json({success:true,message:"the request is deleted sucessfully",myRequests:getMyCoursesState,numberOfMyRequestsNow:getMyCoursesState.length});
}
catch(err)
{
    return next(err);
}
}
// get my requests now:
export const getMyRequests=async (req,res,next)=>
{
try
{
    // get the id of he user:
    const {_id}=req.data;
    const requests=await subscribersModel.find({subscribeId:_id}).populate([{path:"courseId",populate:[{path:"instructor"}]}]);
    // retur the resposne:
    return res.json({success:true,requests,numberRequests:requests.length});
}
catch(err)
{
    return next(err);
}
}
// get the sp contact info rmation with the instrcuctor:
export const getContactInformation=async (req,res,next)=>
{
    try
    {
        // get the id of the course:
        const {courseId}=req.params;
        const getIns=await courseModel.findOne({_id:courseId}).populate([{path:"instructor"}]);
        if(!getIns)
        {
            return next(new Error("the course is not exists check the id ot it may be deleted"));
        }
        const {instructor}=getIns;
        // retur the resposne:
        return res.json({success:true,instrcutorInfo:instructor});
    }
    catch(err)
    {
        return next(err);
    }
}
// get infomration about specefiec insrtcitors:
export const getInsInformation=async (req,res,next)=>
{
    try
    {
        // egt the id of the course:
        const {courseId}=req.params;
        // chekc on if the coure is exists or not:
        const course=await courseModel.findOne({_id:courseId}).populate([{path:"instructor"}]);
        if(!course)
        {
            return next(new Error("the course id is not tru or the course is may be deleted"));
        }
        const {instructor}=course;
        // return the response:
        return res.json({success:true,instructorData:instructor});
    }
    catch(err)
    {
        return next(err);
    }
}