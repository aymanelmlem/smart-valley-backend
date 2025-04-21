import joi from 'joi';
function checkOnCourseUpdateSchema(schema,value)
{
  return (req,res,next)=>
  {
    try
    {
      const result=schema.validate(value);
      if(result.error)
      {
        console.log("there is an errror",result.error)
        let arrayError=[];
        result.error.details.forEach((ele) => {
            arrayError.push(ele);
        });
        return next(new Error(`there is an error in the validation ${arrayError}`));
      }
      else
      {
        return true;
      }
    }
    catch(err)
    {
        return next();
    }
  }
}
export default checkOnCourseUpdateSchema;