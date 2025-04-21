import joi from 'joi';
export const subscibersToJoinSchema=joi.object(
{
courseId:joi.string().min(5).max(30).required(),
}).required();


export const removeMyRequest=joi.object(
{
    requestId:joi.string().min(5).max(30).required(),
}).required();