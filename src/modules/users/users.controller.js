import userModel from "../../../db/models/users/users.model.js";
import cloudinary from "../../utils/cloudinary.config.js";
import bcryptjs from 'bcryptjs';
import sendingEmail from "../../utils/sendEmail.js";
import jwt from 'jsonwebtoken';
import userTokenModel from "../../../db/models/usersToken/user.token.model.js";
import { nanoid } from "nanoid";
import courseModel from "../../../db/models/courses/courses.model.js";
import participntsModel from "../../../db/models/participnts/partcipints.model.js";
import employeeModel from "../../../db/models/employees/meployees.model.js";
import subscribersModel from "../../../db/models/subscribers/subscribers.model.js";
export const signUpController=async (req,res,next)=>
{
    try
    {
        // egtt he data of the user:
        const data=req.body;
        let flagPhoto=false;
        if(req.files&&req.files.length>0)
        {
            // mak the cliudinary uploader:
            if(req.files.length>1)
            {
                return next(new Error("you must only uplaod one image"));
            }
            flagPhoto=true;
        }
        // check on the pass:
        const {password,rePassword}=data;
        if(password!=rePassword)
        {
            return next(new Error("the password and the rePassword not matching"));
        }
        // bcrypt yhe pass:
        data.password=bcryptjs.hashSync(password,8);
        // check on the age:
        const {userAge}=data;
        if(!userAge)
        {
            return next(new Error("you must enetr the age"));
        }
        if(+userAge>100||+userAge<10)
        {
            return next(new Error("the user age must be less than 100 and bigger than or equal to 10"));
        }
        // mek the user ont he collection:
        await userModel.create(data);
        //sending email:
        const sendingEmailOne=await sendingEmail({to:data.userEmail,subject:"Email Activation for Edumatec Prime Academy",html:`
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden;">
        <tr>
            <td align="center" bgcolor="#00264d" style="padding: 30px 0;">
                <!-- Direct link to display the image -->
                <img src="https://res.cloudinary.com/dzqvcewvy/image/upload/v1725623505/uploads/teachingOnlineCenter/categories/bslh7cnquapecxaylack.jpg" alt="EDUMATEC Prime" width="150" style="display: block; border-radius: 50%;">
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <h1 style="color: #00264d; font-size: 26px; margin-bottom: 20px;">Welcome to EDUMATEC Prime!</h1>
                <p style="font-size: 18px; color: #333333; line-height: 1.6; margin-bottom: 30px;">
                    Thank you for signing up on our platform! To activate your account and start learning, please click the button below.
                </p>
                <a href="https://finalofteachingonlinecenter.onrender.com/users/activateEmail/${data.userEmail}" style="background-color: #ff6600; color: #ffffff; padding: 15px 25px; text-decoration: none; font-size: 18px; border-radius: 5px;">
                    Activate Your Account
                </a>
            </td>
        </tr>
        <tr>
            <td align="center" bgcolor="#00264d" style="padding: 20px 20px; color: #ffffff; font-size: 14px;">
                © 2024 EDUMATEC Prime. All rights reserved.
            </td>
        </tr>
    </table>
</body>
            `});
            if(!sendingEmailOne)
            {
                return next(new Error("the internet connection is not stable or the email is not true"));
            }
        // chekc on the photo:
        if(flagPhoto)
        {
            const user=await userModel.findOne({userEmail:data.userEmail});
            if(!user)
            {
                return next(new Error("there is an error after signing up"));
            }
            const uploadingPhotoFile=await cloudinary.uploader.upload(req.files[0].path,{folder:`/uploads/teachingOnlineCenter/users/${data.userName}/profilePicture/`});
            if(!uploadingPhotoFile)
            {
                return next(new Error("the profilePhoto is not uploaded sucessfully but signed Up sucessfully check your email for Activation"));
            }
            let objectPhoto={public_id:uploadingPhotoFile.public_id,secure_url:uploadingPhotoFile.secure_url};
            user.profilePicture=objectPhoto;
            await user.save();
        }
        // return the response:
        return res.json({success:true,message:"the user is signed Up sucessfully check your email for activation"});
    }
    catch(err)
    {
        return next(err);
    }
}
// activate the email:
export const activateEMailForUsers=async (req,res,next)=>
{
    try
    {
        // egt the emial of the user:
        const {userEmail}=req.params;
        const user=await userModel.findOne({userEmail});
        if(!user)
        {
            return next(new Error("the user is not exists chech the email and try again or the account may be deleted"));
        }
        if(user.isActivated)
        {
            return next(new Error("the email is already activted before"))
        }
        user.isActivated=true;
        await user.save();
        // retur the response:
        return res.json({success:true,message:"the user email is activetd successfully you can login Now"});
    }
    catch(err)
    {
        return next(err);
    }
}
// login:
export const logIn=async (req,res,next)=>
{
try
{
    // egt the email and the pass of the user:
    const {userEmail,password}=req.body;
    const user=await userModel.findOne({userEmail});
    if(!user)
    {
        return next(new Error("the user email os not exists chech the email and try again"));
    }
    // chekc ont he activatiron also:
    if(!user.isActivated)
    {
        return next(new Error("the user must activate his account first then login"));
    }
    // check on the pass:
    const result=bcryptjs.compareSync(password,user.password);
    if(!result)
    {
        return next(new Error("the password is not true check pass and try again"));
    }
    // make the token:
    const tokenMake=jwt.sign({_id:user._id,email:user.userEmail,isActivated:user.isActivated},"secretKey",{expiresIn:"30d"});
    await userTokenModel.create({userToken:tokenMake,user:user._id,userAgent:req.headers['user-agent']});
    //  heck if it the first time he lo in or not:
    let count=-1;
    const getCountToken=await userTokenModel.find({user:user._id});
    if(getCountToken.length>1)
    {
        count=1;
    }
    else
    {
        count=0;
    }
    // return the resposne with the token:
    return res.json({success:true,message:"the user logged in successfully",token:tokenMake,countLogIn:count});
}
catch(err)
{
    return next(err);
}
}
// forget passowrd controller first step:
export const foregtPassFirstStage=async (req,res,next)=>
{
    try
    {
        const {email}=req.body;
        const usera=await userModel.findOne({userEmail:email});
        if(!usera)
        {
            return next(new Error("the user email is not exists or it may be deletd"));
        }
        if(!usera.isActivated)
        {
            return next(new Error("the user is not activated his aaccount yet"));
        }
        // make the nano id:
        const nanoIdGet=nanoid(5);
        usera.passCode=nanoIdGet;
        await usera.save();
        //sendin the email:
        const sendingEmailOne=await sendingEmail({to:usera.userEmail,subject:"ForgetPass Code",html:`
            <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden;">
        <tr>
            <td align="center" bgcolor="#00264d" style="padding: 30px 0;">
                <!-- Direct link to display the image -->
                <img src="https://res.cloudinary.com/dzqvcewvy/image/upload/v1725623505/uploads/teachingOnlineCenter/categories/bslh7cnquapecxaylack.jpg" alt="EDUMATEC Prime" width="150" style="display: block; border-radius: 50%;">
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <h1 style="color: #00264d; font-size: 26px; margin-bottom: 20px;">Reset Your Password</h1>
                <p style="font-size: 18px; color: #333333; line-height: 1.6; margin-bottom: 30px;">
                    We received a request to reset the password for your account. Please use the code below to reset your password.
                </p>
                <p style="font-size: 22px; font-weight: bold; color: #ff6600; margin-bottom: 30px;">
                    Your Reset Code: <strong>${nanoIdGet}</strong>
                </p>
                <p style="font-size: 18px; color: #333333; line-height: 1.6;">
                    If you did not request this, please ignore this email.
                </p>
            </td>
        </tr>
        <tr>
            <td align="center" bgcolor="#00264d" style="padding: 20px 20px; color: #ffffff; font-size: 14px;">
                © 2024 EDUMATEC Prime. All rights reserved.
            </td>
        </tr>
    </table>
</body>`})
        // retur the resposne:
        return res.json({
            success:true,message:"check your email to get the resetCode for password",
        })
    }
    catch(err)
    {
        return next(err);
    }
}
export const getForgetCodeSatgeTwo=async (req,res,next)=>
{
    try
    {
        // sget the data:
        const {email,code,password,rePass}=req.body;
        const user=await userModel.findOne({userEmail:email});
        if(!user)
        {
            return next(new Error("the user email is not exists check the email and try again"));
        }
        if(!user.isActivated)
        {
            return next(new Error("the user must activate his account first he can revise his email to find the link of activation"));
        }
        // check on the code:
        if(code!=user.passCode)
        {
            return next(new Error("the code is not true"));
        }
        // chekc pass:
        if(password!=rePass)
        {
            return next(new Error("the passwrod and the rePassword is not matched"));
        }
        // update user pass with hashing:
        user.password=bcryptjs.hashSync(password,8);
        // update the reset code to another:
        user.passCode=nanoid(5);
        await user.save();
        // updaet the token:
        await userTokenModel.updateMany({user:user._id},{isValaid:false});
        // send the ressposne:
        return res.json({
            success:true,
            message:"the password is updated sucessfully you can now logged In",
        })
    }
    catch(err)
    {
        return next(err);
    }
}
// update user data:
export const updateUserData=async (req,res,next)=>
{
    try
    {
        // sget the id ofg the user:
        const {_id}=req.data;
        const user=await userModel.findOne({_id});
        const data=req.body;
        let flagOfUpdatePhoto=false;
        // check on the files first:
        if(req.files&&req.files.length>0)
        {
            flagOfUpdatePhoto=true;
        }
        // cehck th eoptions:
    const {photoOptions}=req.query;
    if(photoOptions)
    {
        if(photoOptions=="delete")
        {
            if(req.files.length>0)
            {
                return next(new Error("you can't upload any profile photo when you want to delete it"));
            }
            // hcekc on the user if photo is exists:
            if(user.profilePicture.public_id)
            {
                // delete the photo and make the dafault:
                data.profilePicture={secure_url:"https://th.bing.com/th/id/OIP.n2XS9sXAKYZwzTot_PaZ9wHaHa?rs=1&pid=ImgDetMain"};
            }
            else
            {
                return next(new Error("you alreadu not have an profile picture to delete it"));
            }
        }
        else
        {
            console.log("none");
        }
    }
    // check on the password:
    const {oldPass,password,rePass}=data;
    if(password)
    {
        if(!rePass)
        {
            return next(new Error("you must send the rePass when you update your password"));
        }
        if(!oldPass)
        {
            return next(new Error("you must send your old password if you want to update your password"));
        }
        // check on the old pass:
        if(!bcryptjs.compareSync(oldPass,user.password))
        {
            return next(new Error("the oldPassword is not correct"));
        }
        if(password!=rePass)
        {
            return next(new Error("the password and the rePass not matched"));
        }
        // make the filed now:
        data.password=bcryptjs.hashSync(password,8);
    }
    // check on the email:
    const {userEmail}=data;
    if(userEmail)
    {
        if(userEmail==user.userEmail)
        {
            return next(new Error("the must enter an different email from your email now"));
        }
        // you must active the isActivated to false:
        data.isActivated=false;
        // send an email to be able to activate his email again:
        const sendingEmailNow=await sendingEmail({to:userEmail,subject:"Email Activation for Edumatec Prime Academy",html:`<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden;">
        <tr>
            <td align="center" bgcolor="#00264d" style="padding: 30px 0;">
                <!-- Direct link to display the image -->
                <img src="https://res.cloudinary.com/dzqvcewvy/image/upload/v1725623505/uploads/teachingOnlineCenter/categories/bslh7cnquapecxaylack.jpg" alt="EDUMATEC Prime" width="150" style="display: block; border-radius: 50%;">
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <h1 style="color: #00264d; font-size: 26px; margin-bottom: 20px;">Welcome to EDUMATEC Prime!</h1>
                <p style="font-size: 18px; color: #333333; line-height: 1.6; margin-bottom: 30px;">
                    Thank you for signing up on our platform! To activate your account and start learning, please click the button below.
                </p>
                <a href="http://localhost:3000/users/activateEmail/${userEmail}" style="background-color: #ff6600; color: #ffffff; padding: 15px 25px; text-decoration: none; font-size: 18px; border-radius: 5px;">
                    Activate Your Account
                </a>
            </td>
        </tr>
        <tr>
            <td align="center" bgcolor="#00264d" style="padding: 20px 20px; color: #ffffff; font-size: 14px;">
                © 2024 EDUMATEC Prime. All rights reserved.
            </td>
        </tr>
    </table>
</body>
            `});
    }
    // update the data now:
    const newUser=await userModel.findOneAndUpdate({_id},data,{new:true});
    // check on if the password or the email is exists:
    if(data.password||data.email)
    {
        // make all the token to this user inValid:
        await userTokenModel.updateMany({user:_id},{isValaid:false});
    }
    let newFinalUser=undefined;
    // check on the photo now:
    if(flagOfUpdatePhoto&&!req.query.photoOptions)
    {
        if(user.profilePicture.public_id)
        {
            // we will make the updet on the photo:
            if(req.files.length>0&&req.files)
            {
                if(req.files.length>1)
                {
                    return next(new Error("you only must upload onr profile picture"));
                }
                let objectProfilePicture={};
                const uplaodFILEnOW=await cloudinary.uploader.upload(req.files[0].path,{public_id:user.profilePicture.public_id});
                objectProfilePicture.public_id=uplaodFILEnOW.public_id;
                objectProfilePicture.secure_url=uplaodFILEnOW.secure_url;
                newFinalUser=await userModel.findOneAndUpdate({_id},{profilePicture:objectProfilePicture},{new:true});
            }
        }
        else
        {
            // we will add the photo:
            if(req.files.length>0)
            {
                if(req.files.length>1)
                {
                    return next(new Error("you only must upload one photo for your profile picture"));
                }
                const objectPhotoNow={};
                const uploadingFIleFormMe=await cloudinary.uploader.upload(req.files[0].path,{folder:`/uploads/teachingOnlineCenter/users/${user.userName}/profilePicture/`});
                objectPhotoNow.secure_url=uploadingFIleFormMe.secure_url;
                objectPhotoNow.public_id=uploadingFIleFormMe.public_id;
                newFinalUser=await userModel.findOneAndUpdate({_id},{profilePicture:objectPhotoNow},{new:true});
            }
        }
    }
    if(newFinalUser)
        {
            return res.json({success:true,message:"the user data is updated sucessfully",user:newFinalUser});
        }
        else
        {
            return res.json({success:true,message:"the user data is updated sucessfully",user:newUser});
        }
    }
    catch(err)
    {
        return next(err);
    }
}
// delete account:
export const deleteAccount=async (req,res,next)=>
{
    try
    {
        // et the id of the user:
        const {_id}=req.data;
        // egt the user of the delete:
        await userModel.deleteOne({_id});
        // delete all the token of user:
        await userTokenModel.deleteMany({user:_id});
        // retur the response:
        return res.json({
            success:true,
            message:"the account is deleted successfully",
        })
    }
    catch(err)
    {
        return next(err);
    }
}
// logout:

