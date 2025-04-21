import joi from 'joi';
export const addAdminSchemaByAdmin=joi.object(
{
name:joi.string().required().min(10).max(100),
email:joi.string().email().required(),
role:joi.string().valid("admin","instructor").required(),
phone:joi.string().regex(/^(010|011|012|015)[0-9]{8,9}$/).required(),
address:joi.string().min(10).max(200).required(),
}).required();
export const addInstructorSchemaByAdmin=joi.object(
{
name:joi.string().required().min(10).max(100),
email:joi.string().email().required(),
role:joi.string().valid("admin","instructor").required(),
phone:joi.string().regex(/^(010|011|012|015)[0-9]{8,9}$/).required(),
job:joi.string().min(5).required(),
introductionPerson:joi.string().min(10).max(500).required(),
subjects:joi.string().min(5).max(200).required(),
address:joi.string().min(5).max(200).required(),
}).required();
export const activeAccountWhichAddedByAdmin=joi.object(
{
email:joi.string().email().required(),
code:joi.string().required(),
}).required();
export const loginByEmailAndPasswordForEmployee=joi.object(
{
email:joi.string().email().required(),
password:joi.string().required(),
}).required();
export const getPinCodeSchemaForEmployee=joi.object(
{
email:joi.string().email().required(),
password:joi.string().required(),
pinCode:joi.string().required(),
}).required();
export const upadtePassSchema=joi.object(
{
password:joi.string().required(),
newPass:joi.string().min(8).max(20).required(),
rePass:joi.string().valid(joi.ref("newPass")).required(),
}).required();
export const forgetPinCodeGetEmailSchema=joi.object(
{
email:joi.string().email().required(),
}).required();
export const forgetPass=joi.object(
{
email:joi.string().email().required(),
}).required();
export const getCodeForForgetPassSchema=joi.object(
{
email:joi.string().email().required(),
resetCode:joi.string().required(),
pass:joi.string().required(),
rePass:joi.string().valid(joi.ref("pass")).required(),
}).required();
export const updateInstructorData=joi.object(
{
email:joi.string().email(),
introductionPerson:joi.string().min(10),
job:joi.string().min(2),
phone:joi.string().regex(/^(010|011|015|012)[0-9]{8,9}$/),
address:joi.string().min(10),
}).required();
export const updateAdminData=joi.object(
{
email:joi.string().email(),
phone:joi.string().regex(/^(010|011|012|015)[0-9]{8,9}$/),
address:joi.string().min(10),
}).required();
export const updateSuperAdminData=joi.object(
{
name:joi.string().min(10).max(100),
email:joi.string().email(),
phone:joi.string().regex(/^(010|011|012|015)[0-9]{8,9}$/),
address:joi.string().min(10),
}).required();
export const uploadingPhotoSchema=joi.object(
{
profilePicture:joi.string().valid("delete").allow(""),
}).required();
export const getRequestsSchema=joi.object(
{
name:joi.string().min(1).allow(''),
requestId:joi.string().min(5).allow(''),
state:joi.string().valid('notInQueue','underRevising','initiallyAccepted','accepted','rejected'),
date:joi.date().allow(''),
revisedBy:joi.string().min(5).allow(''),
}).required();
export const updateStateSchema=joi.object(
{
state:joi.string().valid('initiallyAccepted','accepted','rejected').required(),
reasonOfReject:joi.string().min(5),
payState:joi.boolean().valid(true,false),
}).required();
export const chekcIdRequets=joi.object(
{
requestId:joi.string().min(5).required(),
}).required();
export const getEmployeeesSchema=joi.object(
{
name:joi.string().min(1).allow(''),
email:joi.string().email().allow(''),
phone:joi.string().min(1).allow(''),
role:joi.string().valid('admin','instructor').allow(''),
stoppedBySuperAdmin:joi.boolean().valid(true,false,'true','false').allow(''),
payState:joi.boolean().valid('true','false',true,false).allow(''),
externalOrNot:joi.string().valid("yes","no").allow(''),
state:joi.string().valid('notInQueue','accepted','initiallyAccepted','rejected','underRevising').allow(''),
}).required();
export const  employeeId=joi.object(
{
empId:joi.string().min(5).required(),
}).required();
export const updatePayemntState=joi.object(
{
    payState:joi.boolean().required(),
}).required();
export const updateStopState=joi.object(
{
stoppedBySuperAdmin:joi.boolean().required(),
conditionOfStop:joi.string().min(10),
}).required();

export const updateProfleLinks=joi.object(
{
facebook:joi.object(
{
link:joi.string().min(5).max(100).allow(""),
removeOrNot:joi.boolean().allow(""),
}),
linkedin:joi.object({
    link:joi.string().min(5).max(100).allow(""),
removeOrNot:joi.boolean().allow(""),
}),
github:joi.object({
    link:joi.string().min(5).max(100).allow(""),
removeOrNot:joi.boolean().allow(""),
}),
youtube:joi.object({
    link:joi.string().min(5).max(100).allow(""),
removeOrNot:joi.boolean().allow(""),
}),
}).required();
export const checkcourseId=joi.object(
{
courseId:joi.string().min(5).max(40).required(),
}).required();
export const checkInsId=joi.object(
{
    insId:joi.string().min(5).max(40).required(),
}).required();