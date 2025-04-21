import { Router } from "express";
// import the controller:
import * as testSchema from './test.schema.js';
// import the controller  to make it good now then make it:
import * as testController from './tests.controller.js';
// import the params val an dother vaidation:
import * as validation from '../../validation/validation.js';
import authentecationEmployee from "../../auth/employee.auth.js";
import authorizationEmpoyee from "../../authorization/employee.authorization.js";
import checkInstrcutroOrnNot from "../courses/checkIfInstructorOrNot.js";
import authUser from "../../auth/users.auth.js";
// import the schema: 
// make the routes to the test:
const testRouter=Router({mergeParams:true});
// mak the test end points (api's):
// make the test by the ins or the superadmin in an sp course:
testRouter.post("/makeTest/:courseId",authentecationEmployee,authorizationEmpoyee("superAdmin","instructor"),checkInstrcutroOrnNot,validation.paramsValidation(testSchema.checkCousreId),validation.bodyValidation(testSchema.makeTestSchema),testController.makeNewTest)
// make an update:
testRouter.patch("/updateTestData/:testId",authentecationEmployee,authorizationEmpoyee("superAdmin","instructor"),checkInstrcutroOrnNot,validation.paramsValidation(testSchema.checkTestSchema),validation.queryValidation(testSchema.testQuestionUpdatingQuery),validation.bodyValidation(testSchema.makeUpdtaeOnTestQuestions),testController.updateTestData)
// delete the test:
testRouter.delete("/deleteTest/:testId",authentecationEmployee,authorizationEmpoyee("superAdmin","instrcuctor"),validation.paramsValidation(testSchema.checktestIdSchema),testController.deleteTest);
// solve the test by the students:
testRouter.post("/solveTheTest/:testId",authUser,validation.paramsValidation(testSchema.checktestIdSchema),validation.bodyValidation(testSchema.solveTestSchema),testController.solveTestSchema);
// get all the test for specefiec ins:
testRouter.get("/getTestsForIns",authentecationEmployee,authorizationEmpoyee("superAdmin","instructor"),validation.queryValidation(testSchema.testsForInsSchema),testController.getTestsForSuperAdmin);
// get specifiec data test:
testRouter.get("/getSpecefiecDataOfTestForIns/:testId",authentecationEmployee,authorizationEmpoyee("superAdmin","instructor"),validation.paramsValidation(testSchema.checktestIdSchema),testController.getSpecefiecTestData);
// get the results of specefiec tests to the ins:
testRouter.get("/getResultsForSpecefiecTestsForTheIns/:testId",authentecationEmployee,authorizationEmpoyee("superAdmin","instructor"),validation.paramsValidation(testSchema.checktestIdSchema),validation.queryValidation(testSchema.getResultForInsWIthFiltersOptions),testController.getTestsResultForIns);
// mark the test:
testRouter.patch("/updateResultByIns/:resultId",authentecationEmployee,authorizationEmpoyee("instructor","superAdmin"),validation.paramsValidation(testSchema.checkOnResultId),validation.bodyValidation(testSchema.markEssayQuestionSchema),testController.markEssayQuestion);
// get the test results for the students with all options of filter:
testRouter.get("/getTestMarks",authUser,validation.bodyValidation(testSchema.getResultsOptions),testController.getMarksForStudets);
// get all the test for sp course:
testRouter.get("/getCorseTests/:courseId",validation.paramsValidation(testSchema.checkCourseId),validation.queryValidation(testSchema.getWithFIlterOptionsForCourse),testController.getTheTestsThatRelatedToSpCourse);
// egtt he tets data to the std:
testRouter.get("/getTestDataToStd/:testId",authUser,validation.paramsValidation(testSchema.checktestIdSchema),testController.getTestDataToStdToSolve);
// get specefiec rseult to the user ofr the student:
testRouter.get("/getSpResToStd/:resId",authUser,validation.paramsValidation(testSchema.getSpRes),testController.getSpRseToStdController);
// get the specefiec result by the exam Id:
testRouter.get("/getTestResultToStd/:examId",authUser,validation.paramsValidation(testSchema.checkExamId),testController.getResByExamToUser)
export default testRouter;