// get profile:
export const getUserProfile=async (req,res,next)=>
{
    try
    {
        // get the user all:
        const userData=await userModel.findOne({_id:req.data._id}).populate([{path:"cart"},{path:"likes"}]);

        return res.json({
            success:true,
            userData:userData,
            numberLikes:userData.likes.length,
            cartNumbers:userData.cart.length,
        })
    }
    catch(err)
    {
        return next(err);
    }
}
// logout:
export const logOut=async (req,res,next)=>
{
    try
    {
        // get the id of the user:
        const {_id}=req.data;
        console.log(_id);
        const {token}=req.headers;
        console.log(token);
        const getToken=await userTokenModel.findOneAndUpdate({user:_id,userToken:token.split("__")[1]},{isValid:false},{new:true});
console.log(getToken);
        // return the response:
        return res.json({
            success:true,
            message:"logged Out sucessfully",
        })
    }
    catch(err)
    {
        return next(err);
    }
}
// get user cart:
export const getUserCart=async (req,res,next)=>
{
    try
    {
        // egt the oid of the user:
        const {_id}=req.data;
        // egt the user cart now:
        const user=await userModel.findOne({_id}).select("cart").populate([{path:"cart"}]);
        // retur tyhe resposne:
        return res.json({
            success:true,
            userCart:user,
            cartNumbers:user.cart.length,
        });
    }
    catch(err)
    {
        return next(err);
    }
}
// add or delete from the cart:
export const handleCart=async (req,res,next)=>
{
    try
    {
        // get the id of the user:
        const {_id}=req.data;
        // get the id of the course in the cart:
        const {courseId}=req.params;
        // check on the course if it exist or not:
        const course=await courseModel.findOne({_id:courseId});
        if(!course)
        {
            return next(new Error("the course is not exists check the id or it may deleted"));
        }
        // chekc on it:
        const user=await userModel.findOne({_id,cart:{$in:courseId}});
        let newUser="";
        if(user)
        {
            // the cousre is exists and delete it:
            newUser=await userModel.findOneAndUpdate({_id,cart:{$in:courseId}},{$pull:{cart:courseId}},{$new:true}).populate([{path:"likes"},{path:"cart"}]);
            // return  the response:
            return res.json({success:true,user:newUser,numberCart:newUser.cart.length,numberLikes:newUser.likes.length,message:"the cousre is removed from your cart"});
        }
        else
        {
            // the course is not exists add it:
            newUser=await userModel.findOneAndUpdate({_id,cart:{$nin:[courseId]}},{$push:{cart:courseId}}).populate([{path:"likes"},{path:"cart"}]);
            // return the resoinse:
            return res.json({
                success:true,
                message:"the course is added successfully to the cart",
                user:newUser,
                numberCart:newUser.cart.length,
                numberLikes:newUser.likes.length,
            });
        }
    }
    catch(err)
    {
        return next(err);
    }
}
// get all the likes:
export const getLikesCourses=async (req,res,next)=>
{
    try
    {
        // egt the id of the iser:
        const user=await userModel.findOne({_id:req.data._id}).populate([{path:"likes"},{path:"cart"}]);
        // retur the resposne:
        return res.json({success:true,likes:user.likes,numberLikes:user.likes.length});
    }
    catch(err)
    {
        return next(err);
    }
}
// add or remove from the cart:
export const handleLikes = async (req, res, next) => {
    try {
        // get the course id:
        const { courseId } = req.params;
        
        // Check if the course exists
        const course = await courseModel.findById(courseId);
        if (!course) {
            return next(new Error("The course does not exist. Please check the ID or it may have been deleted."));
        }

        // Check if the course is already liked or not
        const userHasLiked = await userModel.exists({ _id: req.data._id, likes: courseId });

        let updatedUser;
        if (userHasLiked) {
            // If the course is liked, remove it from likes
            updatedUser = await userModel.findByIdAndUpdate(
                req.data._id, 
                { $pull: { likes: courseId } }, 
                { new: true }
            ).populate([{ path: "cart" }, { path: "likes" }]);

            return res.json({
                success: true,
                message: "The course has been removed from your likes list.",
                numberLikes: updatedUser.likes.length,
                user: updatedUser
            });
        } else {
            // If the course is not liked, add it to likes
            updatedUser = await userModel.findByIdAndUpdate(
                req.data._id, 
                { $push: { likes: courseId } }, 
                { new: true }
            ).populate([{ path: "cart" }, { path: "likes" }]);

            return res.json({
                success: true,
                message: "The course has been added to your likes list successfully.",
                numberLikes: updatedUser.likes.length,
                user: updatedUser
            });
        }
    } catch (err) {
        return next(err);
    }
};
// handle likes fot he first time or who is login now:
export const handleLikesLogNow=async (req,res,next)=>
    {
        try
        {
            // get the id of the user:
            const {_id}=req.data;
            // get the id's of courses:
            const userNow=await userModel.findOne({_id});
            let {cousresIds}=req.body;
            cousresIds=new Set(cousresIds);
            cousresIds=Array.from(cousresIds);
            console.log(cousresIds);
            if(!userNow)
            {
                return next(new Error("the user is not exist check the id and try again"));
            }
            // check on the length of the courses id's:
            if(cousresIds.length<=0)
            {
                return res.json({
                    success:true,
                    message:"the cousres is handled successfully",
                    user:userNow,
                    numberInLikes:userNow.likes.length,
                });
            }
            // check on the courses fro all courses if it exist or not:
            let flagOfExistence=true;
            for(let i=0;i<cousresIds.length;i++)
            {
                const course=await courseModel.findOne({_id:cousresIds[i]});
                if(!course)
                {
                    flagOfExistence=false;
                    break;
                }
            }
            if(!flagOfExistence)
            {
                return next(new Error("check the id's of the courses you are added"));
            }
            // mke the code and check:
            const {likes}=userNow;
            let getItNew=[...likes];
            cousresIds.forEach((ele)=>
            {
                if(likes.includes(ele))
                {
                    console.log("it's already exists");
                }
                else
                {
                    // add it to the arrau:
                    getItNew.push(ele);
                }
            });
            // make th equery:
            const getNewUser=await userModel.findOneAndUpdate({_id},{likes:getItNew},{new:true});
            // returtn the resposne:
            return res.json({success:true,message:"the courses is added sucessfully to the likes lists",user:getNewUser, numberInLikes:getNewUser.likes.length});
        }
        catch(err)
        {
            return next(err);
        }
    }
