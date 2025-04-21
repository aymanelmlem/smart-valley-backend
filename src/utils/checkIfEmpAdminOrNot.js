import { addAdminSchemaByAdmin, addInstructorSchemaByAdmin } from "../modules/employees/employees.schema.js";
import { bodyValidation } from "../validation/validation.js";
function checkIfAdminOrNot(req,res,next)
{
try
{
 const {role}=req.body;
 const data=req.data;
 if(!role)
 {
    return next(new Error("the role of employee will be added is required"));
 }
 if(role=="admin"||role=="superAdmin")
 {
   // make the validation on th admin data:
   if(data.role!="superAdmin"&&role=="superAdmin")
   {
      return next(new Error("you not have the authorized to add superAdmin"))
   }
   const funVal=bodyValidation(addAdminSchemaByAdmin);
   funVal(req,res,next);
 }
 else if(role=="instructor")
 {
    // amke the validation if the user is instructor on the data:
   const funVal=bodyValidation(addInstructorSchemaByAdmin);
   funVal(req,res,next);
 }
 else
 {
    return next(new Error("the value of role must be only admin or instructor"));
 }
}
catch(err)
{
    return next(err);
}
}
export default checkIfAdminOrNot;
