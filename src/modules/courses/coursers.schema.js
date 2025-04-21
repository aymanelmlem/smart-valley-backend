import joi from 'joi';
export const addCourseSchema=joi.object(
{
courseName:joi.string().min(1).max(200).required(),
courseHours:joi.string().required(),
courseDescription:joi.string().min(10).max(1200).required(),
coursePrice:joi.string().required().allow("free"),
accesibleByAnyOne:joi.string(),
whatWillYouLearn:joi.string(),
category:joi.string().min(5),
subCategory:joi.string().min(5),
teachedBy:joi.string().min(2).max(60).required(),
}).required();
export const updateCourseSchema=joi.object(
{
courseName:joi.string().min(1).max(200),
coursePrice:joi.string().allow('free'),
courseHours:joi.string(),
courseDescription:joi.string().min(10).max(1200),
whatWillYouLearn:joi.string(),
teachedBy:joi.string().min(2).max(60),
category:joi.string().min(2).max(10),
subCategory:joi.string().min(2).max(10),
}).required().unknown();
export const checkCourse=joi.object(
{
courseId:joi.string().min(5).required(),
}).required();
export const updatingCourseQuery=joi.object(
{
photoSelection:joi.string().valid('delete').allow(''),
accesibleByAnyOne:joi.string().valid('add','update','delete').allow(''),
whatWillYouLearn:joi.string().valid('add',"delete","update").allow(''),
categoryDelete:joi.string().valid("delete").allow(''),
}).required();
export const updateCccesspibeBySchemaUpdate=joi.object(
{
videoUrl:joi.object({
  urlId:joi.string().allow('').required(),
  url:joi.string().allow('').required(),
}),
describtion:joi.object(
{
  describtionId:joi.string().allow('').required(),
  describtionContent:joi.string().allow('').required(),
}),
}).required();
export const updateCccesspibeBySchemaDelete=joi.object(
{
  urlId:joi.string().min(4).allow(''),
  describtionId:joi.string().min(4).allow(''),
}).required();
export const addAccessBySchema=joi.object(
{
videoUrl:joi.array().items(joi.string().min(5).required()).min(1).required(),
describtion:joi.array().items(joi.string().min(5).required(),).min(1).required(),
}).required();
export const getCoursesForSpIns=joi.object(
{
courseName:joi.string().min(1).allow(''),
coursePrice:joi.string().min(1).allow(''),
category:joi.string().min(6).allow(''),
}).required();
export const checkOnTheWahtWillYouLearnUpdate=joi.object(
{
id:joi.array().items(joi.string().min(5).required()).min(1).required(),
objective:joi.array().items(joi.string().min(1).required()).min(1).required(),
}).required();
export const checkLessonId=joi.object(
{
  lessonId:joi.string().min(5).max(30).required(),
}).required();