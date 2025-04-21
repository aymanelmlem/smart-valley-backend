import joi from 'joi';
export const addCategorySchema=joi.object(
{
    categoryName:joi.string().min(2).max(70).required(),
    subCategory:joi.string(),
}).required();
export const checkCtageoryId=joi.object(
    {
    categId:joi.string().min(5).required(),
    }).required();
export const updateCategorySchema=joi.object(
{
categoryName:joi.string().min(2).max(70),
}).required().unknown();
export const checkImage=joi.object(
{
profilePictureSelect:joi.string().valid("delete").allow(''),
subcatgeorySelect:joi.string().valid("add","update","delete"),
}).required();
export const addingSUbCategotySchema=joi.array().items(joi.string().min(1).max(60).required()).required();  
export const updateSubCategorySchema=joi.array().items(joi.object({subCategoryId:joi.string().min(5).required(),subCategoryName:joi.string().min(2).max(60).required()}).required()).min(1).required();
export const deleteSubCategorySchema=joi.array().items(joi.string().min(1).max(60).required()).min(1).required();
export const getCategories=joi.object(
{
categoryName:joi.string().min(1).allow(''),
addedBy:joi.string().min(5).allow(''),
subCategory:joi.string().min(1).allow(''),
catgeoryId:joi.string().min(5).allow(''),
}).required();
export const filterCatgeiry=joi.object(
{
categoryName:joi.string().valid("categoryName").allow(""),
craatedAt:joi.string().valid("createdAt").allow(''),
}).required();

export const getFIlterSubCategory=joi.object(
{
    categoryName:joi.string().min(1).allow(''),
    categoryId:joi.string().min(5).allow(''),
    subCategoryName:joi.string().min(1).allow(''),
}).required();

export const getCourses=joi.object(
{
courseName:joi.string().min(1).allow(""),
courseHours:joi.string().min(1).allow(''),
coursePrice:joi.string().min(1).allow(''),
instructor:joi.string().min(1).allow(''),
teachedBy:joi.string().min(1).allow(''),
category:joi.string().min(5).allow(''),
subCategory:joi.string().min(5).allow(''),
id:joi.string().min(5).allow(''),
}).required();

export const getInstrcuctorsSchema=joi.object(
{
instructorName:joi.string().min(1).allow(''),
instrcuctorId:joi.string().min(5).allow(''),
}).required();
export const getOInlyOneCOurse=joi.object(
{
courseId:joi.string().min(5).required(),
}).required();