// handel the carts fro the new login user:
export const handleNewUserCart=async (req,res,next)=>
{
    try
    {
        const {_id}=req.data;
        // get the cart also:
        const user=await userModel.findOne({_id});
        if(!user)
        {
            return next(new Error("the user is not exists now"));
        }
        // get the courses id's:
        let {cousresIds}=req.body;
        cousresIds=new Set(cousresIds);
            cousresIds=Array.from(cousresIds);
            console.log(cousresIds);
        // cehck on the length:
        if(cousresIds.length<=0)
        {
            return res.json({success:true,message:"the courses is added successfully to the user cart",user:user,numberCart:user.likes.length});
        }
        // hcke on the existence if the of the id's of courses:
        let flagExists=true;
        for(let i=0;i<cousresIds.length;i++)
        {
            const course=await courseModel.findOne({_id:cousresIds[i]});
            if(!course)
            {
                flagExists=false;
                break;
            }
        }
        if(!flagExists)
        {
            return next(new Error("check the course id's first"));
        }
        // get the cart only:
        const {cart}=user;
        let cartUpdated=[...cart];
        cousresIds.forEach((ele)=>
        {
            if(cart.includes(ele))
            {
                console.log("we will not add it");
            }
            else
            {
                cartUpdated.push(ele);
            }
        });
        // maek the query:
        const newUserGet=await userModel.findOneAndUpdate({_id},{cart:cartUpdated},{new:true}).populate([{path:"likes"},{path:"cart"}]);
        // retur the response:
        return res.json({success:true,message:"the courses is added successfully to the user cart",user:newUserGet,numberCart:newUserGet.cart.length});
    }
    catch(err)
    {
        return next(err);
    }
} 
// get my courses i can watch:
export const getMyCoursesICanWatch=async (req,res,next)=>
{
    try
    {
        // get the id of the user:
        const {_id}=req.data;
        const getCourses=await participntsModel.find({user:_id}).populate([{path:"user"},{path:"course"}]).sort("-createdAt");
        return res.json({success:true,coursesLists:getCourses,listsNumber:getCourses.length});
    }
    catch(err)
    {
        return next(err);
    }
}
export const getInsctructors=async (req,res,next)=>
{
    try
    {
        // egt the isntrutrs data:
        const isntcrutors=await employeeModel.find({role:"instructor"}).sort("name");
        // retur the response:
        return res.json({success:true,isntcrutors});
    }
    catch(err)
    {
        return next(err);
    }
}
export const getCoursesWithPayState = async (req, res, next) => {
    try {
        // Get the user ID
        const { _id } = req.data;
        const data = req.query;

        // Handle case when no filters are provided
        if (Object.keys(data).length <= 0) {
            // Get courses the user has bought
            const getUserCourses = await participntsModel.find({ user: _id })
                .populate([{ path: "course", populate: [{ path: "instructor" }] }]);

            // Get the user's requested courses
            const subscribersCourses = await subscribersModel.find({ subscribeId: _id })
                .populate([{ path: "courseId" }]);

            let idsCart = [];
            if (subscribersCourses.length > 0) {
                subscribersCourses.forEach((ele) => {
                    if (ele.courseId) {
                        const { _id } = ele.courseId;
                        idsCart.push(_id.toString());
                    }
                });
            }

            // Collect the IDs of courses already bought
            let idsOfCoursesBuyed = [];
            if (getUserCourses.length > 0) {
                getUserCourses.forEach((ele) => {
                    if (ele.course) {
                        const { _id } = ele.course;
                        idsOfCoursesBuyed.push(_id.toString());
                    }
                });
            }

            // Get all available courses
            const courses = await courseModel.find()
                .populate([{ path: "instructor" }, { path: "category" }])
                .sort("courseName");

            // Add state for each course
            const stateArray = courses.map((ele) => {
                if (idsOfCoursesBuyed.includes(ele._id.toString())) {
                    return "buyed";
                } else if (idsCart.includes(ele._id.toString()) && !idsOfCoursesBuyed.includes(ele._id.toString())) {
                    return "you make request to buy this course contact with the owner of this course";
                } else {
                    return "not buyed";
                }
            });

            // Return the response
            return res.json({ success: true, courses, stateArray });
        }

        // Check if the filter object has valid values
        let flag = false;
        const newSet = new Map(Object.entries(data));
        newSet.forEach((value) => {
            if (value) {
                flag = true;
            }
        });

        if (!flag) {
            // Handle as normal when no valid filters are provided (reusing above logic)
            // [The same logic above can be repeated here if needed]
            return res.json({ success: true, courses: [], stateArray: [] });
        } else {
            // Handle case when filters are provided
            const coursesThatAlreadyBuy = await participntsModel.find({ user: _id })
                .populate([{ path: "course" }]);

            // Get IDs of courses already bought
            let idsOfWhatYouBuyAlready = [];
            if (coursesThatAlreadyBuy.length > 0) {
                coursesThatAlreadyBuy.forEach((ele) => {
                    if (ele.course) {
                        const { _id } = ele.course;
                        idsOfWhatYouBuyAlready.push(_id.toString());
                    }
                });
            }

            // Get IDs of courses requested but not paid
            const coursesYouMakeRequestOnlyOnIt = await subscribersModel.find({ subscribeId: _id, state: { $ne: "payed" } })
                .populate([{ path: "courseId" }]);

            let idsOfWhatYouMakeRequestsOnly = [];
            if (coursesYouMakeRequestOnlyOnIt.length > 0) {
                coursesYouMakeRequestOnlyOnIt.forEach((ele) => {
                    if (ele.courseId) {
                        const { _id } = ele.courseId;
                        idsOfWhatYouMakeRequestsOnly.push(_id.toString());
                    }
                });
            }

            // Build filter options
            let objectFilter = {};
            if (data.courseId) objectFilter._id = data.courseId;
            if (data.coursePrice) objectFilter.coursePrice = data.coursePrice;
            if (data.category) objectFilter.category = data.category;
            if (data.subCategory) objectFilter['subCategory.subCategoryId'] = data.subCategory;
            if (data.courseName) objectFilter.courseName = { $regex: data.courseName, $options: "i" };
            if (data.courseHours) objectFilter.courseHours = { $lte: data.courseHours };
            if (data.teachedBy) objectFilter.teachedBy = { $regex: data.teachedBy, $options: "i" };

            // Query courses based on filters
            let coursesGet = await courseModel.find(objectFilter)
                .populate([{ path: "category" }, { path: "instructor" }])
                .sort("courseName");

            let resultsFinal = [...coursesGet];
            let flagOfIns = false;
            let getArrayOFFinal = [];
            const stateArray = [];

            if (data.insName) {
                flagOfIns = true;
                getArrayOFFinal = resultsFinal.filter(ele => ele.instructor.name.includes(data.insName));
            }

            const processCourses = (array) => {
                array.forEach((ele) => {
                    if (idsOfWhatYouMakeRequestsOnly.includes(ele._id.toString())) {
                        stateArray.push("you make request to buy this course contact with the owner of this course");
                    } else if (idsOfWhatYouBuyAlready.includes(ele._id.toString())) {
                        stateArray.push("buyed");
                    } else {
                        stateArray.push("not buyed");
                    }
                });
                return res.json({ success: true, courses: array, stateArray });
            };

            return flagOfIns ? processCourses(getArrayOFFinal) : processCourses(resultsFinal);
        }
    } catch (err) {
        return next(err);
    }
};

// get the cideos of the course for the user or for the student:
export const watchMediaOfCourse=async (req,res,next)=>
{
    try
    {
        // egt the id of the user:
        const {_id}=req.data;
        // chekc on the course:
        const {courseId}=req.params;
        const course=await courseModel.findOne({_id:courseId}).populate([{path:"instructor"}]);
        if(!course)
        {
            return next(new Error("the course is not exists or it may be deleted"));
        }
        // chekc i fthe user has payed this course or not:
        const checkUserCourse=await participntsModel.findOne({user:_id,course:courseId}).populate([{path:"user"},{path:"course",populate:[{path:"instructor"}]}]);
        if(!checkUserCourse)
        {
            return next(new Error(`the user not subscribe on this course yet or his requets not evaluated by the owner of the course yet if you want to communicate with the instuctor:${course.instructor.phone}`));
        }
        // now returnt he response:
        return res.json({success:true,message:"the user can access the data of course now"});
    }
    catch(err)
    {
        return next(err);
    }
}
//////////////////////////////////////////////////
