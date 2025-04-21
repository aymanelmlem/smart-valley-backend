import courseModel from "../../../db/models/courses/courses.model.js";
import sectionModel from "../../../db/models/sections/section.model.js";

// this is all the sections middlewrae we need on it:
export async function checkOnSectionAndOwnerOfIt(req,res,next)
{
try
{
// get the id of the section:
const {sectionId}=req.params;
const {_id}=req.data;
const getSection=await sectionModel.findOne({_id:sectionId}).populate([{path:"course"}]);
if(!getSection)
{
    return next(new Error("the section is not exists the id is not correct or this section can be deleted"));
}
// check on the owner and check on the course:
if(getSection.course.instructor.toString()!=_id.toString())
{
    return next(new Error("sorry you can't update this section because you are not the owner of this course"));
}
// egt the data of the section:
req.section=getSection;
// go to the next middlewarev or controller:
return next();
}
catch(err)
{
    return next(err);
}
}