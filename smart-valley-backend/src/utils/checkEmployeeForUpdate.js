import { updateAdminData, updateInstructorData, updateSuperAdminData } from "../modules/employees/employees.schema.js";
import { bodyValidation } from "../validation/validation.js";

function checkEmployee()
{
try
{
return (req,res,next)=>
{
try
{
// get the role 
const {role,state,_id}=req.data;
// check on the state of the instructor:
if(role=="instructor")
{
  if(state)
  {
     if(state!="accepted")
     {
        return next(new Error("you must accepted first then update your data"));
     }
     else
     {
        // update the data on the accept state:
        // make the fynction which get the shcema:
        const val=bodyValidation(updateInstructorData);
        val(req,res,next);
     }
  }
  else
  {
    // update the data for the instructor:
      // update the data on the accept state:
        // make the fynction which get the shcema:
        const val=bodyValidation(updateInstructorData);
        val(req,res,next);

  }
}
else if(role=="admin")
{
      // update the data on the accept state:
        // make the fynction which get the shcema:
        const val=bodyValidation(updateAdminData);
        val(req,res,next);
}
else if(role=="superAdmin")
{
    
      // update the data on the accept state:
        // make the fynction which get the shcema:
        const val=bodyValidation(updateSuperAdminData);
        val(req,res,next);
}
else
{
    return next(new Error("the role is not valid"));
}

}
catch(err)
{
    return next(err);
}
}
}
catch(err)
{
    return next(err);
}
}
export default checkEmployee;