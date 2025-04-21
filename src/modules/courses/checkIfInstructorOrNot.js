function checkInstrcutroOrnNot(req,res,next)
{
try
{
// get the data of the user:
const {state,role,pinCode}=req.data;
// check the state of the user and check the if he has npot have state:
if(role=="instructor")
{
if(!state)
{
    if(pinCode)
    {
        return next();
    }
    else
    {
        return next(new Error("you must have your private pinCode first to continue the operation"));
    }
}
if(state)
{
    if(state!="accepted"||!pinCode)
    {
        return next(new Error("you must be accepted first to continue the operation"));
    }
    else
    {
       if(state=="accepted"&&pinCode)
       {
        return next();
       }
       else
       {
        return next(new Error("you must be accepted first to continue the operation"));
       }
    }
}
}
else if(role=="superAdmin")
{
return next();
}
else
{
    return next(new Error("the role of the employee must be superdmin or instructor only"));
}
}
catch(err)
{
    return next(err);
}
}
export default checkInstrcutroOrnNot;