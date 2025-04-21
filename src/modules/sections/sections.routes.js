import { Router } from "express";
import * as sectionsSchema from './sections.schema.js';
import * as sectionController from './sections.controller.js';
import authentecationEmployee from "../../auth/employee.auth.js";
import authorizationEmpoyee from "../../authorization/employee.authorization.js";
import checkInstrcutroOrnNot from "../courses/checkIfInstructorOrNot.js";
import * as validation from '../../validation/validation.js';
import * as sectionsMiddleWare from '../../utils/sectionsMiddleware/sections.middelware.js';
import lessonRouter from "../lessons/lesson.routes.js";
const sectionRouter=Router({mergeParams:true});
sectionRouter.use("/lessons",lessonRouter);
// sections api's:
// add section:
sectionRouter.post("/addSection",authentecationEmployee,authorizationEmpoyee("instructor","superAdmin"),checkInstrcutroOrnNot,validation.bodyValidation(sectionsSchema.addSectionSchema),sectionController.addSection);
// delete section:
sectionRouter.delete("/deleteSection/:sectionId",authentecationEmployee,authorizationEmpoyee("superAdmin","instructor"),validation.paramsValidation(sectionsSchema.checkSection),sectionsMiddleWare.checkOnSectionAndOwnerOfIt,sectionController.deleteSection)
// update section:
sectionRouter.patch("/updateSection/:sectionId",authentecationEmployee,authorizationEmpoyee("superAdmin","instructor"),validation.paramsValidation(sectionsSchema.checkSection),sectionsMiddleWare.checkOnSectionAndOwnerOfIt,validation.bodyValidation(sectionsSchema.updateSection),validation.queryValidation(sectionsSchema.checkIfObJectiveQuery),sectionController.updateSection);
// get sections from all options of filter(all):
sectionRouter.get("/getSectionsOfSpCourse/:courseId",validation.paramsValidation(sectionsSchema.courseCheck),validation.queryValidation(sectionsSchema.getSecionsWithAllFiltersOptions),sectionController.getSections)
export default sectionRouter;