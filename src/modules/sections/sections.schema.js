import joi from 'joi';

export const addSectionSchema=joi.object(
{
sectionName:joi.string().min(1).max(150).required(),
sectionDescribtion:joi.string().min(1).max(250).required(),
sectionHours:joi.number().min(1).max(100000),
course:joi.string().min(5).required(),
objectiveFromSection:joi.array().items(joi.string().min(1).max(150).required()).min(0),
}).required();
export const checkSection=joi.object(
{
    sectionId:joi.string().min(5).required(),
}).required();
export const updateSection=joi.object(
{
sectionName:joi.string().min(1).max(160),
sectionDescribtion:joi.string().min(1).max(250),
sectionHours:joi.number().min(1).max(100000),
course:joi.string().min(5),
}).required().unknown();

export const checkIfObJectiveQuery=joi.object(
{
objective:joi.string().valid("add","update","delete"),
}).required();
export const addObjectiveAdd=joi.array().items(joi.string().min(1).max(150).required()).min(1).required();
export const addObjectiveDelete=joi.array().items(joi.string().min(5).max(10).required()).required();
export const addObjectiveUpdate=joi.array().items(joi.object({id:joi.string().min(5).max(10).required(),newObjective:joi.string().min(1).max(150).required()}).required()).required();

export const getSecionsWithAllFiltersOptions=joi.object(
{
    sectionName:joi.string().min(1).allow(''),
    sectionId:joi.string().min(5).allow(''),
}).required();

// check the id of the course:
export const courseCheck=joi.object(
{
    courseId:joi.string().min(5).required(),
}).required();