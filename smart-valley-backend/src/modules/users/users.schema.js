import joi from 'joi';

export const signUpSchema=joi.object(
{
userName:joi.string().min(2).max(300).required(),
userEmail:joi.string().email().required(),
password:joi.string().min(8).max(20).required(),
rePassword:joi.string().valid(joi.ref("password")).required(),
userAge:joi.string().regex(/^[1-9]{1}[0-9]{1}$/).required(),
phoneNumber:joi.string().regex(/^(010|011|012|015)[0-9]{8,9}$/).required(),
}).required();

export const activeteEmailSchema=joi.object(
{
    userEmail:joi.string().email().required(),
}).required();
export const loginSchema=joi.object(
{
userEmail:joi.string().email().required(),
password:joi.string().required(),
}).required();
export const forgetPassFirstStageSchema=joi.object(
{
    email:joi.string().email().required(),
}).required();

export const getCodeFOrStageTwoSchema=joi.object(
{
    email:joi.string().email().required(),
    code:joi.string().length(5).required(),
    password:joi.string().min(8).max(20).required(),
    rePass:joi.string().valid(joi.ref("password")).required(),
}).required();

export const updateUserSchema=joi.object(
{
userEmail:joi.string().email(),
phoneNumber:joi.string().regex(/^(010|011|015|012)[0-9]{8,9}$/),
userAge:joi.string().regex(/^[1-9][0-9]{1}$/),
oldPass:joi.string(),
password:joi.string().min(8).max(20),
rePass:joi.string().valid(joi.ref("password")),
}).required();

export const updateUserDataOptions=joi.object(
{
photoOptions:joi.string().valid("delete").allow(''),
}).required();

export const checkCourse=joi.object(
{
    courseId:joi.string().min(5).required(),
}).required();

export const handleLikesFOrNowWhoIsLogIn=joi.object(
{
cousresIds:joi.array().items(joi.string().min(5).max(30),).min(0).required(),
}).required();

export const getCoursesStateWithFIlter=joi.object(
{
courseId:joi.string().min(5).max(40).allow(""),
coursePrice:joi.string().allow(""),
category:joi.string().min(1).allow(""),
subCategory:joi.string().min(1).allow(""),
insName:joi.string().min(1).allow(""),
courseName:joi.string().min(1).allow(""),
courseHours:joi.string().min(1).allow(""),
teachedBy:joi.string().min(1).allow(""),
}).required();
