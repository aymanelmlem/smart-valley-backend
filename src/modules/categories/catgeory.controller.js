import { nanoid } from "nanoid";
import cloudinary from "../../utils/cloudinary.config.js";
import categoryModel from "../../../db/models/catgeory/catagory.model.js";
import checkOnCourseUpdateSchema from "../../utils/checkOnCourseUpdate.js";
import { addingSUbCategotySchema, deleteSubCategorySchema, updateSubCategorySchema } from "./catgeory.schema.js";
import courseModel from "../../../db/models/courses/courses.model.js";
import employeeModel from "../../../db/models/employees/meployees.model.js";

export const addCatgeoryController=async (req,res,next)=>
{
    try
    {
      
        // get the id of the user:
        const {_id}=req.data;
        // egt the data:
        const data=req.body;
        // chekc on the file of it uploaded or not:
        if(req.files&&req.files.length>0)
        {
              // check thta if the uoads bigger than 1:
              if(req.files.length>1)
               {
                return next(new Error("you must upload one photo only"));
               }
             // make the things of the things:
            const uplaodingFIle=await cloudinary.uploader.upload(req.files[0].path,{folder:`/uploads/teachingOnlineCenter/categories/`});
            const objectPhoto={};
            objectPhoto.public_id=uplaodingFIle.public_id;
            objectPhoto.secure_url=uplaodingFIle.secure_url;
            data.categoryPicture=objectPhoto;
        }
        // check on the subCtgeory:
        let  {subCategory}=data;
        subCategory=JSON.parse(subCategory);
        if(subCategory&&subCategory.length>0)
        {
            let arraySUb=[];
            // ake the code:
            subCategory.forEach((ele)=>
            {
                const objectSub={};
                objectSub.subCategoryId=nanoid(6);
                objectSub.subCategoryName=ele;
                arraySUb.push(objectSub);
            });
            data.subCategory=arraySUb;
        }
        data.addedBy=_id;
        // add the document of the catgeory to the collection or the categroy model:
        await categoryModel.create(data);
        const allCategory=await categoryModel.find().populate([{path:"addedBy"}]);
        // then send the response:
        return res.json({success:true,message:"the category is added sucessfully",categories:allCategory});
    }
    catch(err)
    {
        return next(err);
    }
}
// update the category and the subCatgeory:
export const updateCategorys=async (req,res,next)=>
{
    try
    {
        // eg the data of the catgeory:
        const {categId}=req.params;
        const catge=await categoryModel.findOne({_id:categId});
        if(!catge)
        {
            return next(new Error("the catgeory is not exists chec the id"));
        }
       // egt the data of the update:
       const dataUpdate=req.body;
       // check if the files are uploaded:
       if(req.files&&req.files.length>0)
       {
        // maek the add:
        const {categoryPicture}=catge;
        if(categoryPicture)
        {
            if(req.files.length>1)
            {
                return next(new Error("yoiu must only upload one file"));
            }
            let objectPhoto={};
            if(catge.categoryPicture.public_id&&catge.categoryPicture.secure_url)
            {
                   // there is an secure url and updating:
                   const uplaodingFIle=await cloudinary.uploader.upload(req.files[0].path,{public_id:categoryPicture.public_id});
                   if(!uplaodingFIle)
                   {
                    return next(new Error("the file is not uploaded"));
                   }
                   objectPhoto.secure_url=uplaodingFIle.secure_url;
                   objectPhoto.public_id=uplaodingFIle.public_id;
                   dataUpdate.categoryPicture=objectPhoto;
                }
                else if(catge.categoryPicture.secure_url&&!catge.categoryPicture.public_id)
                {
                  // make the adding picture:
                  const uploaidngFIle=await cloudinary.uploader.upload(req.files[0].path,{folder:"/uploads/teachingOnlineCenter/categories/"});
                  if(!uploaidngFIle)
                  {
                    return next(new Error("the file is not uploaded"));
                  }
                  objectPhoto.public_id=uploaidngFIle.public_id;
                  objectPhoto.secure_url=uploaidngFIle.secure_url;
                  dataUpdate.categoryPicture=objectPhoto;
                }
        }
        else
        {
            return next(new Error("there is an error im the profile picture in from the db"));
        }
       
       }
       //check on  the query and if it exists check and delete the photo achekc ont he query:
       const {profilePictureSelect}=req.query;
       if(profilePictureSelect)
       { 
        dataUpdate.categoryPicture={secure_url:"https://th.bing.com/th/id/R.9d147188b35e44ca5022800226b0b2c1?rik=opzTAxSBNc7pjQ&riu=http%3a%2f%2fwww.sweetcaptcha.com%2fwp-content%2fuploads%2f2018%2f11%2fonline_certification_courses.jpeg&ehk=LPfNr4yNFgb07ggBWdWnHU4xj7Z9hDqIzLMu3zZsfMY%3d&risl=&pid=ImgRaw&r=0"};
       }
       // check on the subcategory and make the code all the things about it:
       let {subCategory}=dataUpdate;
       if(subCategory)
       {
        subCategory=JSON.parse(subCategory);
       }
       if(subCategory&&subCategory.length>0)
       {
         const {subcatgeorySelect}=req.query;
         if(!subcatgeorySelect)
         {
            return next(new Error("you must send the option of subcatgeory when you want to update it in the query"));
         }
         // chekc on the oprions:
         if(subcatgeorySelect=="add")
         {
           // make the code of adding:
           const value=checkOnCourseUpdateSchema(addingSUbCategotySchema,subCategory);
           const resy=value(req,res,next);
           if(!resy)
           {
            return next(new Error("the validation of the subcatgeory have an error"));
           }
           let arraySub=[...catge.subCategory];
           // make the code:
           for(let i=0;i<subCategory.length;i++)
           {
             let  object={};
             object.subCategoryId=nanoid(6);
             object.subCategoryName=subCategory[i];
             arraySub.push(object);
           }
           dataUpdate.subCategory=arraySub;
         }
         else if(subcatgeorySelect=="update")
         {
          // check on the updating first: and make the logic:
          const val=checkOnCourseUpdateSchema(updateSubCategorySchema,subCategory);
          const resy=val(req,res,next);
          if(!resy)
          {
            return next(new Error("the validation of the subcatgeory is have an error"));
          }
          // make the loop and check:
          let checkErrror=false;
          for(let i=0;i<subCategory.length;i++)
          {
             const checkSub=await categoryModel.findOneAndUpdate({_id:categId,'subCategory.subCategoryId':subCategory[i].subCategoryId},{$set:{'subCategory.$.subCategoryName':subCategory[i].subCategoryName}});
             if(!checkSub)
             {
                checkErrror=true;
             }
          }
          if(checkErrror)
          {
            return next(new Error("the subCategory id is not true check it and not exists"));
          }
          delete dataUpdate.subCategory;
         }
         else if(subcatgeorySelect=="delete")
        {
            // check on the subCatgeory first and then do the other:
            const val=checkOnCourseUpdateSchema(deleteSubCategorySchema,subCategory);
            const resy=val(req,res,next);
            if(!resy)
            {
                return next(new Error("there is an error on the validatio of the subCatgeory"));
            }
            let flagErr=false;
            // make the loop and do it:
            for(let i=0;i<subCategory.length;i++)
            {
                const sub = await categoryModel.findOneAndUpdate({'subCategory.subCategoryId':subCategory[i]},{$pull:{subCategory:{subCategoryId:subCategory[i]}}});
                if(!sub)
                {
                    flagErr=true;
                }
            }
            if(flagErr)
            {
                return next(new Error("the id of the subCateg is not exists check it"));
            }
            // delete this field:
            delete dataUpdate.subCategory;
        }
        else
        {
           return next(new Error("the value of the options of subcategory is nit true"));
        }
       }
       // make the update:
       const updateCateg=await categoryModel.findOneAndUpdate({_id:categId},dataUpdate,{new:true});
       // returt the resposne:
       return res.json({success:true,message:"the category is updated sucessfully",category:updateCateg});
    }
    catch(err)
    {
        return next(err);
    }
}
// delete the category:
export const deleteCategory=async (req,res,next)=>
{
    try
    {
        // get the id of the category:
        const {categId}=req.params;
        const checkCateg=await categoryModel.findOne({_id:categId});
        if(!checkCateg)
        {
            return next(new Error("chekc the categoryId it not exists or it can be deleted"));
        }
        await checkCateg.deleteOne();
        // egt all the categories now:
        const allCateg=await categoryModel.find().populate([{path:"addedBy"}]).sort("categoryName");
        // to maake the courses without the catgeory and subCategory also:
        await courseModel.updateMany({category:categId},{category:undefined,subCategory:undefined});
        // returnt he result:
        return res.json({success:true,message:"the category is deleted sucessfully",categories:allCateg});
    }
    catch(err)
    {
        return next(err);
    }
}
// get the categories:
export const getCatgeories=async (req,res,next)=>
{
    try
    {
        // get the filter object:
        const data=req.query;
        let results=[];
        let sort="";
        const getSorted=req.body;
        if(getSorted.craatedAt&&getSorted.categoryName)
        {
          sort="categoryName -categoryName";
        }
        else if(getSorted.createdAt)
        {
            sort="-createdAt";
        }
        else if(getSorted.categoryName)
        {
            sort="categoryName";
        }
        else
        {
          sort="-createdAt";
        }
        // check on this query and do the waht is required:
        if(Object.keys(data).length>0)
        { 
           // check if the one of the property have value:
           const newMap=new Map(Object.entries(data));
           let flag=false;
           newMap.forEach((value,key)=>
        {
            if(value)
            {
              flag=true;
            }
        });
        if(!flag)
        {
            // make the dafualt and check the sort:
            results=await categoryModel.find().populate([{path:"addedBy"},{path:"courses",populate:[{path:"category"}]}]).sort(sort);
            // reyurn the results:
            return res.json({success:true,categories:results});
        }
        }
        // cehck on the filter fields and create the filter object:
        let objectFilter={};
        if(data.categoryName)
            objectFilter.categoryName={$regex:data.categoryName,$options:"i"};
        if(data.addedBy)
            objectFilter.addedBy=data.addedBy;
        if(data.subCategory)
            objectFilter.subCategory={$elemMatch:{subCategoryName:{$regex:data.subCategory,$options:"i"}}};
        if(data.catgeoryId)
            objectFilter._id=data.catgeoryId;
        if(Object.keys(objectFilter).length>0)
        {
           results=await categoryModel.find(objectFilter).populate([{path:"addedBy"},{path:"courses",populate:[{path:"category"}]}]).sort(sort);
           return res.json({success:true,categories:results});
        }
        else
        {
               // make the dafualt and check the sort:
               results=await categoryModel.find().populate([{path:"addedBy"},{path:"courses",populate:[{path:"category"}]}]).sort(sort);
               // reyurn the results:
               return res.json({success:true,categories:results});
        }
    }
    catch(err)
    {
        return next(err);
    }
}
// subCategory:
export const getSubCatgeories=async (req,res,next)=>
{
try
{
    // get the data of the  suvbCatgeory:
    const data=req.query;
    let objectFilter={};
    let results=[];
    let flag=false;
    let subCategoriesCheck=[];
    if(Object.keys(data).length==0)
    {
         // make the dafualt:
         results=await categoryModel.find().select("_id subCategory categoryName");
         return res.json({success:true,results});
    }
    if(Object.keys(data).length>0)
    {
       let mapObject=new Map(Object.entries(data));
       mapObject.forEach((value,key)=>{
        if(value)
        {
            flag=true;
        }
       });
       if(!flag)
       {
        // make the dafualt:
        results=await categoryModel.find().select("_id subCategory categoryName");
        return res.json({success:true,results});
       }
    }
    // make the onject filter:
    if(data.categoryName)
        objectFilter.categoryName={$regex:data.categoryName,$options:"i"};
    if(req.query.categoryId)
        objectFilter._id=data.categoryId;
    if(Object.keys(objectFilter).length>0||req.query.subCategoryName)
    {
       results=await categoryModel.find(objectFilter).select("_id subCategory categoryName");
       if(req.query.subCategoryName)
       {
        // check on the result to get all the subCategories only loop on the array and check:
        results.forEach((ele,index)=>
        {
            const {subCategory}=ele;
            subCategory.forEach((ele2,index2)=>
            {
                if(ele2.subCategoryName.includes(req.query.subCategoryName)||ele2.subCategoryName.startsWith(req.query.subCategoryName))
                {
                    subCategoriesCheck.push(ele2);
                }
            })
        });
       }
       if(subCategoriesCheck.length>0||req.query.subCategoryName)
       {
        return res.json({success:true,results:subCategoriesCheck});
       }
       else
       {
        return res.json({success:true,results});
       }
    }
    else
    {
 // make the dafualt:
 results=await categoryModel.find().select("_id subCategory categoryName");
 return res.json({success:true,results});
    }
}
catch(err)
{
    return next(err);
}
}
// get the courses by all filters and all:
export const getCourses=async (req,res,next)=>
{
    try
    {
        // get the filters options:
        const data=req.query;
        let results=await courseModel.find().populate([{path:"instructor"},{path:'category'}]).sort("-createdAt courseName");
        // check if the filter objects is not have any thing:
        if(Object.keys(data).length==0)
        {
            // get the dafault:
            results=await courseModel.find().populate([{path:"instructor"},{path:'category'}]).sort("-createdAt courseName");
            // retur the resposne:
            return res.json({success:true,courses:results,numberOfCourses:results.length});
        }
        // check if object is with empty values:
        const getMap=new Map(Object.entries(data));
        let flag=false;
        getMap.forEach((value,key)=>
        {
            if(value)
            {
                flag=true;
            }
        });
        if(!flag)
        {
            // send the dafulat also:
            results=await courseModel.find().populate([{path:"instructor"},{path:'category'}]).sort("-createdAt courseName");
            // retur the resposne:
            return res.json({success:true,courses:results,numberOfCourses:results.length});
        }
        // make the object filter:
        let objectFilter={};
        if(data.courseName)
        {
            objectFilter.courseName={$regex:data.courseName,$options:"i"};
        }
        if(data.courseHours)
            objectFilter.courseHours=data.courseHours;
        if(data.coursePrice)
            objectFilter.coursePrice=data.coursePrice;
        if(data.teachedBy)
            objectFilter.teachedBy=data.teachedBy;
        if(data.category)
            objectFilter.category=data.category;
        if(data.id)
            objectFilter._id=data.id;
        // check on the oject filter for this:
        if(Object.keys(objectFilter).length>0)
        {
            // mke the filter and not send the response now:
            results=await courseModel.find(objectFilter).populate([{path:"instructor"},{path:'category'}]).sort("-createdAt courseName");
        }
        // check also on the instrcutro name:
        if(data.instructor)
        {
            // get the data of the isntrcuctors because you send the name of the insctructors:
            let arrayEmpty=[];
            results.forEach((ele)=>
            {
                const {instructor}=ele;
                if(instructor.name.includes(data.instructor))
                {
                     arrayEmpty.push(ele);
                }
            });
            results=[...arrayEmpty];
        }
        // check also  on the subCategpry field:
        if(data.subCategory)
        {
            // chekc the subCtgeory and then send the results:
            let newArray=[];
            results.forEach((ele)=>
            {
                if(ele.subCategory.subCategoryId==data.subCategory)
                {
                    newArray.push(ele);
                }
            });
            results=[...newArray];
        }
        //send the response:
        return res.json({success:true,courses:results,numberOfCourses:results.length});
    }
    catch(err)
    {
        return next(err);
    }
}
// get all instrcuctros with filetr:
export const getInstrcuctors=async (req,res,next)=>
{
try
{
// get the dta from the query:
const data=req.query;
// get the dafault:
let instrcuctors=[];
instrcuctors=await employeeModel.find({$or:[{role:"instructor"},{role:"superAdmin"}]}).populate([{path:"courses",populate:[{path:"instructor"},{path:"category"}]}]).sort("name");
// chekc  on the data:
if(Object.keys(data).length==0)
{
    instrcuctors=await employeeModel.find({$or:[{role:"instructor"},{role:"superAdmin"}]}).populate([{path:"courses",populate:[{path:"instructor"},{path:"category"}]}]).sort("name");
    return res.json({success:true,instrcuctors,numberInstrcuctors:instrcuctors.length});
}
// check on the keys of the iject if ot have value or not:
let mapObject=new Map(Object.entries(data));
let flagExists=false;
mapObject.forEach((value,key)=>
{
    if(value)
    {
        flagExists=true;
    }
});
if(!flagExists)
{
    instrcuctors=await employeeModel.find().populate([{path:"courses",populate:[{path:"instructor"},{path:"category"}]}]).sort("name");
    return res.json({success:true,instrcuctors,numberInstrcuctors:instrcuctors.length});
}
// make the object filter:
let objectFilter={};
if(data.instructorName)
    objectFilter.name={$regex:data.instructorName,$options:"i"};
if(data.instrcuctorId)
    objectFilter._id=data.instrcuctorId;

instrcuctors=await employeeModel.find({$or:[{role:"instructor"},{role:"superAdmin"}],...objectFilter}).populate([{path:"courses",populate:[{path:"instructor"},{path:"category"}]}]).sort("name");
// return the response:
return res.json({success:true,instrcuctors,numberInstrcuctors:instrcuctors.length});
}
catch(err)
{
    return next(err);
}
}
// get only one course:
export const getOnlyOneCourse=async (req,res,next)=>
{
    try
    {
        // egt the catgeory d:
        const {courseId}=req.params;
        const getCourse=await courseModel.findOne({_id:courseId}).populate([{path:"instructor"},{path:"category"}]);
        if(!getCourse)
        {
            return next(new Error("The cousre isnnot exists check the id or it may be deleted"));
        }
        return res.json({success:true,course:getCourse});
    }
    catch(err)
    {
        return next(err);
    }
}
//////////////// 
