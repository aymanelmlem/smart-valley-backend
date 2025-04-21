import cloudinary from "../../utils/cloudinary.config.js";
import { nanoid } from "nanoid";
import bcryptjs from 'bcryptjs';
import sendingEmail from "../../utils/sendEmail.js";
import employeeModel from "../../../db/models/employees/meployees.model.js";
import subscribersModel from "../../../db/models/subscribers/subscribers.model.js";
import getRequetsToMakeNotSeenState from "../../utils/makeNotSeenForRequets.fun.js";
import participntsModel from "../../../db/models/participnts/partcipints.model.js";
import courseModel from "../../../db/models/courses/courses.model.js";
export const addRequet=async (req,res,next)=>
{
    try
    {
        // get the data:
        const data=req.body;
        console.log(req.files);
        // check on the profile picture and resume:
        if(!req.files||req.files.length==0)
        {
            return next(new Error("you must uploaded your resume"));
        }
        else
        {
            console.log(req.files);
        }
        if(req.files.length>2)
        {
            return next(new Error("you uploaded more another two files you only can upload two files one for the your resume and  one for the profile picture"));
        }
        const objectPhoto={};
        const objectResume={};
        let ofResumeFlag=false;
        // check on he loop:
        for(let i=0;i<req.files.length;i++)
        {
          if(req.files.length>1)
          {
            if(req.files[0].fieldname==req.files[1].fieldname)
                {
                 return next(new Error("you can't upload two file swith the same fieldName"));
                }
          }
           if(req.files[i].fieldname=="profilePicture")
           {
               // amke the code of profile pic:
               const upladingFilePic=await cloudinary.uploader.upload(req.files[i].path,{folder:`/uploads/teachingOnlineCenter/employees/${data.name}/profilePicture/`});
               objectPhoto.secure_url=upladingFilePic.secure_url;
               objectPhoto.public_id=upladingFilePic.public_id; 
               data.profilePicture=objectPhoto;
           }
           else if(req.files[i].fieldname=="resume")
           {
     // amke the code of profile pic:
     const uploadingFileREsume=await cloudinary.uploader.upload(req.files[i].path,{folder:`/uploads/teachingOnlineCenter/employees/${data.name}/resume/`});
     objectResume.secure_url=uploadingFileREsume.secure_url;
     objectResume.public_id=uploadingFileREsume.public_id; 
     data.profileResume=objectResume;
     ofResumeFlag=true;
           }
           
           else
           {
            continue;
           }
        }
        if(!ofResumeFlag)
        {
            return next(new Error("the resume photo is not uploaded it is required"));
        }
        // amke the pass and send the code:
        const code=nanoid(8);
        data.emailCode=code;
        const sendingEmailOk=await sendingEmail({to:data.email,subject:"onlineTeachingCenter activationAccount",text:"this is your code to activate your account",html:`<table border="0" cellpadding="0" cellspacing="0" width="100%">
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
                                        <b>Hello, ${data.name}!</b>
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
    if(!sendingEmailOk)
    {
        return next(new Error("the email is not valid or the internet connection is not stable"));
    }
        // make the pass:
        data.password=bcryptjs.hashSync(data.password,8);
        // make the state:
        data.state="notInQueue";
        data.role="instructor";
        await employeeModel.create(data);
    // return the resposne:
    return res.json({success:true,message:'sidned up successfully and your request is maked success you must go to your gmail to active your account'});
    }
    catch(err)
    {
        return next(err);
    }
}
// delet the request:
export const deleteRequet=async (req,res,next )=>
{
    try
    {
       const {_id,email}=req.data;
       const user=await employeeModel.findOne({_id:_id,email});
       if(!user)
       {
        return next(new Error("the user request is not exists"));
       }
       // cehck if the requets is have been seen:
       if(user.revisedBy&&user.state=="accepted")
       {
        return next(new Error("sorry you can't delete the request after it have beeen evaluated or in the accept state if you eant to delet it contact with the specialied Admin accepted"));
       }
       // sdelet the request:
       await user.deleteOne();
       // retru the response:
       return res.json({success:true,message:"your account with the request is deleted sucessfully"});

    }
    catch(err)
    {
        return next(err);
    }
}
//get the instructro request ressult:
export const getInsReqRes=async (req,res,next)=>
{
    try
    {
      // get the user data:
      const {_id}=req.data;
      const user=await employeeModel.findOne({_id});
      if(!user)
      {
        return next(new Error("the request is not exists"));
      }
      if(user.role!="instructor")
      {
        return next(new Error("sorry you are not authorized to get the rsult of request because you are not instructor"));
      }
      // retur the resposne:
      return res.json({success:true,requestData:user});
    }
    catch(err)
    {
        return next(err);
    }
}
// delete the account:
export const deleteAccount=async (req,res,next)=>
{
    try
    {
        const {_id}=req.data;
        // delete the acocunt:
        await employeeModel.deleteOne({_id});
        // retur the resposne:
        return res.json({success:true,message:"the account is deleted sucessfully"});
    }
    catch(err)
    {
        return next(err);
    }
}
// get specefiec instructor for the user:
export const getSpInsToUser=async (req,res,next)=>
{
    try
    {
        // get the id of the ins:
        const {insId}=req.params;
        // get the instrcutor:
        const ins=await employeeModel.findOne({_id:insId}).populate([{path:"courses",populate:[{path:"sections"}]}]);
        if(!ins)
        {
            return next(new Error("there is no instrcutor by this course exists check the id of the instrcutor and try again"));
        }
        // return the resposne:
        return res.json({success:true,instructor:ins});
    }
    catch(err)
    {
        return next(err);
    }
}
// get all the instcruyors requests of students to buy the course:
export const getRequetsOfJoinCourses=async (req,res,next)=>
{
    try
    {
        // get the id of the user:
        const {_id}=req.data;
        let requests=[];
        // check on the id of the course if it exists:
        const data=req.query;
        // get all the the courses these instructor study:
        const getCourses=await employeeModel.findOne({_id}).populate([{path:"courses"}]);
        // get courses:
        const {courses}=getCourses;
        let ids=[];
        // get all the ids of courses:
        courses.forEach((ele,index)=>
        {
            const {_id}=ele;
            ids.push(_id);
        });
        // chekc on if the data of filtering it empty or not:
        if(Object.keys(data).length<=0)
        {
        // make the query to get the courses and make this:
        requests=await subscribersModel.find({courseId:{$in:ids}}).populate([{path:"subscribeId"},{path:"courseId"}]).sort("cretedAt");
        await getRequetsToMakeNotSeenState(requests,next);
        console.log(requests);
        //return the response:
        return res.json({success:true,requests,numberRequets:requests.length});
        }
        // chekc now on the vaue of the keys it it exists also:
        const newMap=new Map(Object.entries(data));
        let flag=false;
        newMap.forEach((value,key)=>
        {
            if(value)
                flag=true;
        });
        if(!flag)
        {
                    // make the query to get the courses and make this:
        requests=await subscribersModel.find({courseId:{$in:ids}}).populate([{path:"subscribeId"},{path:"courseId"}]).sort("cretedAt");
       await getRequetsToMakeNotSeenState(requests,next);
        //return the response:
        return res.json({success:true,requests,numberRequets:requests.length});
        }
        // make an the object of the filter and make the filtering now:
        let objectFilter={};
        if(data.courseId)
            objectFilter.courseId=data.courseId;
        if(data.state)
            objectFilter.state=data.state;
        if(data.userId)
            objectFilter.subscribeId=req.query.userId;
        if(objectFilter.courseId)
        {
        // make the query to get the courses and make this:
        requests=await subscribersModel.find({...objectFilter}).populate([{path:"subscribeId"},{path:"courseId"}]).sort("cretedAt");
        if(data.userName)
        {
            // make the logic for the user name query also:
            let newArr=[];
            requests.forEach((ele,index)=>
            {
                if(ele.userName.includes(data.userName))
                {
                    newArr.push(ele);
                }
            });
           await getRequetsToMakeNotSeenState(newArr,next);
           // return  the response:
           return res.json({success:true,requests:newArr,numberRequets:newArr.length})   
        }
       await getRequetsToMakeNotSeenState(requests,next);
        //return the response:
        return res.json({success:true,requests,numberRequets:requests.length});
        }
        else
        {
        // make the query to get the courses and make this:
        requests=await subscribersModel.find({courseId:{$in:ids},...objectFilter}).populate([{path:"subscribeId"},{path:"courseId"}]).sort("cretedAt");
        if(data.userName)
            {
                // make the logic for the user name query also:
                let newArr=[];
             if(requests.length>0)
             {
                requests.forEach((ele,index)=>
                    {
                        console.log("this is the course request",ele);
                        if(ele.subscribeId.userName.includes(data.userName))
                        {
                            newArr.push(ele);
                        }
                    });
             }
               await getRequetsToMakeNotSeenState(newArr,next);
               // return  the response:
               return res.json({success:true,requests:newArr,numberRequets:newArr.length})   
            }
        await getRequetsToMakeNotSeenState(requests,next);
        //return the response:
        return res.json({success:true,requests,numberRequets:requests.length});
        }
    }
    catch(err)
    {
        return next(err);
    }
}
//evaluate an specefiec requests:
export const evaluateRequetsForJoin=async (req,res,next)=>
{
    try
    {
        // get the id of instrcutor:
        const {_id}=req.data;
        // get the id requests:
        const {requestId}=req.params;
        // chekc on the requests if it exists:
        const request=await subscribersModel.findOne({_id:requestId}).populate([{path:"subscribeId"},{path:"courseId",populate:[{path:"instructor"}]}]);
        if(!request)
        {
            return next(new Error("the request you want to evaluate it not exists chekc the id or it may deleted"));
        }
        // check on the course related to this instructor or not:
        const {instructor}=request.courseId;
        if(_id.toString()!=instructor._id.toString())
        {
            return next(new Error("yiu are not the owner of the course to evaluet this request"));
        }
        // update the stete:
        const {state}=req.body;
        if(state==request.state)
            return next(new Error("the request is already in this state"));
        let getRes="";
        if(state=="payed")
        {
            // make the logic:
            getRes=await subscribersModel.findOneAndUpdate({_id:requestId},{state:state},{new:true}).populate([{path:"subscribeId"},{path:"courseId",populate:[{path:"instructor"}]}])
            await participntsModel.create({user:request.subscribeId._id,course:request.courseId._id});
            // send the  email to the user:
            const sendingEmailOne=await sendingEmail({to:request.subscribeId.userEmail,subject:"EdumatekPrime joinCourse",html:`
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td style="padding: 20px 0 30px 0;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #002147; background-color: #ffffff;">
                <!-- شعار المنصة -->
                <tr>
                    <td align="center" style="padding: 20px; background-color: #002147;">
                        <img src="https://res.cloudinary.com/dzqvcewvy/image/upload/v1725979834/uploads/teachingOnlineCenter/employees/omer%20Khalid%20kamal/courses/lessonsPdfs/chrb49reacg08m87a0am.jpg" alt="Edumatek Prime Logo" style="border-radius: 50%; width: 100px; height: 100px;">
                    </td>
                </tr>
                <!-- رسالة الانضمام -->
                <tr>
                    <td align="center" bgcolor="#002147" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                        Course Enrollment Status
                    </td>
                </tr>
                <!-- محتوى البريد -->
                <tr>
                    <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="color: #002147; font-family: Arial, sans-serif; font-size: 24px;">
                                    <b>Hello, ${request.subscribeId.userName}!</b>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 20px 0 30px 0; color: #002147; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                    Based on the instructor's evaluation, your request to join the course has been reviewed.
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 20px 0;">
                                    <div style="background-color: #FF8C00; color: white; padding: 15px; font-size: 20px; font-weight: bolder; border-radius: 5px;">
                                        ${state} <!-- يمكن أن يكون "Approved" أو "Declined" -->
                                    </div>
                                </td>
                            </tr>
                            <!-- رابط للتفاصيل -->
                            <tr>
                                <td style="padding: 20px 0; font-family: Arial, sans-serif; font-size: 16px; color: #002147;">
                                    For more details about your enrollment status, please visit the link below:
                                    <br><br>
                                    <a href="http://localhost:5173/course-status" style="color: #FF8C00; text-decoration: none; font-weight: bold;">
                                        http://localhost:5173/course-status
                                    </a>
                                </td>
                            </tr>
                            <!-- رقم المدرس للتواصل -->
                            <tr>
                                <td style="padding: 30px 0 0 0; color: #002147; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                    If you have any issues or questions, please feel free to contact the instructor directly at:
                                    <br><br>
                                    <b>Instructor Phone: ${instructor.phone}</b> <!-- رقم المدرس -->
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 30px 0 0 0; color: #002147; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                    If you did not request to join this course, please ignore this email.
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
                    return next(new Error("the email is not sending or the internet connection is not stable"));
                }
            // retur the resposne:
            return res.json({success:true,message:"the request state is updated sucessfully",request:getRes});
        }
        else
        {
            // make the logic:
            getRes=await subscribersModel.findOneAndUpdate({_id:requestId},{state},{new:true});
            // check i gthe user is exists in the participnts and delete it:
            const getResFromPart=await participntsModel.findOne({user:request.subscribeId._id,course:request.courseId._id});
            if(getResFromPart)
            {
                await getResFromPart.deleteOne();
            }
            // send the email:
            const sendingEmailOne=await sendingEmail({to:request.subscribeId.userEmail,subject:"EdumatekPrime joinCourse",html:`
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td style="padding: 20px 0 30px 0;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #002147; background-color: #ffffff;">
                <!-- شعار المنصة -->
                <tr>
                    <td align="center" style="padding: 20px; background-color: #002147;">
                        <img src="https://res.cloudinary.com/dzqvcewvy/image/upload/v1725979834/uploads/teachingOnlineCenter/employees/omer%20Khalid%20kamal/courses/lessonsPdfs/chrb49reacg08m87a0am.jpg" alt="Edumatek Prime Logo" style="border-radius: 50%; width: 100px; height: 100px;">
                    </td>
                </tr>
                <!-- رسالة الانضمام -->
                <tr>
                    <td align="center" bgcolor="#002147" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                        Course Enrollment Status
                    </td>
                </tr>
                <!-- محتوى البريد -->
                <tr>
                    <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="color: #002147; font-family: Arial, sans-serif; font-size: 24px;">
                                    <b>Hello, ${request.subscribeId.userName}!</b>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 20px 0 30px 0; color: #002147; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                    Based on the instructor's evaluation, your request to join the course has been reviewed.
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 20px 0;">
                                    <div style="background-color: #FF8C00; color: white; padding: 15px; font-size: 20px; font-weight: bolder; border-radius: 5px;">
                                        ${state} <!-- يمكن أن يكون "Approved" أو "Declined" -->
                                    </div>
                                </td>
                            </tr>
                            <!-- رابط للتفاصيل -->
                            <tr>
                                <td style="padding: 20px 0; font-family: Arial, sans-serif; font-size: 16px; color: #002147;">
                                    For more details about your enrollment status, please visit the link below:
                                    <br><br>
                                    <a href="http://localhost:5173/course-status" style="color: #FF8C00; text-decoration: none; font-weight: bold;">
                                        http://localhost:5173/course-status
                                    </a>
                                </td>
                            </tr>
                            <!-- رقم المدرس للتواصل -->
                            <tr>
                                <td style="padding: 30px 0 0 0; color: #002147; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                    If you have any issues or questions, please feel free to contact the instructor directly at:
                                    <br><br>
                                    <b>Instructor Phone: ${instructor.phone}</b> <!-- رقم المدرس -->
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 30px 0 0 0; color: #002147; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                    If you did not request to join this course, please ignore this email.
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
                    return next(new Error("the email is not sending or the internet connection is not stable"));
                }
            // retur the resposne:
            return res.json({success:true,message:"the request state is updated sucessfully",request:getRes});
        }
    }
    catch(err)
    {
        return next(err);
    }
}
// ins dashboards:
export const getInsDashboard=async (req,res,next)=>
{
    try
    {
        // sgt te id of the ins first:
        const {_id}=req.data;
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
        })
    }
    catch(err)
    {
        return next(err);
    }
}    