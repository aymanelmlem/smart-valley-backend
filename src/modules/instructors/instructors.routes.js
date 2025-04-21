import { application, Router } from "express";
import * as validation from '../../validation/validation.js';
import * as insController from './instructor.controller.js';
import * as insSchema from './instructor.schema.js';
import uploadingFileRequets from "../../utils/uploadingFiles.js";
import authentecationEmployee from './../../auth/employee.auth.js';
import authorizationEmpoyee from "../../authorization/employee.authorization.js";
import courseRouter from "../courses/courses.routes.js";
import lessonRouter from "../lessons/lesson.routes.js";
import testRouter from "../test/test.routes.js";
const instRouter=Router({mergeParams:true });
// cousrers routes:
instRouter.use("/courses",courseRouter);
// tests router:
instRouter.use("/test",testRouter);
// instriuctors api's:
// add request:
instRouter.post("/addRequestInstructor",uploadingFileRequets().any(),validation.bodyValidation(insSchema.addRequestSchema),insController.addRequet);
// delete request:
instRouter.delete("/insRequet",authentecationEmployee,insController.deleteRequet);
// get the request result:
instRouter.get("/getRequestResult",authentecationEmployee,authorizationEmpoyee("instructor"),insController.getInsReqRes);
// delete the account:
instRouter.delete("/deleteMyAccount",authentecationEmployee,authorizationEmpoyee("instructor"),insController.deleteAccount)
// get sp ins:
instRouter.get("/getSpInsAboutSpCourse/:insId",validation.paramsValidation(insSchema.checkIdOfIns),insController.getSpInsToUser);
// get the requests to the instructors only to specefiec instrcutors:
instRouter.get("/getAllRequetsToBuyCourse",authentecationEmployee,authorizationEmpoyee("instructor","superAdmin"),validation.queryValidation(insSchema.getRequetsToJoinCoursesSchema),insController.getRequetsOfJoinCourses)
// evaluate an sp requets fron the studensts:
instRouter.patch("/evaluateRequestOfStudent/:requestId",authentecationEmployee,authorizationEmpoyee("instructor","superAdmin"),validation.paramsValidation(insSchema.checkRequestId),validation.bodyValidation(insSchema.evaluateRequestOfStudent),insController.evaluateRequetsForJoin)
// get the dashboards for the ins:
instRouter.get("/getInsDahboard",authentecationEmployee,authorizationEmpoyee("instructor"),insController.getInsDashboard)
export default instRouter;