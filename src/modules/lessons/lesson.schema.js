import joi from 'joi';
// add the lesson schema:
export const addLessonSchema=joi.object(
{
    lessonName:joi.string().min(1).max(200).required(),
    lessonDescribtion:joi.string().min(1).max(300).required(),
    whatWillYouLeanAfterThisLesson:joi.string().min(2).max(300).required(),
    section:joi.string().min(5).required(),
    timeOfLesson:joi.string().regex(/^[0-9]{1,}:[0-9]{1,2}:[0-9]{1,2}$/).required(),
    uploadText:joi.string(),
    videos:joi.string(),
    otherRequiredLinks:joi.string(),
}).required();
// add videos check schema:
export const checkVideoAddToLessons=joi.array().items(joi.string().min(2).max(220).required()).min(1).required();
export const checkRequiredLinks=joi.array().items(joi.object({link:joi.string().min(2).max(220).required(),Describtion:joi.string().min(2).max(200).required()}).required()).min(0).required();
// chekc also on the time of the lesson to make the update on the section time;
// check on  the id of the course:
export const checkCourseId=joi.object(
{
courseId:joi.string().min(5).max(25).required(),
}).required();
export const checkLessonId=joi.object(
{
lessonId:joi.string().min(5).max(25).required(),
}).required();
// update schema:
export const updateLessonSchema=joi.object(
{
lessonName:joi.string().min(1).max(220),
lessonDescribtion:joi.string().min(1).max(300),
whatWillYouLeanAfterThisLesson:joi.string().min(2).max(300),
course:joi.string().min(5).max(50),
section:joi.string().min(5).max(50),
timeOfLesson:joi.string().regex(/^[0-9]{1,}:[0-9]{1,2}:[0-9]{1,2}$/),
uploadText:joi.string(),
idsOfFiles:joi.string(),
videosChanges:joi.string(),
requiredLinks:joi.string(),
pdfsUpdate:joi.string(),
}).required();
// other fields we will check on it with single chekc for each one of it:
// upadte the pdfs uploaded and update the describtion for it if you want:
export  const updatePdfsUploads=joi.array().items(joi.object({
     id:joi.string().min(5).max(10).required(),
     newDescribtion:joi.string().min(1).max(300),
}).required()).min(0).required();
export const updateLessonQuery=joi.object(
{
    videoOtpions:joi.string().valid("add","update","delete"),
    filesOptions:joi.string().valid("add","update","delete"),
    requiredLinksOptions:joi.string().valid("add","update","delete"),
}).required();
// adding video:
export const addVideo=joi.array().items(joi.string().min(5).max(250).required()).min(0).required();
export const deleteVideo=joi.array().items(joi.string().min(5).max(10).required()).min(0).required();
export const updateVieo=joi.array().items(joi.object({
    id:joi.string().min(5).max(10).required(),
    url:joi.string().min(5).max(220).required(),
}).required()).min(0).required();
// make the add schema for otherRequiredlinks:
export const addRequiredLinks=joi.array().items(joi.object(
{
    link:joi.string().min(5).max(220).required(),
    Describtion:joi.string().min(5).max(200).required(),
}).required()).min(0).required();
export const updteLinks=joi.array().items(joi.object(
{
id:joi.string().min(5).max(10).required(),
desc:joi.string().min(5).max(220).allow(''),
link:joi.string().min(5).max(250).allow(''),
}).required()).min(0).required();
export const deleteLink=joi.array().items(joi.string().min(5).max(10).required()).min(0).required();
// et lessons byb all filter:

export const getLessonSchema=joi.object(
{
lessonName:joi.string().min(1).allow(''),
course:joi.string().min(5).required(),
section:joi.string().min(5).allow(''),
}).required();
