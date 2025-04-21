import { Router } from "express";
import authentecationEmployee from "../../auth/employee.auth.js";
import authorizationEmpoyee from "../../authorization/employee.authorization.js";
import * as validation from '../../validation/validation.js'
import uploadingFileRequests from "../../utils/uploadingFiles.js";
import * as lesosnsController from './lesson.controller.js';
import * as lessonSchema from './lesson.schema.js';
import checkOnLessonAndSection from "./lesson.middleWare.js";
const lessonRouter=Router({mergeParams:true});
// lesson router:
// add lesson to sp couyrse with sp section:
lessonRouter.post("/addLesson/:courseId",authentecationEmployee,authorizationEmpoyee("superAdmin","instructor"),validation.paramsValidation(lessonSchema.checkCourseId),uploadingFileRequests().any(),validation.bodyValidation(lessonSchema.addLessonSchema),checkOnLessonAndSection,lesosnsController.addLesson);
// update the lessons:
lessonRouter.patch("/updateLesson/:lessonId",authentecationEmployee,authorizationEmpoyee("superAdmin","instructor"),validation.paramsValidation(lessonSchema.checkLessonId),validation.queryValidation(lessonSchema.updateLessonQuery),uploadingFileRequests().any(),validation.bodyValidation(lessonSchema.updateLessonSchema),lesosnsController.updateLesosn);
// delete lesson:
lessonRouter.delete("/deleteLesson/:lessonId",authentecationEmployee,authorizationEmpoyee("superAdmin","instructor"),validation.paramsValidation(lessonSchema.checkLessonId),lesosnsController.deleteLesosn);
// egt the lesosns by all filetr options:
lessonRouter.get("/getLessons",validation.queryValidation(lessonSchema.getLessonSchema),lesosnsController.getLesosns)
export default lessonRouter;