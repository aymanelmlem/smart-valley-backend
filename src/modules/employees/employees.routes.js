import {Router} from 'express';
import * as empController from './employees.controller.js';
import * as empSchema from './employees.schema.js';
import * as validation from '../../validation/validation.js';
import checkIfAdminOrNot from '../../utils/checkIfEmpAdminOrNot.js';
import uploadingFileRequets from '../../utils/uploadingFiles.js';
import authentecationEmployee from '../../auth/employee.auth.js';
import authorizationEmpoyee from '../../authorization/employee.authorization.js';
import checkEmployee from '../../utils/checkEmployeeForUpdate.js';
import instRouter from '../instructors/instructors.routes.js';
import courseRouter from '../courses/courses.routes.js';
const empRouter=Router({mergeParams:true});
// api's of the employees:(admins actions):
// rpoutes fro the instrcutor api's:
empRouter.use("/instructors",instRouter);
//courses routes:
empRouter.use("/courses",courseRouter);
// add new employee from the admin (can be admin or instructor):
empRouter.post("/addNewEmployee",authentecationEmployee,authorizationEmpoyee("superAdmin"),uploadingFileRequets().any(),checkIfAdminOrNot,empController.addEmployeeByAdmin);
// active the accosount of the employeee whcih is added by the admin:
empRouter.patch("/activeAccEmpAAddedByAdmin",validation.bodyValidation(empSchema.activeAccountWhichAddedByAdmin),empController.activeyourAcceountWhichAddedByAdmin);
// login as admin:
empRouter.patch("/loginAsEmployee",validation.bodyValidation(empSchema.loginByEmailAndPasswordForEmployee),empController.loginAsEmployeeByEmailAndPassword);
// get he pinCode for the login:
empRouter.post("/loginByPinCodeForEmp",validation.bodyValidation(empSchema.getPinCodeSchemaForEmployee),empController.getPinCodeForLogin);
// update the data(email,data,profilePicture):
empRouter.patch("/updateEmployeeData",authentecationEmployee,uploadingFileRequets().any(),checkEmployee(),validation.queryValidation(empSchema.uploadingPhotoSchema),empController.updateEmpData);
// update pass:s
empRouter.patch("/updatePass",authentecationEmployee,validation.bodyValidation(empSchema.upadtePassSchema),empController.updatePass)
// forget pinCode:
empRouter.patch("/forgetPinCode",validation.bodyValidation(empSchema.forgetPinCodeGetEmailSchema),empController.forgetPinCode)
// forget pass:
empRouter.patch("/forgetPass",validation.bodyValidation(empSchema.forgetPass),empController.forgetPassController);
// egt the code of forget pass:
empRouter.patch("/getCodeToConfirmForgetPass",validation.bodyValidation(empSchema.getCodeForForgetPassSchema),empController.getCodeForPass);
// logout:
empRouter.get("/logoutEmployee",authentecationEmployee,empController.logout);
// we have an update on the adding employee algorithm(not done);
/////////////////////////////////////
// admin and the superadmin operations:
empRouter.get("/getAllRequests",authentecationEmployee,authorizationEmpoyee("admin","superAdmin"),validation.queryValidation(empSchema.getRequestsSchema),empController.getRequests);
// acept or reject the request:
empRouter.patch("/evaluateRequest/:requestId",authentecationEmployee,authorizationEmpoyee("admin","superAdmin"),validation.bodyValidation(empSchema.updateStateSchema),validation.paramsValidation(empSchema.chekcIdRequets),empController.acceptOrRejectRequest);
// et all the employees or get sp empl,oyee:
empRouter.get("/getEmployeessForSuperAdmin",authentecationEmployee,validation.queryValidation(empSchema.getEmployeeesSchema),empController.getEmployeesForSuperAdmin);
// update payment state:
empRouter.patch("/updatePayStateForEMplyee/:empId",authentecationEmployee,authorizationEmpoyee("superAdmin"),validation.paramsValidation(empSchema.employeeId),validation.bodyValidation(empSchema.updatePayemntState),empController.payStateUpdtae);
// stop or un stop user employee by the superAdmin:
empRouter.patch("/updateEmployeeStopState/:empId",authentecationEmployee,authorizationEmpoyee("superAdmin"),validation.paramsValidation(empSchema.employeeId),validation.bodyValidation(empSchema.updateStopState),empController.stopEmployeeOrUnStopHim)
// get the persons or superdmins data who are stop employee or do any thing:
empRouter.get("/getSuperAdminsDataWhoAreStopEmployee",empController.getDataOfIStoppedBYOrState);
// delete the employee by the superAdmin:
empRouter.delete("/deleteEmployeeBySuperAdmin/:empId",authentecationEmployee,authorizationEmpoyee("superAdmin"),validation.paramsValidation(empSchema.checkEmployee),empController.deleteEmployeeBySuperAdmin);
empRouter.get("/getProfileOfEmployee",authentecationEmployee,empController.getEmpProfile);
empRouter.patch("/updateProfileLinksForEmployees",authentecationEmployee,authorizationEmpoyee("superAdmin","instructor"),validation.bodyValidation(empSchema.updateProfleLinks),empController.updateProfileLinksController);
// get the to watch the video:
empRouter.get("/watchVideoCourses/:courseId",authentecationEmployee,authorizationEmpoyee("superAdmin","instructor"),validation.paramsValidation(empSchema.checkcourseId),empController.watchMediaOfCourse);
// make dashbords for superAdmin:
empRouter.get("/getDashboarsdForSupeAdmin",authentecationEmployee,authorizationEmpoyee("superAdmin"),empController.getDashbForSuperAdmin);
// get dashboards for every employee to the super admin:
empRouter.get("/getSpInsForSuperAdminDashboard/:insId",authentecationEmployee,authorizationEmpoyee("superAdmin"),validation.paramsValidation(empSchema.checkInsId),empController.getDashboardForSpIns)


export default empRouter