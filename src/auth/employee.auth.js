import employeeModel from "../../db/models/employees/meployees.model.js";
import empTokenModel from "../../db/models/employees/tokens/em[ployee.token.model.js";
import jwt from 'jsonwebtoken';
async function authentecationEmployee(req,res,next)
{
    try
    {
      //get the token:
      const {token}=req.headers;
      // check if the token is exists or not:
      if(!token)
      {
        return next(new Error("you not sen the token in the headers"));
      }
      // check on the bareer key:
      if(!token.startsWith(`${process.env.SECRET_KEY}`))
      {
        return next(new Error("the tokne not have the barerr key"));
      }
      // split the token:
      const newTkn=token.split("__")[1];
      // check on if this token is exists:
      const tknEx=await empTokenModel.findOne({token:newTkn});
      if(!tknEx)
      {
        return next(new Error("the token is not exists"));
      }
      // chekc on the validity of the tokne:
      if(!tknEx.isValid)
      {
        return next(new Error("the token is not valid"));
      }
      // get the user data fro  the token:
      const {_id,email}=jwt.verify(newTkn,"secretKey");
      const user=await employeeModel.findOne({_id,email});
      if(!user)
      {
        return next(new Error("sorry the user is not exists or the accouent may be deleted"));
      }
      // check on he validsity and activation of the account:
      if(!user.isActivated)
      {
        return next(new Error("the user account is not activated yet"));
      }
      if(user.role=="admin"||user.role=="instructor")
      {
        if(user.stoppedBySuperAdmin)
        {
          return next(new Error(`sorry you are stopped for the superAdmin contact us to solve the problem(the condition is:${user.conditionOfStop})`));
        }
        if(user.payState==false)
        {
          return next(new Error("you must pay the cost first then contact with the superAdmin to continue using the service"));
        }
      }
      // make the user data:
      req.data=user;
      // return to the next controller:
      return next();
    }
    catch(err)
    {
        return next(err);
    }
}
export default authentecationEmployee;
