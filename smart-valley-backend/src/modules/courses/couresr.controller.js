import { nanoid } from "nanoid";
import cloudinary from "../../utils/cloudinary.config.js";
import courseModel from "../../../db/models/courses/courses.model.js";
import {addAccessBySchema, checkOnTheWahtWillYouLearnUpdate, updateCccesspibeBySchemaDelete, updateCccesspibeBySchemaUpdate} from './coursers.schema.js';
import checkOnCourseUpdateSchema from "../../utils/checkOnCourseUpdate.js";
import categoryModel from "../../../db/models/catgeory/catagory.model.js";
import sectionModel from "../../../db/models/sections/section.model.js";
import lessonModel from "../../../db/models/lessons/lessons.model.js";
import userModel from "../../../db/models/users/users.model.js";
import subscribersModel from "../../../db/models/subscribers/subscribers.model.js";
import participntsModel from "../../../db/models/participnts/partcipints.model.js";
import employeeModel from "../../../db/models/employees/meployees.model.js";
// add course comtroller:
export const addCourse = async (req, res, next) => {
    try {
      // Get the instructor's ID and name
      const { _id, name } = req.data;
      // Get the course data
      let data = req.body;
      let uploadingPhotoObject = {};
      let objectUrlArray = [];
      let arrayObjectOfObjectives = [];
      let arrayDescribtionContent = [];
  
      // Validate the course price
      if (data.coursePrice) {
        if (data.coursePrice !== "free") {
          const price = parseFloat(data.coursePrice);
          if (isNaN(price) || price <= 0 || price > 100000) {
            return next(new Error("Course price must be between 1 and 100000 or free"));
          }
        }
      }
  
      // Validate the course hours
      const { courseHours } = data;
      if (courseHours) {
        const hours = parseFloat(courseHours);
        if (isNaN(hours) || hours <= 0) {
          return next(new Error("Course hours must be a positive number"));
        }
      }
  
      // Handle uploaded files
      if (req.files && req.files.length > 0) {
        if (req.files.length > 1) {
          return next(new Error("You can only upload one image for the course cover"));
        }
        const uploadingPhoto = await cloudinary.uploader.upload(req.files[0].path, {
          folder: `/uploads/teachingOnlineCenter/employees/${name}/courses/cover/`
        });
        uploadingPhotoObject.public_id = uploadingPhoto.public_id;
        uploadingPhotoObject.secure_url = uploadingPhoto.secure_url;
        data.coursePicture = uploadingPhotoObject;
      }
  
      // Handle accessible by anyone data
      let { accesibleByAnyOne } = data;
      accesibleByAnyOne = JSON.parse(accesibleByAnyOne);
      if (accesibleByAnyOne && (accesibleByAnyOne.videoUrl || accesibleByAnyOne.description)) {
          
          if (accesibleByAnyOne.videoUrl) {
            accesibleByAnyOne.videoUrl.forEach((ele) => {
              const objectUrl = { urlId: nanoid(8), url: ele };
              objectUrlArray.push(objectUrl);
            });
            
          }
          if (accesibleByAnyOne.description) {
            if (accesibleByAnyOne.description.length !== (accesibleByAnyOne.videoUrl ? accesibleByAnyOne.videoUrl.length : 0)) {
              return next(new Error("Validation error: you must provide a description for each video URL"));
            }
            accesibleByAnyOne.description.forEach((ele) => {
              const objectDescribtion = { describtionId: nanoid(8), describtionContent: ele };
              arrayDescribtionContent.push(objectDescribtion);
            });
            data.accesibleByAnyOne=JSON.parse(data.accesibleByAnyOne);
            data.accesibleByAnyOne={videoUrl:objectUrlArray,describtion:arrayDescribtionContent};
          }
        
      }
  
      // Validate what will be learned
      let { whatWillYouLearn } = data;
      whatWillYouLearn = JSON.parse(whatWillYouLearn);
      if (!whatWillYouLearn || whatWillYouLearn.length <= 0) {
        return next(new Error("You must specify the objectives of the course"));
      } else {
        whatWillYouLearn.forEach((ele) => {
          const objectObjective = { id: nanoid(8), objective: ele };
          arrayObjectOfObjectives.push(objectObjective);
        });
        data.whatWillYouLearn = arrayObjectOfObjectives;
      }
  
      // Add the instructor to the course data
      data.instructor = _id;
  
      // Validate the category and sub-category
      const { category, subCategory } = req.body;
      if (subCategory && !category) {
        return next(new Error("If you choose a sub-category, you must also select a main category"));
      }
      if (category) {
        if (!subCategory) {
          return next(new Error("If you provide a main category, you must also provide a sub-category"));
        }
        let categoryGet = await categoryModel.findOne({ _id: category });
        if (!categoryGet) {
          return next(new Error("The category does not exist. You can add it first or it might have been deleted"));
        }
        let flag = false;
        let subCategoryName = "";
        categoryGet.subCategory.forEach((ele) => {
          if (ele.subCategoryId.toString() === subCategory.toString()) {
            flag = true;
            subCategoryName = ele.subCategoryName;
          }
        });
        if (!flag) {
          return next(new Error("This sub-category does not exist in the selected category"));
        }
        data.subCategory = { subCategoryId: subCategory, subCategory: subCategoryName };
      }
  
      // Add the course to the database
      await courseModel.create(data);
  
      // Return success response
      return res.json({ success: true, message: "The course has been added successfully" });
    } catch (err) {
      return next(err);
    }
  };
