import { Router } from "express";
import authUser from "../../auth/users.auth.js";
import * as validation from '../../validation/validation.js';
import * as subscribersSchema from './subscrubers.schema.js';
import * as subscribersController from './subscribers.controller.js';
const subscribersRoutes=Router({mergeParams:true});
// make the routes here and api's:
subscribersRoutes.post("/subscribeOnSpCourse/:courseId",authUser,validation.paramsValidation(subscribersSchema.subscibersToJoinSchema),subscribersController.subscribeOnSpCourse);
// get all my requests:
subscribersRoutes.get("/getMyRequets",authUser,subscribersController.getMyRequests)
// remove the request:
subscribersRoutes.delete("/deleteSpRequestOnSpourse/:requestId",authUser,validation.paramsValidation(subscribersSchema.removeMyRequest),subscribersController.removeMyRequest);
// get the information of contact:
subscribersRoutes.get("/getContactInfAboutSpIns/:courseId",authUser,validation.paramsValidation(subscribersSchema.subscibersToJoinSchema),subscribersController.getContactInformation);
// get the teavcher sor instrcutor information:
subscribersRoutes.get("/getInformationAboutSpInstrcutor/:courseId",authUser,validation.paramsValidation(subscribersSchema.subscibersToJoinSchema),subscribersController.getInsInformation)
export default subscribersRoutes;