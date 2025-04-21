function authorizationEmpoyee(...job)
{

// get e data from the req.data if the user and check:
return  (req,res,next)=>
{
try
{
const {role}=req.data;
if(job.includes(role))
{
return next();
}
else
{
return next(new Error("you are not authorized to do this process or operation based on yourRole"));
}
}
catch(err)
{
    return next(err);
}
}
}
export default authorizationEmpoyee;
// make th changes on the adding the emplou=yye api: