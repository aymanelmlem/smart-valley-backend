import { nanoid } from 'nanoid';
import uploadingFileRequets from '../../utils/uploadingFiles.js';
import cloudinary from './../../utils/cloudinary.config.js';
import employeeModel from '../../../db/models/employees/meployees.model.js';
import sendingEmail from '../../utils/sendEmail.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import empTokenModel from '../../../db/models/employees/tokens/em[ployee.token.model.js';
import courseModel from '../../../db/models/courses/courses.model.js';
import categoryModel from '../../../db/models/catgeory/catagory.model.js';
import participntsModel from '../../../db/models/participnts/partcipints.model.js';
import subscribersModel from '../../../db/models/subscribers/subscribers.model.js';
export const addEmployeeByAdmin=async (req,res,next)=>
{
try
{
// get the ifd if the user:

const {_id,role}=req.data;

// egt the data from the body:
const data=req.body; 
let objectPhoto={};
let objectResume={};
// check if the reqd.fiels have or not images:
if((data.role=="admin"||data.role=="superAdmin"||data.role=="instructor")&&role!="superAdmin")
{
    return next(new Error("the responsible for adding any new employee is only superAdmin"));
}

if(data.role=="instructor")
    {
        if(!req.files||req.files.length==0)
        {
            return next(new Error("you must upload the resume of the instructor"));
        }
        else
        {
            if(req.files.length>2)
            {
                return next(new Error("as role of instructot you only must upload resume photo and if you want the profiel Picture only"));
            }
            let flagResume=false;
            // make loop on the code and check:
            for(let i=0;i<req.files.length;i++)
            {
                    // chekc first that 
                    if(req.files[i].fieldname=="resume")
                    {
                         // maek the code on the resume:
                         flagResume=true;
                         const uploadingResume=await cloudinary.uploader.upload(req.files[i].path,{folder:`/uploads/teachingOnlineCenter/employees/${data.name}/resume/`});
                         objectResume.public_id=uploadingResume.public_id;
                         objectResume.secure_url=uploadingResume.secure_url;
                    }
                    else if (req.files[i].fieldname === "profilePicture")
                    {
                          const uploadingPhoto=await cloudinary.uploader.upload(req.files[i].path,{folder:`/uploads/teachingOnlineCenter/employees/${data.name}/profilePicture/`});
                          objectPhoto.public_id=uploadingPhoto.public_id;
                          objectPhoto.secure_url=uploadingPhoto.secure_url;
                    }
            }
            if(!flagResume)
            {
                return next(new Error("as role of instructor you must upload the resume"));
            }
    
        }
    }
else
{
    if(req.files)
        {
        // ther is the two state:
        // state of the admin:
        if(req.files.length>0)
            {
                const upoadingFileOne=await cloudinary.uploader.upload(req.files[0].path,{folder:`/uploads/teachingOnlineCenter/employees/${data.name}/profilePicture/`});
                //
                objectPhoto.public_id=upoadingFileOne.public_id;
                objectPhoto.secure_url=upoadingFileOne.secure_url;
                // make the file object:
            }
            else
            {
                console.log("no photo Picture");
            }
        // state of the instructor:
        }
}
// check on the data now of the files:
if(objectPhoto.secure_url)
{
data.profilePicture=objectPhoto
}
if(objectResume.secure_url)
{
data.profileResume=objectResume;
}
// make the code:
const code=nanoid(8);
data.emailCode=code;
// send the email to the user:
const sendingEmailOne=await sendingEmail({to:data.email,subject:"activte your acceount",text:"this is the code to active your account",html:` <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td style="padding: 20px 0 30px 0;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #002147; background-color: #ffffff;">
                <!-- شعار المنصة -->
                <tr>
                    <td align="center" style="padding: 20px; background-color: #002147;">
                        <img src="https://res.cloudinary.com/dzqvcewvy/image/upload/v1725979834/uploads/teachingOnlineCenter/employees/omer%20Khalid%20kamal/courses/lessonsPdfs/chrb49reacg08m87a0am.jpg" alt="Edumatek Prime Logo" style="border-radius: 50%; width: 100px; height: 100px;">
                    </td>
                </tr>
                <!-- رسالة التنشيط -->
                <tr>
                    <td align="center" bgcolor="#002147" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                        Activate Your Edumatek Prime Account
                    </td>
                </tr>
                <!-- محتوى البريد -->
                <tr>
                    <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="color: #002147; font-family: Arial, sans-serif; font-size: 24px;">
                                    <b>Hello, ${data.name}!</b>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 20px 0 30px 0; color: #002147; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                    Thank you for signing up for Edumatek Prime. Please use the code below to activate your account.
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 20px 0;">
                                    <div style="background-color: #FF8C00; color: white; padding: 15px; font-size: 20px; font-weight: bolder; border-radius: 5px;">
                                        ${code}
                                    </div>
                                </td>
                            </tr>
                            <!-- رابط التنشيط -->
                            <tr>
                                <td style="padding: 20px 0; font-family: Arial, sans-serif; font-size: 16px; color: #002147;">
                                    Please copy the link below and paste it into your browser to activate your account, or click directly on the link:
                                    <br><br>
                                    <a href="http://localhost:5173/activeAcount-employee" style="color: #FF8C00; text-decoration: none; font-weight: bold;">
                                        http://localhost:5173/activeAcount-employee
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 30px 0 0 0; color: #002147; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                    If you did not sign up for this account, please ignore this email.
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <!-- تذييل البريد -->
                <tr>
                    <td bgcolor="#002147" style="padding: 30px 30px 30px 30px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
                                    &reg; Edumatek Prime 2024<br/>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
`});
    if(!sendingEmailOne)
    {
        return next(new Error("the email is not valid or the inetrnet connection is not stable"));
    }
    data.addedBy=_id;
// save the data as  the document on the model:
await employeeModel.create(data);
// send the resposne:
return res.json({success:true,message:"the emplooyee is added sucessfully he should active his accoutn only"});
}
catch(err)
{
    return next(err);
}
}
// he should first active his email:
// then send him the pass and the a code to the employee:
export const activeyourAcceountWhichAddedByAdmin=async (req,res,next)=>
{
    try
    {
        //get the email of the employee:
        const {email}=req.body;
        const user=await employeeModel.findOne({email});
        //check first on the email:
        if(!user)
        {
            return next(new Error("the email is not found please check the email or contact with the admins of the app"));
        }
        // check if the ermail si already activate:
        if(user.isActivated)
        {
            return next(new Error("the email is already activated before"));
        }
        //get the code from the body:
        const {code}=req.body;
        if(user.emailCode!=code)
        {
            return next(new Error("the code is not true check it and try again"));
        }
        // check if the user is instructro or not:
        const {state,revisedBy,role}=user;
      // check if the instructor:
      if(role=="instructor")
      {
        // chekc on the instrcutor and check on the state:
        if(state)
        {
           // if there is a state already:
           // check on the state:
           if(state=="notInQueue")
           {
            user.isActivated=true;
            user.state="underRevising";
            await user.save();
            //return the resposne:
            return res.json({success:true,message:"your email is activated sucessfully you can logIn now"});
           }
           else
           {
            // he should activate only:
            // :
            if(state=="accepted")
            {
                // make the ordinary:
                user.isActivated=true;
                await user.save();
                // return the resposne:
                return res.json({success:true,message:"your email is activated sucessfully you can logIn now"});
            }
           }
        }
        else
        {
            console.log("he is added by the superAdmin");
        }
      }
      if(!state)
      {
        // check on the pinCode:
        // if he has already pinCode and he is activated before alredy:
        if(user.pinCode)
        {
           user.isActivated=true;
           await user.save();
           // return the resposne:
           return res.json({success:true,message:"your email is activated sucessfully you can logIn now"})
        }
      }
        // if it true: send the email with the password and with the unqiueCode:
        const pass=nanoid(12);
        const pinCode=nanoid(8);
        // save the new data:
        user.password=bcryptjs.hashSync(pass,8);
        user.pinCode=pinCode;
        user.isActivated=true;
        await user.save();
        // send it on the email:
        const sendingEmailOne=await sendingEmail({to:user.email,subject:"Your Private Data",text:"this is you private data it's secret not share it with any one",html:` <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; background-color: #ffffff;">
                    <tr>
                        <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                           your private data
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                        <b>Hello, ${user.name}!</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                      <h4>                                        this is your pinCode and the password which by it  you can login to the application.</h4>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <div style="background-color: #4CAF50; color: white; padding: 15px; font-size: 20px; font-weight: bolder; border-radius: 5px;">
                                            <h3>this is your pinCode:</h3>
                                            <p style="font-weight:bolder;">${pinCode}</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <div style="background-color: #4CAF50; color: white; padding: 15px; font-size: 20px; font-weight: bolder; border-radius: 5px;">
                                            <h3>this is your password:</h3>
                                            <p style="font-weight:bolder;">${pass}</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 30px 0 0 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                        <h2 style="text-align:center;font-weight:900;">warning (please read this carefully)</h2>
                                     <h4 style="color:red; text-align:center;" >this is data is very private don't share it with any one<br>we not responsible for it.</h4>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#70bbd9" style="padding: 30px 30px 30px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
                                        &reg; Teaching Online Center 2024<br/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`});
    if(!sendingEmailOne)
    {
        return next(new Error("the email is not valid or the the internet connection is not stable"));
    }

        // retur the resposne:
        return res.json({success:true,message:'your email is activated sucessfully check your gmail to know your pass and pinCode then login'});
    }
    catch(err)
    {
        return next(err);
    }
}
// make the authentecation and the authorization for the users:
// i will make the dashboard for the admin which is related to the employeees:(delete them numbers of them get them all and allm of this):(okay ya am);
// logvin as employee:
export const loginAsEmployeeByEmailAndPassword=async (req,res,next)=>
{
try
{
// get the data of the employee:
const {email,password}=req.body;

// ceck on the meial first:
const user=await employeeModel.findOne({email});
if(!user)
{
    return next(new Error("the email is not exists please chekc your email"));
}
// check on t he pass:
if(!bcryptjs.compareSync(password,user.password))
{
    return next(new Error("the password is not true"));
}
if(!user.isActivated)
{
    return next(new Error("the account is not activated activate the account then login"));
}
// check on the user state to know what will be the next:
if(!user.state||user.state=="accepted")
{
    const {loggedForAccepted}=user;
    if(user.state=="accepted")
    {
        console.log("then this");
        
        if(loggedForAccepted==0||loggedForAccepted)
        {
            console.log("yes");
            if(loggedForAccepted==0)
            {
                // we should  adding for him:
                user.loggedForAccepted=1;
                await user.save();
                // make the token and do this:
                const EmployeeToken=jwt.sign({_id:user._id,email:user.email,role:user.role,name:user.name,state:user.state},"secretKey",{expiresIn:"1d"});
                await empTokenModel.create({token:EmployeeToken,employee:user._id,userAgent:req.headers['user-agent']});
                return res.json({success:true,message:"logged In successfully",loggedForAccepted,token:EmployeeToken});
            } 
        }
    }
// then return the resposen without the token:
if(loggedForAccepted)
{
    return res.json({success:true,message:"successfully enter your private pinCode",loggedForAccepted});

}
else
{
    return res.json({success:true,message:"successfully enter your private pinCode",loggedForAccepted});
}
}
// if there is the state and the state is not be accepted:
if(user.state&&user.state!="accepted")
{
    // make the token:
    let token="";
   if(!user.state)
   {
     token=jwt.sign({_id:user._id,email:user.email,role:user.role,name:user.name},"secretKey",{expiresIn:"8d"});
   }
   else
   {
    token=jwt.sign({_id:user._id,email:user.email,state:user.state,role:user.role,name:user.name},"secretKey",{expiresIn:"8d"});
   }
    const objectToken={};
    objectToken.token=token;
    objectToken.employee=user._id;
    objectToken.userAgent=req.headers['user-agent'];
    // save the token is the collection:
    await empTokenModel.create(objectToken);
    // send the response with the token:
    return res.json({success:true,message:"logged In successfully",token});
}
}
catch(err)
{
    return next(err);
}
}
// get he pinCode then make then send the token if the data is true to the employee:
export const getPinCodeForLogin=async (req,res,next)=>
{
    try 
    {
        // get the email and pass and the pin code:
        const {email,password,pinCode}=req.body;
        // check on the email:
        const user=await employeeModel.findOne({email});
        if(!user)
        {
            return next(new Error("the email is not correct"));
        }
        // check on the pass:
        if(!bcryptjs.compareSync(password,user.password))
        {
            return next(new Error("the passwrod is not correct"));
        }
        // chekc on the email validation:
        if(!user.isActivated)
        {
            return next(new Error("your account is not activated check your gmail and activate your account then login"));
        }
        if(!user.pinCode)
        {
            return next(new Error("you not have pinCode"));
        }
        // check on the pinCode:
        if(pinCode!=user.pinCode)
        {
            return next(new Error("the pinCode is not true"));
        }
        let token="";
        // then send the resposne with the token:
        if(user.state&&user.state=="accepted")
        {
           token=jwt.sign({_id:user._id,email:user.email,state:user.state,role:user.role,name:user.name},"secretKey",{expiresIn:"8d"});
        }
        else
        {
            token=jwt.sign({_id:user._id,email:user.email,role:user.role,name:user.name},"secretKey",{expiresIn:"8d"});
        }
        // amek the token and send the resposne:
        let objectToken={};
        objectToken.token=token;
        objectToken.employee=user._id;
        objectToken.userAgent=req.headers['user-agent'];
        await empTokenModel.create(objectToken);
        return res.json({success:true,message:"logged In Sucessfully",token:token});
    }
    catch(err)
    {
        return next(err);
    }
}
// update the data:
// delete the accouunt:
// forget password:
// update the password:
export const updatePass=async (req,res,next)=>
{
try
{
const {_id}=req.data;
const user=await employeeModel.findOne({_id});
if(!user)
{
    return next(new Error("the user is not exists or the account may ve deleted"));
}
//get the user fdata:
const {password,newPass,rePass}=req.body;
// check ont he pass and the password:
if(!bcryptjs.compareSync(password,user.password))
{
    return next(new Error("your passwrod is not correct"));
}
if(newPass!=rePass)
{
return next(new Error("the newPassword must be matched with the rePass"));
}
// update the pass:
user.password=bcryptjs.hashSync(newPass,8);
await user.save();
// make all the token inValid:
await empTokenModel.updateMany({employee:_id},{isValid:false});
// return the resposne:
return res.json({success:true,message:"the password is updated sucessfully go to login Now"});
}
catch(err)
{
    return next(err);
}
}
// forget pinCode:
export const forgetPinCode=async  (req,res,next)=>
{
    try
    {
       // get the user data:
       const {email}=req.body;
       const user=await employeeModel.findOne({email});
       if(user.role=="instructor")
       {
        if(!user.pinCode)
        {
            return next(new Error("as an instructor you have not pinCode until you been accepted"));
        }
       }
       if(!user)
       {
        return next(new Error("the user email is not exists may be the account is deleted"));
       }
       if(!user.isActivated)
       {
        return next(new Error("the user account is nit activated yet please active your account and try again"));
       }
       // check on the user if he is have pinCode or not:
       if(!user.state&&user.state=="accepted")
       {
        return next(new Error("you not have the authorization now to get pinCode"));
       }
       if(!user.pinCode)
       {
        return next(new Error("you not have pinCode already check the admin or wait the result of your request if you make an instructor request"));
       }
       // upadte the PinCode:
       const newCode=nanoid(8);
       user.pinCode=newCode;
       await user.save();
       // send the email with new Code:
       const sendingEMailOne=await sendingEmail({to:user.email,subject:"new Pin Code teaching online center",text:"this is the newPin code that private for you",html:`<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td style="padding: 20px 0 30px 0;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; background-color: #ffffff; border-radius: 10px; overflow: hidden;">
                <tr>
                    <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                        Your New PinCode
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px; text-align: center;">
                                    <b>Hello, ${user.name}!</b>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 20px 0;">
                                    <div style="background-color: #4CAF50; color: white; padding: 15px; font-size: 20px; font-weight: bold; border-radius: 5px; display: inline-block;">
                                        <h3 style="margin: 0;">This is your PinCode:</h3>
                                        <p style="font-weight: bolder; font-size: larger; margin: 10px 0;">${newCode}</p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 30px 0 0 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; text-align: center;">
                                    <h2 style="font-weight: 900;">Warning (please read this carefully)</h2>
                                    <h4 style="color: red;">This data is very private. Don't share it with anyone. We are not responsible for it.</h4>
                                    <h4 style="color: red;">If you did not make this action or process, please contact us immediately.</h4>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#70bbd9" style="padding: 30px 30px 30px 30px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; text-align: center;">
                                    &reg; Teaching Online Center 2024<br/>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
`});
    if(!sendingEMailOne)
    {
        return next(new Error("the email is not valid or the inetnet connection is not stable"));
    }
       // make all the token is not valid:
       await empTokenModel.updateMany({employee:user._id},{isValid:false});
       // return the response:
       return res.json({sucess:true,message:'your pinCode is updated sucessfully check your gmail to know it then logIn again'});
    }
    catch(err)
    {
        return next(err);
    }
}
// forget passWord:
export const forgetPassController=async (req,res,next)=>
{
try
{
const {email}=req.body;
// check on the user email:
const user=await employeeModel.findOne({email});
if(!user)
{
    return next(new Error("the user email is not exists"));
}
// check on the activation of the email:
if(!user.isActivated)
{
    return next(new Error("you must avtivte the account first then do what you want"));
}
// make the reset code then send the code in the email:
const resetCode=nanoid(8);
user.resetCode=resetCode;
await user.save();
// send the email:
const sendingEmailOne=await sendingEmail({to:user.email,subject:"the resetCode for the password",text:"this sthe rseet code fro the password",html:` <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; background-color: #ffffff; border-radius: 10px; overflow: hidden;">
                    <tr>
                        <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                            Password Reset Code
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #153643; font-size: 24px; text-align: center; padding-bottom: 20px;">
                                        <b>Hello, ${user.name}!</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <div style="background-color: #4CAF50; color: white; padding: 20px; font-size: 20px; font-weight: bold; border-radius: 5px;">
                                            <h3 style="margin: 0;">Your Reset Code:</h3>
                                            <p style="font-weight: bolder; font-size: larger; margin: 10px 0;">${resetCode}</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 30px 0 0 0; color: #153643; font-size: 16px; line-height: 20px; text-align: center;">
                                        <h2 style="font-weight: 900;">Important</h2>
                                        <h4 style="color: red; margin: 10px 0;">This code is very private. Don't share it with anyone.</h4>
                                        <h4 style="color: red; margin: 10px 0;">If you did not request a password reset, please contact us immediately.</h4>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#70bbd9" style="padding: 20px 30px 20px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #ffffff; font-size: 14px; text-align: center;">
                                        &reg; Teaching Online Center 2024<br/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`});
    if(!sendingEmailOne)
    {
        return next(new Error("the email is not valid or the internet connection is not stable"));
    }
    // retur the respisne:
    return res.json({sucess:true,message:"the reset code is sending sucessfully to your mail check you gmail"});
}
catch(err)
{
    return next(err);
}
}
// egt the code and the email and the new Pass:
export const getCodeForPass=async (req,res,next)=>
{
try
{
const  {email,resetCode,pass,rePass}=req.body;
const user=await employeeModel.findOne({email});
if(!user)
{
    return next(new Error("the user email is not exists"));
}
if(!user.isActivated)
{
    return next(new Error("the user must active his account first then make the operations"));
}
// get the code then mke the:
if(user.resetCode!=resetCode)
{
    return next(new Error("the code is not true"));
}
// check on the pass:
if(pass!=rePass)
{
    return next(new Error("the passwrod and the rePass must be matched"));
}
// make the pass:
user.password=bcryptjs.hashSync(pass,8);
await user.save();
//make all th etoken is nit valid:
await empTokenModel.updateMany({employee:user._id},{isValid:false});
// reyurnt eh resposn:
return res.json({sucess:true,message:"successfully reset,you can login now"});
}
catch(err)
{
    return next(err);
}
}
// logout:
export const logout=async (req,res,next)=>
{
try
{
// get the tokne for the user:
const {token}=req.headers;
const getFnalToken=token.split("__")[1];
// make th the token is not valid:
await empTokenModel.updateOne({token:getFnalToken},{isValid:false});

// retur the resposne:
return res.json({success:true,message:"logged out sucessfully"});
}
catch(err)
{
    return next(err);
}
}
// pdate the data of the employee:
export const updateEmpData=async (req,res,next)=>
{
  try
  {
     // make what do you want:
     // ge the id of the meployee:
     const {_id,role,state}=req.data;
     const user=await employeeModel.findOne({_id});
     console.log(user);
    
     // get all the dat alike email profile photo:
     const data=req.body;
     // check on the email:
     console.log(data);
     if(data.email)
     {
        // amke the code of the email:
        const code=nanoid(8);
        // make the email to send it to check the email code:
        user.email=data.email;
        user.emailCode=code;
        user.isActivated=false;
        await empTokenModel.updateMany({employee:user._id},{isValid:false});
        await user.save();
        // sedning the email:
        const sendingEmailOne=await sendingEmail({to:user.email,subject:"your email activation",text:"this si your code to activate your email",html:` <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; background-color: #ffffff;">
                    <tr>
                        <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                            Activate Your Account
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                        <b>Hello, ${user.name}!</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                        Thank you for signing up for Teaching Online Center. Please use the code below to activate your account.
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <div style="background-color: #4CAF50; color: white; padding: 15px; font-size: 20px; font-weight: bolder; border-radius: 5px;">
                                            ${code}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 30px 0 0 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                        If you did not sign up for this account, please ignore this email.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#70bbd9" style="padding: 30px 30px 30px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
                                        &reg; Teaching Online Center 2024<br/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`});
    if(!sendingEmailOne)
    {
        return next(new Error("the email is not valid or the internet connection is not stable"));
    }
    // make  all the token fro this email isnot valid:
    delete data.email;
     }
     // check on the profile photo and cv:
     if(req.files)
     {
        let  objectPhoto={};
        let  objectResume={};
        // check on the role:
        if(role=="instructor")
        {
          if(req.files.length>2)
          {
            return next(new Error("you only have the right to upload two photos one for the profile picture and one for your resume"));
          }
          // check on the files and do what do you want:
          for(let i=0;i<req.files.length;i++)
          {
            if(req.files.length>1)
            {
                if(req.files[0].fieldname===req.files[1].fieldname)
                    {
                       return next(new Error("the file one must be profilePicture For your profilePicture and one resume for your resume"));
                    }
            }
            else if(req.files[i].fieldname=="profilePicture")
            {
               // mkae the code for the profile picture:
               const {profilePicture}=req.query;
               if(profilePicture)
               {
                if(profilePicture=="delete")
                {
                    user.profilePicture.secure_url="https://www.redinteractive.co.uk/wp-content/uploads/2019/06/avatar-12.jpg";
                    delete user.profilePicture.public_id;
                }
               }
               else
               {
                // cehck on the update or adding new photo:
                if(user.profilePicture.public_id)
                {
                    // we will make update algorithm:
                    const uploadingPhotoNew=await cloudinary.uploader.upload(req.files[i].path,{public_id:user.profilePicture.public_id});
                    if(!uploadingPhotoNew)
                    {
                        return next(new Error("the photo is not upladed sucessfully check the connection"));
                    }
                    objectPhoto.public_id=uploadingPhotoNew.public_id;
                    objectPhoto.secure_url=uploadingPhotoNew.secure_url;
                }
                else
                {
                    // we will make add algorithm:
                    const uploadingPhotoE=await cloudinary.uploader.upload(req.files[i].path,{folder:`/uploads/teachingOnlineCenter/employees/${user.name}/profilePicture/`});
                    console.log("i'm here now");
                    if(!uploadingPhotoE)
                    {
                        return next(new Error("the photo is not uploading sucessfully"));
                    }
                    objectPhoto.public_id=uploadingPhotoE.public_id;
                    objectPhoto.secure_url=uploadingPhotoE.secure_url;
                }
               }
            }
            else if(req.files[i].fieldname=="resume")
            {
            //    make the code for the resume:
            //    update the  destination of it:
            const uploading=await cloudinary.uploader.upload(req.files[i].path,{public_id:user.profileResume.public_id});
            if(!uploading)
            {
                return next(new Error("the resume is not upladed may be the internet connection is not stable"));
            }
            objectResume.public_id=uploading.public_id;
            objectResume.secure_url=uploading.secure_url;
            }
            else
            {
                continue;
            }
          }
        }
        else
        {
            if(req.files.length>1)
            {
                return next(new Error("you must upload ine photo of your profile picture only if you want"))
            }
            // make the code of the update:
             if(req.files[0].fieldname=="profilePicture")
                {
                   // mkae the code for the profile picture:
                   const {profilePicture}=req.query;
                   if(profilePicture)
                   {
                    if(profilePicture=="delete")
                    {
                        console.log("i enter here");
                        objectPhoto.secure_url="https://www.redinteractive.co.uk/wp-content/uploads/2019/06/avatar-12.jpg";
                    }
                   }
                   else
                   {
                    // cehck on the update or adding new photo:
                    if(user.profilePicture.public_id)
                    {
                        // we will make update algorithm:
                        const uploadingPhotoNew=await cloudinary.uploader.upload(req.files[0].path,{public_id:user.profilePicture.public_id});
                        if(!uploadingPhotoNew)
                        {
                            return next(new Error("the photo is not upladed sucessfully check the connection"));
                        }
                        objectPhoto.public_id=uploadingPhotoNew.public_id;
                        objectPhoto.secure_url=uploadingPhotoNew.secure_url;
                    }
                    else
                    {
                        // we will make add algorithm:
                        const uploadingPhotoE=await cloudinary.uploader.upload(req.files[0].path,{folder:`/uploads/teachingOnlineCenter/employees/${user.name}/profilePicture/`});
                        if(!uploadingPhotoE)
                        {
                            return next(new Error("the photo is not uploading sucessfully"));
                        }
                        objectPhoto.public_id=uploadingPhotoE.public_id;
                        objectPhoto.secure_url=uploadingPhotoE.secure_url;
                    }
                   }
                }
                else
                {
                    return next(new Error("you must upload the profile picture with field name profilePicture"));
                }
        }
        if(objectResume.secure_url)
        {
            data.profileResume=objectResume;
        }
        if(objectPhoto.secure_url)
        {
            data.profilePicture=objectPhoto;
        }
     }
     // make the update:
     const newUser=await employeeModel.findOneAndUpdate({_id},data,{new:true});
     // retur the resposne:
     return res.json({success:true,message:"the user data is updated successfully",user:newUser});
  }
  catch(err)
  {
    return next(err);
  }
}
// get the requests with the state:
export const getRequests=async (req,res,next)=>
{
    try
    {
      //get the user data:
      const {_id,email,role}=req.data;
      // gte the data from the query:
      const data=req.query;
      // check first on the state and on the role of the employee:
      let results=[];
      if(data.state)
      {
        if(role=="admin")
        {
           if(data.state!="underRevising"&&data.state!="accepted"&&data.state!="rejected"&&data.state!="initiallyAccepted")
           {
            return next(new Error("sorry the staet fro the admin must be one of there(underRevising,accepted,rejected)"));
           }
           if(data.revisedBy)
           {
            return next(new Error("you can't get requests have revised by another employees"));
           }
        }
      }
      if(role=="admin")
      {
        console.log("i enter this");
          // make the default for the admin:
        
          if(Object.keys(data).length==0)
          {
            results=await employeeModel.find({state:"underRevising"}).sort("-createdAt -updatedAt");
          // retur the resposne:
          return res.json({sucess:true,requests:results});
          }
          
          
            const mapObject=new Map(Object.entries(data));
            let flag=true;
            mapObject.forEach((key,value)=>
          {
              if(value)
              {
                flag=false;
              }

           });
           if(flag)
           {
            results=await employeeModel.find({state:"underRevising"}).sort("-createdAt -updatedAt");
            // retur the resposne:
            return res.json({sucess:true,requests:results,numberRequests:results.length});
           }
           else
           {
            console.log("there are keys with vale in the object of query");
           }
          
      }
      else if(role=="superAdmin")
      {
          // make the default for superAdmin:
           // check if the 
           if(Object.keys(data).length==0)
           {
            results=await employeeModel.find({state:"accepted"}).populate([{path:"revisedBy"}]).sort("-createdAt -updatedAt");
            return res.json({success:true,requests:results,numberRequests:results.length});
           }
           const mapObject=new Map(Object.entries(data));
           let flag=true;
           mapObject.forEach((key,value)=>
         {
             if(value)
             {
               flag=false;
             }

          });
          if(flag)
          {
            results=await employeeModel.find({state:"accepted"}).populate([{path:"revisedBy"}]).sort("-createdAt -updatedAt");
            return res.json({success:true,requests:results,numberRequests:results.length});
          }
          else
          {
           console.log("there are keys with vale in the object of query");
          }
      }
    //  check on the role if it admin role:to add on the data _id:
    if(role=="admin")
    {
       if(data.state)
       {
         if(data.state!="underRevising")
         {
            data.revisedBy=_id;
         }
       }
    }
    // make the filter object to get all of what do you want:
    let objectFilter={};
    if(data.name)
        objectFilter.name={$regex:data.name,$options:"i"};
    if(data.requestId)
        objectFilter._id=_id;
    if(data.state)
      objectFilter.state=data.state;
    if(data.date)
        objectFilter.date=date;
    if(data.revisedBy)
        objectFilter.revisedBy=data.revisedBy;
    // return the resposne:
    results=await employeeModel.find(objectFilter).populate({path:"revisedBy"}).sort("-createdAt -updatedAt");
    return res.json({success:true,requests:results,numberRequests:results.length});
    }
    catch(err)
    {
        return next(err);
    }
}
// accept or reject the request based on the role:
export const acceptOrRejectRequest=async (req,res,next)=>
{
    try
    {
      // get the id of the user:
      const {_id,role,email}=req.data;
      // egt the id of the request:
      const {requestId}=req.params;
      // egtt eh state of the result:
      const {state}=req.body;
      const request=await employeeModel.findOne({_id:requestId});
      if(!request)
      {
        return next(new Error("the request is nit exists that can be deleted check the id and try again"));
      }
      // chekc on the role of the user and the state value:
      if(role=="admin")
      {
          if(state!="initiallyAccepted"&&state!="rejected")
          {
            return next(new Error("as your job(admin) you must only send the only two sates value (rejected,initiallyAccepted)"));
          }
          if(request.state!="underRevising")
          {
            return next(new Error("sorry you can't evaluate the request in this stage"));
          }
          if(state=="initiallyAccepted")
          {
           // update the state:
           request.state="initiallyAccepted";
           // sending email:
           const sendingEmailOne=await sendingEmail({to:request.email,subject:"teachingOnlineCenter request result",text:"congratulations your request is intially accepted",html:`<table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; background-color: #ffffff;">
                    <tr>
                        <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                           Request Result
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                        <b>Hello, ${request.name}!</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                      these is your result of your request you will then go to the final acceptance stage and we will tell you about that if there was a new                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <div style="background-color: #4CAF50; color: white; padding: 15px; font-size: 20px; font-weight: bolder; border-radius: 5px;">
                                            ${state}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#70bbd9" style="padding: 30px 30px 30px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
                                        &reg; Teaching Online Center 2024<br/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`});
    if(!sendingEmailOne)
    {
        return next(new Error("the email is not valid or the internet connection is not satble"));
    }
    request.revisedBy=_id;
    await request.save();
          }
          else if(state=="rejected")
          {
             const {reasonOfReject}=req.body;
             if(!reasonOfReject)
             {
                return next(new Error("the reason of reject must be sended in the rejected state"));
             }
             request.state="rejected";
             request.revisedBy=_id;
             request.reasonOfReject=reasonOfReject;
             await request.save();
             // sending email:
             const sendingEmailOne=await sendingEmail({to:request.email,subject:"teachingOnlineCenter request result",text:"sorry,your requets is rejected",html:`<table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; background-color: #ffffff;">
                    <tr>
                        <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                           request result
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                        <b>Hello, ${request.name}!</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                    have a nice chance in the next request
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <div style="background-color: #4CAF50; color: white; padding: 15px; font-size: 20px; font-weight: bolder; border-radius: 5px;">
                                            ${state}
                                        </div>
                                    </td>
                                </tr>
                                 <tr>
                                    <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                      the condition of reject:
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <div style="background-color: #4CAF50; color: white; padding: 15px; font-size: 20px; font-weight: bolder; border-radius: 5px;">
                                            ${reasonOfReject}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#70bbd9" style="padding: 30px 30px 30px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
                                        &reg; Teaching Online Center 2024<br/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`});
    if(!sendingEmailOne)
    {
        return next(new Error("the email is not valid or the internet connection is not stable"));
    }
          }
      }
      // this is for the superAdmin:
      else if(role=="superAdmin")
      {
          if(request.state!="underRevising"&&request.state!="initiallyAccepted")
          {
            return next(new Error("the current request state must only underRevising or initiallyAccepted"));
          }
          // make the specialized state:
          // accept state:
          if(state=="accepted")
          {
            const {payState}=req.body;
            if(payState===undefined||payState===null||payState==="")
            {
                return next(new Error("you must send the payState in the body for the state accepted"));
            }
            request.state="accepted";
            request.revisedBy=_id;
            request.payState=payState;
            const code=nanoid(8);
            request.pinCode=code;
            request.loggedForAccepted=0;
            await request.save();
            // sending an email:
            const sendingEmailOne=await sendingEmail({to:request.email,subject:"teachingOnlineCenter request result (final)",html:`<table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; background-color: #ffffff;">
                    <tr>
                        <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                           Request Result (final)
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                        <b>Hello, ${request.name}!</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                      these is your final result of your request you will then able to using your account features    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <div style="background-color: #4CAF50; color: white; padding: 15px; font-size: 20px; font-weight: bolder; border-radius: 5px;">
                                            ${state}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#70bbd9" style="padding: 30px 30px 30px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
                                        &reg; Teaching Online Center 2024<br/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`});
    if(!sendingEmailOne)
    {
        return next(new Error("the email is not valid or the internet connection is not stable"));
    }
    const sendingEmailThree=await sendingEmail({to:request.email,subject:"your private data teachingOnlineCenter",text:"this is you private data it's secret not share it with any one",html:` <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; background-color: #ffffff;">
                    <tr>
                        <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                           your private data
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                        <b>Hello, ${request.name}!</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                      <h4>                                        this is your pinCode and the password which by it  you can login to the application.</h4>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <div style="background-color: #4CAF50; color: white; padding: 15px; font-size: 20px; font-weight: bolder; border-radius: 5px;">
                                            <h3>this is your pinCode:</h3>
                                            <p style="font-weight:bolder;">${code}</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 30px 0 0 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                        <h2 style="text-align:center;font-weight:900;">warning (please read this carefully)</h2>
                                     <h4 style="color:red; text-align:center;" >this is data is very private don't share it with any one<br>we not responsible for it.</h4>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#70bbd9" style="padding: 30px 30px 30px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
                                        &reg; Teaching Online Center 2024<br/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`});
    if(!sendingEmailThree)
    {
        return next(new Error("email is not valid or the inetrnet connection is not stable"))
    }
    if(payState==false)
        {
            console.log("yes")
        const sendingEmailTwo=await sendingEmail({to:request.email,subject:"teachingOnlineCenter paymentState",html:`<table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; background-color: #ffffff;">
                    <tr>
                        <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                           payment state 
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                        <b>Hello, ${request.name}!</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                      these is your final result of your request you will then able to using your account features    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <div style="background-color: #4CAF50; color: white; padding: 15px; font-size: 20px; font-weight: bolder; border-radius: 5px;">
                                           you are not payemnt the cost of the service
                                           contact with the superAdmin to pay the cost and continue using the app
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#70bbd9" style="padding: 30px 30px 30px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
                                        &reg; Teaching Online Center 2024<br/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`});
    if(!sendingEmailTwo)
        {
            return next(new Error("the email is not valid or the internet connection is not stable"));
        }
        }

          }
          // reject state:
          else if(state=="rejected")
          {
            const {reasonOfReject}=req.body;
            if(!reasonOfReject)
            {
               return next(new Error("the reason of reject must be sended in the rejected state"));
            }
            request.state="rejected";
            request.revisedBy=_id;
            request.reasonOfReject=reasonOfReject;
            await request.save();
            // sending email:
            const sendingEmailOne=await sendingEmail({to:request.email,subject:"teachingOnlineCenter request result",text:"sorry,your requets is rejected",html:`<table border="0" cellpadding="0" cellspacing="0" width="100%">
       <tr>
           <td style="padding: 20px 0 30px 0;">
               <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; background-color: #ffffff;">
                   <tr>
                       <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                          request result
                       </td>
                   </tr>
                   <tr>
                       <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                           <table border="0" cellpadding="0" cellspacing="0" width="100%">
                               <tr>
                                   <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                       <b>Hello, ${request.name}!</b>
                                   </td>
                               </tr>
                               <tr>
                                   <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                   have a nice chance in the next request
                                   </td>
                               </tr>
                               <tr>
                                   <td align="center" style="padding: 20px 0;">
                                       <div style="background-color: #4CAF50; color: white; padding: 15px; font-size: 20px; font-weight: bolder; border-radius: 5px;">
                                           ${state}
                                       </div>
                                   </td>
                               </tr>
                                <tr>
                                   <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                     the condition of reject:
                                   </td>
                               </tr>
                               <tr>
                                   <td align="center" style="padding: 20px 0;">
                                       <div style="background-color: #4CAF50; color: white; padding: 15px; font-size: 20px; font-weight: bolder; border-radius: 5px;">
                                           ${reasonOfReject}
                                       </div>
                                   </td>
                               </tr>
                           </table>
                       </td>
                   </tr>
                   <tr>
                       <td bgcolor="#70bbd9" style="padding: 30px 30px 30px 30px;">
                           <table border="0" cellpadding="0" cellspacing="0" width="100%">
                               <tr>
                                   <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
                                       &reg; Teaching Online Center 2024<br/>
                                   </td>
                               </tr>
                           </table>
                       </td>
                   </tr>
               </table>
           </td>
       </tr>
   </table>`});
   if(!sendingEmailOne)
   {
       return next(new Error("the email is not valid or the internet connection is not stable"));
   }
          }

          // initially accepted:
          else if(state=="initiallyAccepted")
          {
              // update the state:
           request.state="initiallyAccepted";
           // sending email:
           const sendingEmailOne=await sendingEmail({to:request.email,subject:"teachingOnlineCenter request result",text:"congratulations your request is intially accepted",html:`<table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; background-color: #ffffff;">
                    <tr>
                        <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                           Request Result
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                        <b>Hello, ${request.name}!</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                      these is your result of your request you will then go to the final acceptance stage and we will tell you about that if there was a new                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <div style="background-color: #4CAF50; color: white; padding: 15px; font-size: 20px; font-weight: bolder; border-radius: 5px;">
                                            ${state}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#70bbd9" style="padding: 30px 30px 30px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
                                        &reg; Teaching Online Center 2024<br/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`});
    if(!sendingEmailOne)
    {
        return next(new Error("the email is not valid or the internet connection is not satble"));
    }
    request.revisedBy=_id;
    await request.save();
          }
      }
      else
      {
        return next(new Error("you must be admin or superAdmin to do this operation"));
      }
    const newOne=await employeeModel.findOne({_id:requestId}).populate([{path:"revisedBy"}]);
      // return the resposne:
      return res.json({success:true,message:`the request state is updated sucessfully into ${state}`,request:newOne});
    }
    catch(err)
    {
        return next(err);
    }
}
// get all the meplyees fro superADmin:
export const getEmployeesForSuperAdmin=async (req,res,next)=>
{
    try
    {
        // get the id of th user :
        const {_id,role,email}=req.data;
        // check on the object filter and cratre it:
        const data=req.query;
        let results="";
        if(Object.keys(data).length==0)
        {
            // get the dafualt result:
            results=await employeeModel.find({$or:[{role:"admin"},{role:"instructor"}]}).populate([{path:"addedBy"},{path:"revisedBy"}]).sort("name");
            // retur the resposne:
            return res.json({success:true,employees:results,numberEmployees:results.length});
        }
        // check if the object filed value is empty:
        const mapObject=new Map(Object.entries(data));
        let flag=true
        mapObject.forEach((key,value)=>
        {
            if(value)
            {
               flag=false;
            }
        });
        if(flag)
        {
                       // get the dafualt result:
                       results=await employeeModel.find({$or:[{role:"admin"},{role:"instructor"}]}).populate([{path:"addedBy"},{path:"revisedBy"}]).sort("name");
                       // retur the resposne:
                       return res.json({success:true,employees:results,numberEmployees:results.length});
        }
        console.log("i get here");
        //make the bject filter:
        let objectFIlter={};
        if(data.name)
            objectFIlter.name={$regex:data.name,$options:"i"};
        if(data.email)
        {
            objectFIlter.email={$regex:data.email,$options:"i"};
            console.log("i enetre hete email");
        }
        if(data.phone)
        {
            objectFIlter.phone={$regex:data.phone,$options:"i"};
            console.log('i enter here');
        }
        if(data.state)
            objectFIlter.state=data.state;
        if(data.role)
            objectFIlter.role=data.role;
        if(data.stoppedBySuperAdmin)
            objectFIlter.stoppedBySuperAdmin=data.stoppedBySuperAdmin;
        if(data.payState)
            objectFIlter.payState=data.payState;
        // make th equery:
        console.log(objectFIlter);
        results=await employeeModel.find(objectFIlter).populate([{path:"addedBy"},{path:"revisedBy"}]).sort("name");
        // hcekc on the satte if it exists or not:
        const {externalOrNot}=req.query;
        // check on the extrnal or not:
        if(externalOrNot)
        {
            if(externalOrNot=="yes")
            {
                let newArray=[];
                results.forEach((ele)=>
                {
                    if(ele.state)
                    {
                        newArray.push(ele);
                    }
                });
                // return the response:
                return res.json({success:true,employees:newArray,numberEmployees:newArray.length});
            }
            else if(externalOrNot=="no")
            {
                let newArray=[];
                results.forEach((ele)=>
                {
                    if(!ele.state)
                    {
                        newArray.push(ele);
                    }
                });
                // return the response:
                return res.json({success:true,employees:newArray,numberEmployees:newArray.length});
            }   
            else
            {
                console.log("there is no external");
            }

        }
        // retur he response:
        return res.json({sucess:true,employees:results,numberEmployees:results.length});
    }
    catch(err)
    {
        return next(err);
    }
}
// update the payState of the user:
export const payStateUpdtae=async (req,res,next)=>
{
    try
    {
         // get the id of the user:
         const{_id,role,email}=req.data;
         // get the id of the emplyee:
         const {empId}=req.params;
         const employee=await employeeModel.findOne({_id:empId});
         if(!employee)
         {
            return next(new Error("the employee accouet is not exists check the id and try"));
         }
         if(employee.role=="superAdmin")
         {
            return next(new Error("the employee role and authority not have been apply any cost on him"));
         }
         // get the state:
         const {payState}=req.body;
         if(payState===undefined||payState===""||payState===null)
         {
            return next(new Error("the payState is not exists it must be exists in the body"));
         }
         if(employee.state)
         {
            if(employee.state!="accepted")
            {
                return next(new Error("the employee must be in the accepted state"));
            }
         }
         if(payState==employee.payState)
         {
            return next(new Error(`the employee pay state is already ${employee.payState} can't change it to the same state`));
         }
         // if true:
         if(payState)
         {
            if(employee.payState)
            {
                return next(new Error("the employee is already pay the cost"));
            }
            // payment state:
            employee.payState=true;
            const sendingEmailOne=await sendingEmail({to:employee.email,subject:'teachingOnlineCenter paymant State',html:`<table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; background-color: #ffffff;">
                    <tr>
                        <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                           payment state
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                        <b>Hello, ${employee.name}!</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                    payment State
                                 </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <div style="background-color: #4CAF50; color: white; padding: 15px; font-size: 20px; font-weight: bolder; border-radius: 5px;">
                                           you are payment the the costs of service sucessfully
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#70bbd9" style="padding: 30px 30px 30px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
                                        &reg; Teaching Online Center 2024<br/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`});
    if(!sendingEmailOne)
    {
        return next(new Error("the email is not valid or the internet connection si not stable"));
    }
         }
         // if false:
         if(!payState)
         {
            employee.payState=false;
            employee.payResponsible=_id;
            const sendingEmailOne=await sendingEmail({to:employee.email,subject:'teachingOnlineCenter payment state',html:`<table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; background-color: #ffffff;">
                    <tr>
                        <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                           payment state 
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                        <b>Hello, ${employee.name}!</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                   these is your final result of your request you will then able to using your account features    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <div style="background-color: #4CAF50; color: white; padding: 15px; font-size: 20px; font-weight: bolder; border-radius: 5px;">
                                           you are not payemnt the cost of the service
                                           contact with the superAdmin to pay the cost and continue using the app
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#70bbd9" style="padding: 30px 30px 30px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
                                        &reg; Teaching Online Center 2024<br/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`});
    if(!sendingEmailOne)
    {
        return next(new Error("the email is not valid or the inetrnet connection is not stable"));
    }
         }
        await employee.save();
        const newEmp=await employeeModel.findOne({_id:empId}).populate([{path:"addedBy"},{path:"revisedBy"},{path:"stoppedBy"},{path:"payResponsible"}]);
        return res.json({success:true,employee:newEmp}); 
    }
    catch(err)
    {
        return next(err);
    }
}
// stop the  employee:
export const stopEmployeeOrUnStopHim=async (req,res,next)=>
{
    try
    {
        // get the id of the user:
        const {_id,role,email}=req.data;
        // get the id of the meployee:
        const {empId}=req.params;
        const employee=await employeeModel.findOne({_id:empId});
        if(!employee)
        {
            return next(new Error("the employee accoeunt is not exists"));
        }
        if(employee.role=="superAdmin")
        {
            return next(new Error("you can't stop the superAdmin"));
        }
        // check  the state of stop is here or not:
        const {stoppedBySuperAdmin,conditionOfStop}=req.body;
        if(employee.stoppedBySuperAdmin==stoppedBySuperAdmin)
        {
            return next(new Error(`the employee already is in the state ${stoppedBySuperAdmin}`))
        }
        //meke the two state:
        if(stoppedBySuperAdmin==true)
        {
            // mkae the condition of true:
            employee.stoppedBySuperAdmin=true;
            const {conditionOfStop}=req.body;
            employee.conditionOfStop=conditionOfStop;
            employee.payResponsible=_id;
            if(!conditionOfStop)
            {
                return next(new Error("the condition of stop must be added"));
            }
            await employee.save();
            const sendingEmailOne=await sendingEmail({to:employee.email,subject:"teachingOnlineCenter stopState",html:`<table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; background-color: #ffffff;">
                    <tr>
                        <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                           stopped state 
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                        <b>Hello, ${employee.name}!</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                    you are stopped by the superAdmin
                                </tr>
                                 <tr>
                                    <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                   \the condition of stop:
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <div style="background-color: #4CAF50; color: white; padding: 15px; font-size: 20px; font-weight: bolder; border-radius: 5px;">
                                          <h3> ${conditionOfStop}</h3>
                                          <p>you will not able to use the app until you solve this problem with the superAdmin</p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#70bbd9" style="padding: 30px 30px 30px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
                                        &reg; Teaching Online Center 2024<br/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`});
    if(!sendingEmailOne)
    {
        return next(new Error("the email is not valid or the internet connection is not stable"));
    }
        }
        else if(stoppedBySuperAdmin==false)
        {
           // make condition of false:
           employee.stoppedBySuperAdmin=false;
           await employee.save();
           const sendingEmailOne=await sendingEmail({to:employee.email,subject:"teachingOnlineCenter stop State",html:` <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; background-color: #ffffff;">
                    <tr>
                        <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                           stopped state 
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                        <b>Hello, ${employee.name}!</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                     <p style="color:white;background-color:green;text-align:center;font-size:larger;font-weight:400">you now not stop and you can use the app normally</p>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#70bbd9" style="padding: 30px 30px 30px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
                                        &reg; Teaching Online Center 2024<br/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`});
    if(!sendingEmailOne)
    {
        return next(new Error("the email is not valid or the internet connection is not stable"));
    }
        }
        else 
        {
            return next(new Error("the stoppedBySuperAdminValue must be true or false"))
        }
        // get the new employee:
        const newEmployee=await employeeModel.findOne({_id:empId}).populate([{path:"addedBy"},{path:"revisedBy"},{path:"stoppedBy"},{path:"payResponsible"}]);
        // retun the resposne:
        return res.json({success:true,message:"the user stop state is updated successfully",employee:newEmployee});     
    }
    catch(err)
    {
        return next(err);
    }

}
// get the stoppedBY or get data of the employee who have stop me:
export const getDataOfIStoppedBYOrState=async (req,res,next)=>
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
if(!token.startsWith("ahmed__"))
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
const user=await employeeModel.findOne({_id,email}).populate([{path:"addedBy"},{path:"revisedBy"},{path:"payResponsible"},{path:"stoppedBy"}]).select("stoppedBy payResponsible revisedBy addedBy isActivated");
if(!user)
{
  return next(new Error("sorry the user is not exists or the accouent may be deleted"));
}
// check on he validsity and activation of the account:
if(!user.isActivated)
{
  return next(new Error("the user account is not activated yet"));
}
return res.json({sucess:true,data:user});
}
catch(err)
{
    return next(err);
}
}
// delete the user bu him self or delete by the superAdmin:
export const deleteEmployeeBySuperAdmin=async (req,res,next)=>
{
    try
    {
//     egt the id of the superdmi:
const {_id,email}=req.data;
// get the id of the employee:
const {empId}=req.params;
const employee=await employeeModel.findOne({_id:empId});
if(!employee)
{
    return next(new Error("the employee is not exists check the id"));
}
if(employee.state)
{
    if(employee.state=="underRevising"||employee.state=="initiallyAccepted")
    {
        return next(new Error(`you can't delete the employee when his request in the state :${employee.state}`));
    }
}
if(employee.role=="superAdmin")
{
    return next(new Error("you can't delete the account of superAdmin"));
}
await employee.deleteOne({});
// return the response:
return res.json({success:true,message:"the employee is deleted sucessfully"});
    }
    catch(err)
    {
        return next(err);
    }
}
// get the employee profiel:
export const getEmpProfile=async (req,res,next)=>
{
    try
    {
        // get the id of the user:
        const user=await employeeModel.findOne({_id:req.data._id});
        if(!user)
        {
            return next(new Error("the user is not exists or the accouent is deleted"));
        }
        // returnt eh resposne:
        return res.json({success:true,user});
    }
    catch(err)
    {
        return next(err);
    }
}
// updte the profile links of the employeess:
export const updateProfileLinksController=async (req,res,next)=>
{
    try
    {
        // get the id of the user:
        const {_id}=req.data;
        // get the user data ans chekc on the links all of them:
        const user=await employeeModel.findOne({_id});
        if(!user)
        {
            return next(new Error("the user is not exists chekc the id and try again"));
        }
        let  {profileLinks}=user;
        // chekc on the logo of profile:
        const {facebook,linkedin,github,youtube}=req.body;
        const newMapGet=new Map(Object.entries(req.body));
        let flag=false;
        newMapGet.forEach((value,key)=>
        {
            if(value)
            {
                const newMapMade=new Map(Object.entries(value));
                newMapMade.forEach((value2,key2)=>
                {
                    if(value2)
                    {
                        flag=true;
                    }
                })
            }
        });
        if(!flag)
        {
            return next(new Error("the data is not updated because the object is empty"));
        }
        // check on the every link of social media to check it:
        if(facebook)
        {
            // make the logic for the social media facebook:
            const {link,removeOrNot}=facebook;
            if(!link&&!removeOrNot)
            {
                console.log("the object of facebook is empty");
            }
            if(removeOrNot)
            {
                if(!profileLinks.facebook.link)
                {
                    return next(new Error("there is no link for facebook to delete"));
                }
                else
                {
                    // remove the link for facebook:
                    profileLinks.facebook.link="";
                }
            }
            else
            {
                if(link)
                {
                    // make the logic for the link now:
                    profileLinks.facebook.link=link;
                }
            }
        }
        if(linkedin)
        {
            const {link,removeOrNot}=linkedin;
            if(!link&&!removeOrNot)
            {
                console.log("the object of linked in is empty");
            }
            if(removeOrNot)
            {
                // make the logic of it:
                if(!profileLinks.linkedin.link)
                {
                    return next(new Error("there no linkedin link to remove"))
                }
                else
                {
                    // remove the links:
                    profileLinks.linkedin.link="";
                }
            }
            else
            {
                if(link)
                {
                    // if the link is exists what will you do:
                    profileLinks.linkedin.link=link;
                }
            }
        }
        if(github)
        {
            // make the logic for github:
            const {link,removeOrNot}=github;
            if(!link&&!removeOrNot)
            {
                console.log("the object is empty of github to update");
            }
            // check now remove or not:
            if(removeOrNot)
            {
                if(!profileLinks.github.link)
                {
                    return next(new Error("there is no link for github to remove"));
                }
                else
                {
                    profileLinks.github.link="";
                }
            }
            else
            {
                if(link)
                {
                    profileLinks.github.link=link;
                }
            }
        }
        if(youtube)
        {
            // make the logic for github:
            const {link,removeOrNot}=youtube;
            if(!link&&!removeOrNot)
            {
                console.log("the object is empty of youtube to update");
            }
            // check now remove or not:
            if(removeOrNot)
            {
                if(!profileLinks.youtube.link)
                {
                    return next(new Error("there is no link for youtube to remove"));
                }
                else
                {
                    profileLinks.youtube.link="";
                }
            }
            else
            {
                if(link)
                {
                    profileLinks.youtube.link=link;
                }
            }
        }
        // mak the query and make it:
        const newUser=await employeeModel.findOneAndUpdate({_id},{profileLinks:profileLinks},{new:true});
        // retur the resposne:
        return res.json({sucess:true,message:"the user data is updated sucessfully"});
    }
    catch(err)
    {
        return next(err);
    }
}
// check the video of course:
export const watchMediaOfCourse=async(req,res,next)=>
{
    try
    {
        // get the id of the user:
        const {_id,role}=req.data;
        // get the id of the the course:
        const {courseId}=req.params;
        // check on the course:
        const course=await courseModel.findOne({_id:courseId}).populate([{path:"instructor"}]);
        if(!course)
        {
            return next(new Error("the course is not exists check the id or it may be deleted"));
        }
        // check the course ins:
        if(role=="superAdmin")
        {
            // give him the access:
            return res.json({success:true,message:"this user can access the course data"});
        }
        // chekc on the ins:
        else if(role=="instructor")
        {
            if(_id.toString()!=course.instructor._id.toString())
            {
                return next(new Error("you can't access the data of course because you are not the owner of this course"));
            }
        }
        return res.json({sucess:true,message:"this user can access the course data"})
    }
    catch(err)
    {
        return next(err);
    }
}
// get the dashbords fro super admin:
export const getDashbForSuperAdmin=async (req,res,next)=>
{
    try
    {
        // get the courses and categories and subcategoriesand students and the number of instructors and the numbers of instrvuctors requests:
        const courses=await courseModel.find();
        const categroeis=await categoryModel.find();
        let subCategories=[];
        categroeis.forEach((ele)=>
        {
            const {subCategory}=ele;
            subCategory.forEach((ele2)=>
            {
                subCategories.push(ele2);
            });
        });
        // get the number of students:
        const students=await participntsModel.find();
        // const the number of ins:
        const ins=await employeeModel.find({role:"instructor",pinCode:{$ne:null}});
        // number of request of ins:
        const requestInsThatNowExists=await employeeModel.find({$or:[{state:"underRevising"},{state:"initiallyAccepted"}],state: { $exists: true, $ne: null }});
        // numbver of ins requetss all:
        const requestInsThatAllFromStart=await employeeModel.find({state: { $exists: true, $ne: null }});

        // nsuger of request of stud:
        const requestsStudentsToBuyCourses=await subscribersModel.find({$or:[{state:"notSeenYet"},{state:"noActionTaken"}]});
        // get the request of students that already make requets without to the result of the request or the process of buy is completed:
        const allReqyestsStudents=await subscribersModel.find();
        // that the numver of ins not payed now:
        const numberOfInsNotPayedCosts=await employeeModel.find({payState:false});
        // number of ins stopped now:
        const numberOfInsThatStoppedBySuperAdmin=await employeeModel.find({stoppedBySuperAdmin:true});
        // retur the resposne:
        return res.json({success:true,courses:courses.length,categroeis:categroeis.length,subCategories:subCategories.length,students:students.length,ins:ins.length,requestInsThatNowExists:requestInsThatNowExists.length,requestInsThatAllFromStart:requestInsThatAllFromStart.length,numberOfInsNotPayedCosts:numberOfInsNotPayedCosts.length,numberOfInsThatStoppedBySuperAdmin:numberOfInsThatStoppedBySuperAdmin.length,requestsStudentsToBuyCoursesThatAlreadyNew:requestsStudentsToBuyCourses.length,allReqyestsStudents:allReqyestsStudents.length})
    }
    catch(err)
    {
        return next(err);
    }
}
// get dashboards for one ins:
export const getDashboardForSpIns=async (req,res,next)=>
{
    try
    {
        const {insId}=req.params;
        // chek con the ins:
        const ins=await employeeModel.findOne({_id:insId});
        if(!ins)
        {
            return next(new Error("the instcructor id is not exists check the id and try again"));
        }
        if(ins.role!="instructor")
        {
            return next(new Error("the dashboards is only can get when the employee role is instrcutor"))
        }
        const {_id}=ins;
        // check on the ins good it:
        // get the ins courses that he make or do:
        const courses=await courseModel.find({instructor:_id});
        let  collectCourseIdsOfIns=[];
        courses.forEach((ele)=>
        {
            const {_id}=ele;
            collectCourseIdsOfIns.push(_id);
        })
        // get the number of studntts now wants to subscribe to the course:
        const newStucentsWantToSubscribe=await subscribersModel.find({courseId:{$in:collectCourseIdsOfIns},state:"notSeenYet"});
        // get the number of students aalready in the course:
        const studentsThatAlreadyInYourCourses=await participntsModel.find({course:{$in:collectCourseIdsOfIns}});
        // get the all number of students thta make requeests in all the state:
        const studentsOrUsersThatInterestedAboutYorCourses=await subscribersModel.find({courseId:{$in:collectCourseIdsOfIns}});
        // get the number of cousres free tht you make:
        const coursesFreeThatYouPresent=await courseModel.find({instructor:_id,coursePrice:"free"});
        // retu the the resposne:
        return res.json({success:true,
            courses:courses.length,
            newStucentsWantToSubscribe:newStucentsWantToSubscribe.length,
            studentsThatAlreadyInYourCourses:studentsThatAlreadyInYourCourses.length,
            studentsOrUsersThatInterestedAboutYorCourses:studentsOrUsersThatInterestedAboutYorCourses.length,
            coursesFreeThatYouPresent:coursesFreeThatYouPresent.length,
        });
    }
    catch(err)
    {
        return next(err);
    }
}
// after reject the request make the the user can make another request:
// we should mke the modification in the adding logic that okay:
