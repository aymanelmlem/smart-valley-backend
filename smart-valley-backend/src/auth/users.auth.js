import userTokenModel from "../../db/models/usersToken/user.token.model.js";

async function authUser(req,res,next)
{
try
{
const {token}=req.headers;
if(!token)
{
    return next(new Error("the token is not send please send the token in headers"));
}
// check now on the bareer key:
if(!token.startsWith(`${process.env.SECRET_KEY}`))
{
    return next(new Error("the bareer key is not exists"));
}
// split the token and get the okne only:
const tokenOnly=token.split("__")[1];
// chec on the token if it exists:
const getToken=await userTokenModel.findOne({userToken:tokenOnly}).populate([{path:"user"}]);
if(!getToken)
{
    return next(new Error("the token is not exists"));
}
// check on the activation:
const {user}=getToken;
if(Object.keys(user).length<1)
{
return next(new Error("the user account is not exists or the account may deleted"));
}
if(!getToken.user.isActivated)
{
    return next(new Error("the user is not activate his Account yet activate your account first then login"));
}
// check on th validdity of the token:
if(!getToken.isValid)
{
    return next(new Error("the token become not valid to use"));
}
// make an field on the req object:
req.data=user;
// go to the next controller:
return next();
}
catch(err)
{
    return next(err);
}
}
export default authUser;