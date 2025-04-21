import { Router } from "express";
import * as validatin from '../../validation/validation.js';
import * as userController from './users.controller.js';
import * as userSchema from './users.schema.js';
import uploadingFileRequets from "../../utils/uploadingFiles.js";
import authUser from "../../auth/users.auth.js";
import subscribersRoutes from "../subscribers/subScribers.routes.js";
import courseRouter from "../courses/courses.routes.js";
import testRouter from "../test/test.routes.js";
const userRouter=Router({mergeParams:true});
// go to the test router:
userRouter.use("/tests",testRouter);
// we will ake the user routers:
//go tot he routes of subscribers:
userRouter.use("/subscriber",subscribersRoutes);
userRouter.use("/courses",courseRouter);
// sign up
userRouter.post("/signUpForusers",uploadingFileRequets().any(),validatin.bodyValidation(userSchema.signUpSchema),userController.signUpController);
// activte email:
userRouter.get("/activateEmail/:userEmail",validatin.paramsValidation(userSchema.activeteEmailSchema),userController.activateEMailForUsers);
// login:
userRouter.post("/login",validatin.bodyValidation(userSchema.loginSchema),userController.logIn);
// first stage:
userRouter.patch("/forgetPassFirstStage",validatin.bodyValidation(userSchema.forgetPassFirstStageSchema),userController.foregtPassFirstStage);
// egt the code for satge two:
userRouter.patch("/makePassForForgetPass",validatin.bodyValidation(userSchema.getCodeFOrStageTwoSchema),userController.getForgetCodeSatgeTwo);
// update all the dat aof the user:
userRouter.patch("/updateUserData",authUser,uploadingFileRequets().any(),validatin.bodyValidation(userSchema.updateUserSchema),validatin.queryValidation(userSchema.updateUserDataOptions),userController.updateUserData);
// dleet the suer accouent:
userRouter.delete("/deleteAccount",authUser,userController.deleteAccount);
// et the user profile:(that need a checnge and modification to return the cart with the user and loves with the courses)
userRouter.get("/getProfileData",authUser,userController.getUserProfile);
// logOut:
userRouter.get("/logOutUser",authUser,userController.logOut);
// get all on the cargt of sp user:
userRouter.get("/getMyCart",authUser,userController.getUserCart)
// add or delete or  from  the user cart:
userRouter.patch("/updateUserCart/:courseId",authUser,validatin.paramsValidation(userSchema.checkCourse),userController.handleCart)
// egt all waht the user likes:
userRouter.get("/getLikesCourses",authUser,userController.getLikesCourses)
// add or delet from likes courses:
userRouter.get("/handleLikes/:courseId",authUser,validatin.paramsValidation(userSchema.checkCourse),userController.handleLikes);
// make sp for likes:
userRouter.patch("/LikesForWhoJoinNow",authUser,validatin.bodyValidation(userSchema.handleLikesFOrNowWhoIsLogIn),userController.handleLikesLogNow);
// handle the new user of cart:
userRouter.patch("/handleUsersLogInNowForChart",authUser,validatin.bodyValidation(userSchema.handleLikesFOrNowWhoIsLogIn),userController.handleNewUserCart);
// get my courses lists that i can watch:
userRouter.get("/getMyListsOfCoursesICanWatch",authUser,userController.getMyCoursesICanWatch);
// get all isntcructors in the academy:
userRouter.get("/getAllInstrcuctors",userController.getInsctructors)
// watch any video fro  the course you are partcipnts to:
// get the courses without the courses you already buy:
userRouter.get("/getCoursesWithoutYouBuyWithPayState",authUser,validatin.queryValidation(userSchema.getCoursesStateWithFIlter),userController.getCoursesWithPayState);
// watch the videos aand media of the course:
userRouter.get("/watchCourseMedia/:courseId",authUser,validatin.paramsValidation(userSchema.checkCourse),userController.watchMediaOfCourse);
// solev the test and choose any test from the course to solve now:
export default userRouter;