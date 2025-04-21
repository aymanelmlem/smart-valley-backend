import courseModel from "../../../db/models/courses/courses.model.js";
import sectionModel from "../../../db/models/sections/section.model.js";

async function checkOnLessonAndSection(req,res,next)
{
    try
    {
        // get he course  id:
        const {courseId}=req.params;
        // egt ghe oid of the user:
        const {_id}=req.data;
        const course=await courseModel.findOne({_id:courseId});
        if(!course)
        {
            return next(new Error("check the course id the course is not exists or ot may be deletd"));
        }
        // check on the owner of gthe section:
        if(course.instructor.toString()!=_id.toString())
        {
            return next(new Error("you are not the owner of this course to add any lesson to it"));
        }
        // get the sections id:
        const {section}=req.body;
        const sectionGet=await sectionModel.findOne({_id:section}).populate([{path:"course"}])
        if(!sectionGet)
        {
            return next(new Error("the section is not exists check the section id or it may be deletd"));
        }
        // check on the sections and check on the course and chekc on the owner of it:
        if(sectionGet.course._id.toString()!=courseId.toString())
        {
            return next(new Error("the section must be assigmed to this course first to do this"));
        }
        // get the id of the owner:
        if(sectionGet.course.instructor.toString()!=_id.toString())
        {
            return next(new Error("you are not the owner of this section to add to it any lesson"));
        }
        // go tot he next controller or middleWare:
        return next();
    }
    catch(err)
    {
        return next(err);
    }
}
export default checkOnLessonAndSection;