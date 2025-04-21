// body validation:
export const bodyValidation=(schema)=>
{
return (req,res,next)=>
{
    try
    {
       const data=req.body;
       const result=schema.validate(data,{abortEarly:false});
       let arrayError=[];
       if(result.error)
       {
          result.error.details.forEach((ele)=>{
            arrayError.push(ele.message);
          });
          return next(new Error(arrayError));
       }
       return next();
    }
    catch(err)
    {
        return next(err);
    }
}
}
// params validtaion:
export const paramsValidation=(schema)=>
{
    return (req,res,next)=>
        {
            try
            {
               const data=req.params;
               const result=schema.validate(data,{abortEarly:false});
               let arrayError=[];
               if(result.error)
               {
                  result.error.details.forEach((ele)=>{
                    arrayError.push(ele.message);
                  });
                  return next(new Error(arrayError));
               }
               return next();
            }
            catch(err)
            {
                return next(err);
            }
        }
}
// query validation:
export const queryValidation=(schema)=>
{
        return (req,res,next)=>
            {
                try
                {
                   const data=req.query;
                   const result=schema.validate(data,{abortEarly:false});
                   let arrayError=[];
                   if(result.error)
                   {
                      result.error.details.forEach((ele)=>{
                        arrayError.push(ele.message);
                      });
                      return next(new Error(arrayError));
                   }
                   return next();
                }
                catch(err)
                {
                    return next(err);
                }
            }
}
//////////////////////