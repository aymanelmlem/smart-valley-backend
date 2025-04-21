import mongoose from "mongoose";
async function connectToDb()
{
try
{
return await mongoose.connect(process.env.DB_CONNECTION_URL).then((res)=>console.log("the db is connected sucessfully")).catch(err=>console.log("the db have errro in connection",err));
}
catch(err)
{
    console.log(err);
}
}
export default connectToDb;