// update course data:
export const updateSpCourse=async (req,res,next)=>
{
try
{
// egtt he id of the user :
const  {_id,name}=req.data;
// egtt he id of the course:
const {courseId}=req.params;
// check the relationship between the user and between the course:
const course=await courseModel.findOne({_id:courseId});
if(!course)
{
    return next(new Error("the course is not exists check the id it also may be deleted"));
}
if(course.instructor.toString()!=_id.toString())
{
return next(new Error("you not have the authity to update this course because you are not the owner of this"));
}
// check on the inputs fields:
const dataUPdate=req.body;
const flags=req.query;
// check on the photo:
if(req.files&&req.files.length>0)
{
    if(req.files.length>1)
    {
        return next(new Error("you can upload one photo only for the course"));
    }
    else if(req.files.length==1)
    {
        if(course.coursePicture.public_id)
        {
            // update:
            const uploadingPhoto=await cloudinary.uploader.upload(req.files[0].path,{public_id:course.coursePicture.public_id});
            let objectPhoto={};
            objectPhoto.public_id=uploadingPhoto.public_id;
            objectPhoto.secure_url=uploadingPhoto.secure_url;
            data.coursePicture=objectPhoto;
        }
        else
        {
            // add photo:
            const uplaodingPhoto=await cloudinary.uploader.upload(req.files[0].path,{folder:`/uploads/teachingOnlineCenter/employees/${name}/courses/cover/`});
            let objectPhoto={};
            objectPhoto.secure_url=uplaodingPhoto.secure_url;
            objectPhoto.public_id=uplaodingPhoto.public_id;
            data.coursePicture=objectPhoto;
        }
    }
    else
    {
        // check on the photo query:
        const {photoSelection}=flags;
        if(photoSelection=="delete")
        {
          // delett he photo:
          data.coursePicture={secure_url:"https://th.bing.com/th/id/OIP.afNN71LYRc9tIlOvk6EKUwHaE8?w=234&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"};
        }
        else{}
    }
}
// check on the hours:
const {courseHours}=dataUPdate;
if(courseHours)
{
    if(+courseHours!=courseHours||+courseHours==NaN)
    {
        return next(new Error("course hours must be between 1 and 10000 only"));
    }
    if(+courseHours==0)
    {
        return next(new Error("the hours of the course must ne larger than 0"));
    }
}
// check on the price:
const {coursePrice}=dataUPdate;
if(coursePrice)
{
    if(+coursePrice==coursePrice&&+coursePrice!=NaN)
    {
        if(+coursePrice<0)
        {
            return next(new Error("if you want to enter number for the price of the course it must be largar than 0"))
        }
    }
    else if(coursePrice=="free")
    {
        console.log("yes good")
    }   
    else
    {
        return next(new Error("the price of the course must be between 1:10000 or free only"));
    } 
}
// check on the on the ohter:
let {accesibleByAnyOne}=req.body;
if(accesibleByAnyOne&&Object.keys(accesibleByAnyOne).length>0)
{
    
    let query=req.query.accesibleByAnyOne;
    if(!query)
    {
        return next(new Error("you must send the accesibleByAnyOne in the query when you want to make any modification on the accesibleByAnyOne field"));
    }
    else if(query=="update")
    {
        let  flagVideoUpdated=false;
        accesibleByAnyOne=JSON.parse(accesibleByAnyOne);
        if(!course.accesibleByAnyOne)
            {
                return next(new Error("the course not have the field to update it"));
            }
      // make the update algorithm:
      const updateSchemaFunction=checkOnCourseUpdateSchema(updateCccesspibeBySchemaUpdate,accesibleByAnyOne);
      const result=updateSchemaFunction(req,res,next);
      if(result)
      {
       // make the algorithm:
       if((!accesibleByAnyOne.videoUrl||Object.keys(accesibleByAnyOne.videoUrl).length==0)&&(!accesibleByAnyOne.describtion||Object.keys(accesibleByAnyOne.describtion).length==0))
       {
        return next(new Error("the accesibleByAnyOne value must be valid"));
       }
       if(!accesibleByAnyOne.videoUrl.urlId&&!accesibleByAnyOne.describtion.describtionId)
       {
        return next(new Error("if you want to update the accessibleBy you should send either the describtionId or urlId to make the update well"))
       }
       if(accesibleByAnyOne.videoUrl&&accesibleByAnyOne.videoUrl.urlId)
       {
          // make the code on this:
          const {videoUrl}=accesibleByAnyOne;
          // check on the urlId first:
          let flagVideo=false;
          
          let indexArray="";

          course.accesibleByAnyOne.videoUrl.forEach((ele,index)=>
        {
            if(videoUrl.urlId.toString()==ele.urlId.toString())
            {
                flagVideo=true;
                indexArray=index;
            }
        })
        if(!flagVideo)
        {
            return next(new Error("the id of the url of the video not exists"));
        }
        var arrayNew=[...course.accesibleByAnyOne.videoUrl];
        arrayNew[indexArray]={urlId:videoUrl.urlId,url:videoUrl.url};
        dataUPdate.accesibleByAnyOne={videoUrl:arrayNew};
        flagVideoUpdated=true;
        dataUPdate.accesibleByAnyOne.describtion=course.accesibleByAnyOne.describtion;
       }
       if(accesibleByAnyOne.describtion&&accesibleByAnyOne.describtion.describtionId)
       {
         // maek the code on this:
         if(Object.keys(accesibleByAnyOne.describtion).length<=0)
         {
            return next(new Error("the describtion fiedls in the accesibleby must have fields"));
         }
         // also make these here:
         // get the describtionId and the describtion content:
         const {describtionId,describtionContent}=accesibleByAnyOne.describtion;
         if(!describtionId)
         {
            return next(new Error("the describtionId must have value"));
         }
         if(!describtionContent)
         {
            return next(new Error("the describtion content must have value also"));
         }
         // get the id:
         let indexDes="";
         let flagIndex=false;
         course.accesibleByAnyOne.describtion.forEach((ele,index)=>
        {
            if(ele.describtionId.toString()==describtionId)
            {
                indexDes=index;
                flagIndex=true;
            }
        });
        if(!flagIndex)
        {
            return next(new Error("the id of the describtion is not exists can't update it"));
        }
        let newArray=[...course.accesibleByAnyOne.describtion];
        newArray[indexDes]={describtionId:describtionId,describtionContent:describtionContent};
        if(typeof dataUPdate.accesibleByAnyOne=="object")
        {
            dataUPdate.accesibleByAnyOne.describtion=newArray;
            // false:
            if(!flagVideoUpdated)
            {
              // we should add the video:
              dataUPdate.accesibleByAnyOne.videoUrl=course.accesibleByAnyOne.videoUrl;
            }
            // true:
        }
        else
        {
            dataUPdate.accesibleByAnyOne={};
            if(!flagVideoUpdated)
                {
                  // we should add the video:
                  dataUPdate.accesibleByAnyOne.videoUrl=course.accesibleByAnyOne.videoUrl;
                }
            dataUPdate.accesibleByAnyOne.describtion=newArray;

        }
       }
      }
      else
      {
      }
    }
    else if(query=="delete")
    {
      // mkae the delete algorithm:
      if(!course.accesibleByAnyOne)
        {
            return next(new Error("the course not have the field to update it"));
        }
        // check on the others:
        // check on the model and check on the every thing:
        let  newVar=req.body.accesibleByAnyOne;
        newVar=JSON.parse(req.body.accesibleByAnyOne);
        // check on it:
        if(!newVar.urlId&&!newVar.describtionId)
        {
            return next(new Error("the only must be one send in the request either describtionId or urlId"))
        }
        const resultFunction=checkOnCourseUpdateSchema(updateCccesspibeBySchemaDelete,newVar);
        const resy=resultFunction(req,res,next);
        if(resy)
        {
           // make the algorithm:
           if(Object.keys(newVar).length<=0)
            {
                return next(new Error("if you want to delete any thing from the accesibleBy you kust send the urlId or describtionId"));
            }   
            const {urlId,describtionId}=newVar;
            if(urlId)
            {
            //make the algorithm:
            let indexArray="";
            let flagArray=false;
            course.accesibleByAnyOne.videoUrl.forEach((ele,index)=>
            {
                if(ele.urlId.toString()===urlId.toString())
                {
                    // make the code:
                    indexArray=index;
                    flagArray=true;
                }
            });
            if(!flagArray)
            {
                return next(new Error("the id is not exists"));
            }
            let  arrayNeWWUrl=[...course.accesibleByAnyOne.videoUrl];
            arrayNeWWUrl.splice(indexArray,1);
            let decribtionArra=[...course.accesibleByAnyOne.describtion];
            decribtionArra.splice(indexArray,1);
            dataUPdate.accesibleByAnyOne={videoUrl:arrayNeWWUrl,describtion:decribtionArra};
            }
            else if(describtionId)
            {
            // check and make the code also:
            let indexA=0;
            let indexFllag="";
            course.accesibleByAnyOne.describtion.forEach((ele,index)=>
            {
                if(ele.describtionId.toString()==newVar.describtionId.toString())
                {
                    indexA=index;
                    indexFllag=true;
                }
            });
            if(!indexFllag)
            {
                return next(new Error("the describtionId is not exists"));
            }
            let arr=[...course.accesibleByAnyOne.describtion];
            arr.splice(indexA,1);
            let arr2=[...course.accesibleByAnyOne.videoUrl];
            arr2.splice(indexA,1);
            dataUPdate.accesibleByAnyOne={videoUrl:arr2,describtion:arr};
            }
            else
            {
                return next(new Error("there is an errror if you want to delete any thing from the accesibleBy you kust send the urlId or describtionId "))
            }
        }
        else
        {
            console.log("there is an error");
        }
    }
    else if(query=="add")
    {
        // make the code and check on this:
        // check on the vaidation:
        let newVar=req.body.accesibleByAnyOne;
        newVar=JSON.parse(newVar);
        const validaton=checkOnCourseUpdateSchema(addAccessBySchema,newVar);
        const get=validaton(req,res,next);
        if(get)
        {
           // checke now on the two:
           const {videoUrl,describtion}=newVar;
           if(videoUrl.length!=describtion.length)
            {
                return next(new Error("you must add a describtion for each video url and opposite"));
            } 
            let arrayVideo=[...course.accesibleByAnyOne.videoUrl];
            let arrayDescribtion=[...course.accesibleByAnyOne.describtion];
           // check on the other:
           for(let i=0;i<videoUrl.length;i++)
           {
            const objectMakeVodeo={};
            const objectMakeDescribtion={}
            objectMakeVodeo.urlId=nanoid(8);
            objectMakeVodeo.url=videoUrl[i];
            arrayVideo.push(objectMakeVodeo);
            objectMakeDescribtion.describtionId=nanoid(8);
            objectMakeDescribtion.describtionContent=describtion[i];
            arrayDescribtion.push(objectMakeDescribtion);
           }
           dataUPdate.accesibleByAnyOne={videoUrl:arrayVideo,describtion:arrayDescribtion};
        }
        else
        {
            console.log("there is an error");
        }
    }    
    else
    {
        return next(new Error("the value of the accesibleByAnyOne on the query must be one of those add/update/delete"));
    } 
}
// check on the subcatgeiry and categiry logic:
const {category,subCategory}=dataUPdate;
let flagDeleteCategory=false;
let flagUpdateCategory=false;
let flagAddCategory=false;
// chekc if he want to delete
if(course.category)
{
    // if he it exists we can delete or the update because it exists:
    const {categoryDelete}=req.query;
    if(categoryDelete=="delete"&&categoryDelete!="")
    {
        // we should make the catgegory and the subCategory undefined:
        dataUPdate.category=undefined;
        dataUPdate.subCategory=undefined;
        flagDeleteCategory=true;
    }
    else
    {
        // check if thwe category field is exists or not:
        if(category)
        {
            // if there are category we will update it:
            var newCategory=await categoryModel.findOne({_id:category});
            if(!newCategory)
            {
                return next(new Error("the category you want to update by is not exists check the id or it may be deleted"));
            }
            dataUPdate.category=category;
            flagUpdateCategory=true;
        }
    }
}
else
{
    // the catgeory field is not exists thne check if the:
    if(category)
    {
        // check on the new category:
        var newCategoryAdding=await categoryModel.findOne({_id:category});
        if(!newCategoryAdding)
        {
            return next(new Error("the category is not exists chekc the id or it may be deleted"));
        }
        dataUPdate.category=category;
        flagAddCategory=true;
    }
}
// we will check o the subCategory:
if(subCategory)
{
    
    if(flagDeleteCategory)
    {
        return next(new Error("you can't add subCategory when you add category"));
    }
   if(!course.subCategory)
   {
       // we will check on the update:
       // check with the new:
       if(flagAddCategory)
       {
        let falgSubAdding=false;
          // check with the new category:
          newCategoryAdding.subCategory.forEach((ele)=>
        {
              if(ele.subCategoryId.toString()==subCategory)
              {
                flagAddCategory=true;
                dataUPdate.subCategory={subCategoryId:subCategory,subCategory:ele.subCategoryName};
              }
        });
        if(!falgSubAdding)
        {
            return next(new Error("you must adding subCategory asigned to this selected category"))
        }
       }
       // check with the old of the category:
   }
   // then check on the updating:now:
   if(course.subCategory)
   {
    // check now with the flag of updating:
    if(flagUpdateCategory)
    {
        let flagUpdateSub=false;
        // compare the new one with the new one of categoey:
        newCategory.subCategory.forEach((ele)=>
        {
            if(ele.subCategoryId.toString()==subCategory.toString())
            {
                flagUpdateSub=true;
                dataUPdate.subCategory={subCategoryId:subCategory,subCategory:ele.subCategoryName};
            }
        });
        if(!flagUpdateSub)
        {
            return next(new Error("the updated subCategory is not refer to the new catgeory check the if of subCategory and try again"));
        }
    }
    else
    {
        // we must check with the old category:
        const getCategory=await categoryModel.findOne({_id:course.category});
        if(!getCategory)
        {
            return next(new Error("the category is not exists"));
        }
        let flagOfNewSubWithOld=false;
        getCategory.subCategory.forEach((ele)=>
        {
          if(ele.subCategoryId.toString()==subCategory)
          {
              flagOfNewSubWithOld=true;
              dataUPdate.subCategory={subCategoryId:subCategory,subCategory:ele.subCategoryName};
          }
        });
        if(!flagOfNewSubWithOld)
        {
            return next(new Error("the new subCategory is not refer to the current category check the category and try again"));
        }
    }
   }
}
else
{
    // there no subCategory check the new category is assign  to the old one of subCategory:
    if(flagUpdateCategory)
    {
        let flag=false;
        newCategory.subCategory.forEach((ele)=>
        {
            if(ele.subCategoryId.toString()==course.subCategory.subCategoryId.toString())
            {
                flag=true;
            }
        });
        if(!flag)
        {
            return next(new Error("the updated category not matched with the subCategory you can solve this by chnging the subCategory also"));
        }
    }
    if(flagAddCategory&&!subCategory)
    {
        return next(new Error("if you want to add the New category you also shiuld add subCategory also and the subCategory should matched with the new Category"));
    }
}
// check on the what will you learn:
let  whatWillYouLearn=req.body.whatWillYouLearn;

// check on the what will you learn:
if(whatWillYouLearn)
{
// Check if whatWillYouLearn is a string, then parse it
if (typeof whatWillYouLearn === 'string') {
  
        whatWillYouLearn=JSON.parse(whatWillYouLearn);
}
else
{
    return next(new Error("Invalid JSON format in whatWillYouLearn"));
}
    // check on th update and delete and other:
    let variableNew=req.query.whatWillYouLearn;
    if(!variableNew)
    {
        return next(new Error("if  you want to make anychange on the objectives you must send the whatWillYouLearn on the query with add/update/delete"));
    }
    // check on the values:
    if(variableNew=="add")
    {
        let arrayWhatWillYouAdd=[...course.whatWillYouLearn];
        whatWillYouLearn.forEach((ele)=>
        {
            let objectAdd={};
            objectAdd.id=nanoid(8);
            objectAdd.objective=ele;
            arrayWhatWillYouAdd.push(objectAdd);
        });
        dataUPdate.whatWillYouLearn=arrayWhatWillYouAdd;
    }
    else if(variableNew=="delete")
    {
        // mae the code of delete algorithm:
        let arrayNow=[...course.whatWillYouLearn];
       for(let i=0;i<whatWillYouLearn.length;i++)
       {
        // loop on the arrayELments:
        let flag=false;
        for(let j=0;j<arrayNow.length;j++)
        {
            let {id}=arrayNow[j];
            if(id.toString()==whatWillYouLearn[i])
            {
                flag=true;
                arrayNow.splice(j,1);
            }
        }
        if(!flag)
        {
            return next(new Error("the id of the objective is not exists please check the id and try aagain"));
        }

       }

        // delete the element of the what will you learn;
        dataUPdate.whatWillYouLearn=[];
        dataUPdate.whatWillYouLearn=arrayNow;
    }
    else if(variableNew=="update")
    {
        
        // make the code algorithm and do this:
        const fun=checkOnCourseUpdateSchema(checkOnTheWahtWillYouLearnUpdate,whatWillYouLearn);
        const result=fun(req,res,next);
        if(result)
        {
            // make the code:
            if(whatWillYouLearn.id.length!=whatWillYouLearn.objective.length)
            {
                return next(new Error("the length of the id must be the same length of the objectives"));
            }
            for(let i=0;i<whatWillYouLearn.id.length;i++)
            {
                let getObjective=await courseModel.findOneAndUpdate({_id:courseId,'whatWillYouLearn.id':whatWillYouLearn.id[i]},{$set:{'whatWillYouLearn.$.objective':whatWillYouLearn.objective[i]}});
                if(!getObjective)
                {
                    return next(new Error("the id of the objective is not exists check the id adn try again"));
                }
            }
            delete dataUPdate.whatWillYouLearn;
        }
        else
        {
            console.log("this is an error in the whatWillYouLearn of updating");
        }
    }
    else
    {
        return next(new Error("the value of the whatWillYouLearn ont he query must be one of (add,update,delete)"));
    }
}
// update:
const newCourse=await courseModel.findOneAndUpdate({_id:courseId},dataUPdate,{new:true});
// return the response with the updted data:
return res.json({success:true,message:"the course is updated sucessfully",course:newCourse});
}
catch(err)
{
    return next(err);
}
}
// delete the course:
export const deleteCourse=async (req,res,next)=>
{
    try
    {
        // egt the id of the ins:
        const {_id}=req.data;
        // egtt te id of the course:
        const {courseId}=req.params;
        // cehck if rhe course is exist :
        const course=await courseModel.findOne({_id:courseId});
        if(!course)
        {
            return next(new Error("the course is not exists checj the id of the course or it may be deleted"));
        }
        if(course.instructor.toString()!=_id.toString())
        {
            return next(new Error("sorry you can't delete this course because you are not the owner of it"));
        }
        await course.deleteOne();
        // delet all the sections tht assinged to this course:
        await sectionModel.deleteMany({course:courseId});
        // delet all these lesson that assigned to this course:
        await lessonModel.deleteMany({course:courseId});
        const deletd=await courseModel.find({instructor:_id}).populate([{path:"instructor"},{path:'category'}]).sort("-createdAt");
        // delet the course from likes and cart from the user:
        await userModel.updateMany({cart:{$in:courseId}},{$pull:{cart:courseId}});
        // likes = also:
        await userModel.updateMany({likes:{$in:courseId}},{$pull:{likes:courseId}});
        // delete all the request son this course:
        await subscribersModel.deleteMany({courseId:courseId});
        // RETUR THE RESPOSNE:
        return res.json({success:true,message:"the course is deleted sucessfully",courses:deletd});
    }
    catch(err)
    {
        return next(err);
    }
}
// get my courses:
export const getInsCourses=async (req,res,next)=>
{
try
{
   const {_id}=req.data;
   let courses=[];
   // check on if there was an data:
   const data=req.query;
   // check first if the data is empty:
   if(Object.keys(data).keys==0)
   {
    courses=await courseModel.find({instructor:_id}).populate([{path:"category"}]).sort("-createdAt courseName");
    return res.json({success:true,courses,numberCourses:courses.length})
   }
   const mapObject=new Map(Object.entries(data));
   let flag=false;
   mapObject.forEach((value,key)=>
{
    if(value)
    {
        flag=true;
    }
})
   if(flag==false)
   {
    courses=await courseModel.find({instructor:_id}).populate([{path:"category"}]).sort("-createdAt courseName");
    return res.json({success:true,courses,numberCourses:courses.length});
   }
   let objectFilter={instructor:_id};
    if(data.courseName)
        objectFilter.courseName={$regex:data.courseName,$options:"i"};
    if(data.coursePrice)
        objectFilter.coursePrice=data.coursePrice;
    if(data.category)
        objectFilter.category=data.category;
    courses=await courseModel.find(objectFilter).populate([{path:"category"}]).sort("-createdAt courseName");
   //retyrunt he response:
   return res.json({success:true,courses,numberCourses:courses.length});
}
catch(err)
{
    return next(err);
}
}
// get course plan:
export const getPlan=async (req,res,next)=>
{
    try
    {
        // egt the id of the course:
        const {courseId}=req.params;
        const course=await courseModel.findOne({_id:courseId}).populate([{path:"instructor"},{path:"category"},{path:"sections",populate:[{path:"lessons"}]}]);
        if(!course)
        {
            return next(new Error("the course is not exist scheck the id or it may be deleted"));
        }
        // return the resposne:
        return res.json({success:true,course});
    }
    catch(err)
    {
        return next(err);
    }
}
// check the course medial:
export const watchCourseMedia=async (req,res,next)=>
{
    try
    {
        // get the id of the user:
        const {_id}=req.data;
        // get the id of the lesson:
        const {lessonId}=req.params;
        const lesson=await lessonModel.findOne({_id:lessonId}).populate([{path:'section'}]);
        if(!lesson)
        {
            return next(new Error("the lesson is not exists check the id and try again"));
        }
        // get the id's of courses that the user partcipnts on it:
        const particpintsCourses=await participntsModel.find({user:_id});
        if(particpintsCourses.length<=0)
        {
            return next(new Error("you not join to any course yet contact with the owner of this course or join to the course now"));
        }
        let coursesIds=[];
        particpintsCourses.forEach((ele)=>
        {
            const {course}=ele;
            coursesIds.push(course);
        });
        let flagExists=false;
        coursesIds.forEach((ele)=>
        {
            if(ele.toString()==lesson.course.toString())
            {
                flagExists=true;
            }
        });
        if(!flagExists)
        {
            return next(new Error("you not join to this course yet or this lesson is not related to this course"));
        }
        // return the response:
        return res.json({success:true,message:"yes the user can see the lesson and the course data",lesson});
    }
    catch(err)
    {
        return next(err);
    }
}
// wathcn the media of hre course for the employees:
export const watchMediaOfCourseForEMmployees=async (req,res,next)=>
{
    try
    {
        // get the id of the employees:
        const {_id}=req.data;
        // get the id of the lesson:
        const {lessonId}=req.params;
        const lesson=await lessonModel.findOne({_id:lessonId}).populate([{path:"course"},{path:"section"}]);
        if(!lesson)
        {
            return next(new Error("the lesson id is not exists check the id or the owner delete it"));
        }
        // check if it superadmin or instructor:
        const user=await employeeModel.findOne({_id});
        if(!user)
        {
            return next(new Error("the user is not exists"));
        }
                // if superadmin give him all the data:
        // if it ins(check if he is the owner of the course or not and check if chrkc if the lesson is belong to this course or not):
        if(user.role=="superAdmin")
        {
            // mak the logic of the super:
            return res.json({success:true,message:"you can see the lesson data",lesson})
        }
        else if(user.role=="instructor")
        {
            // get all courses that this lesson own:
            const coursesIns=await courseModel.find({instructor:_id});
            if(coursesIns.length<=0)
            {
                return next(new Error("you not have any courses you own to see"));
            }
            // get the id's of all the courses:
            let coursesIds=[];
            coursesIns.forEach((ele)=>
            {
                const {_id}=ele;
                coursesIds.push(_id);
            });
            // now check tht lesson relate to any course the ins have:
            let flag=false;
            for(let i=0;i<coursesIds.length;i++)
            {
                if(coursesIds[i].toString()==lesson.course._id&&lesson.course.instructor.toString()==_id.toString())
                {
                    flag=true;
                    break;
                }
            }
            if(!flag)
            {
                return next(new Error("you not the owner of this course to see it"));
            }
            return res.json({success:true,message:"you can see the lesson data",lesson});
        }
        else
        {
            return next(new Error("to see the data of the course you must be the owner of this course or you must be SuperAdmin"));
        }

    }
    catch(err)
    {
        return next(err);
    }
}
//////////////////////