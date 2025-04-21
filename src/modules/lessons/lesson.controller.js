import { addRequiredLinks, addVideo, checkRequiredLinks, deleteLink, deleteVideo, updateVieo, updteLinks } from './lesson.schema.js';
import { checkVideoAddToLessons } from './lesson.schema.js';
import { nanoid } from 'nanoid';
import cloudinary from './../../utils/cloudinary.config.js';
import checkOnCourseUpdateSchema from '../../utils/checkOnCourseUpdate.js';
import lessonModel from '../../../db/models/lessons/lessons.model.js';
import calculateTotalTime from '../../utils/fucntion.time.js';
import sectionModel from '../../../db/models/sections/section.model.js';
import { updatePdfsUploads } from './lesson.schema.js';
import courseModel from '../../../db/models/courses/courses.model.js';
// add lessons schema:
export const addLesson=async (req,res,next)=>
{
    try
    {
        // egtgt eh id of the course:
        const {courseId}=req.params;
        const {section}=req.body;
        // get the data of the lessons:
        const data=req.body;
        const {name,_id}=req.data;
        // check first on the files and do the logic of it:
        if(req.files&&req.files.length>0)
        {
            // chekc on the uploaded tesxts describtion:
            let {uploadText}=req.body;
            if(!uploadText)
            {
                return next(new Error("you must send the uploadText in the body"));
            }
            uploadText=JSON.parse(uploadText);
            // cehck nt he length f it tand the files:
            if(uploadText.length!=req.files.length)
            {
                return next(new Error("you must enter an describtion for each pdf or file you upload"));
            }
            // loop on the files and upload it on the cloudinary:
            let arrayOfFIles=[];
            for(let i=0;i<req.files.length;i++)
            {
            // make the object fro each file and uplaod it:
             let objectFile={};
             const uplaodFile=await cloudinary.uploader.upload(req.files[i].path,{folder:`/uploads/teachingOnlineCenter/employees/${name}/courses/lessonsPdfs/`,resource_type:'auto'});
             objectFile.public_id=uplaodFile.public_id;
             objectFile.secure_url=uplaodFile.secure_url;
             objectFile.UploadedId=nanoid(5);
             objectFile.uploadText=uploadText[i];
             console.log(objectFile.uploadText);
             arrayOfFIles.push(objectFile);
            }
            // delete the text file from data:
            delete data.uploadText;
            // add the fields to the db:
            console.log(arrayOfFIles);
            data.pdfs=arrayOfFIles;
        }
        // check on the time also and (update the time of the section):
        const {timeOfLesson}=data;
        const arrayTimes=timeOfLesson.split(":");
        if(arrayTimes.length<3)
        {
            return next(new Error("the time of lessosn you should add the time at this pattern: (h:m:s) "));
        }
        for(let i=0;i<arrayTimes.length;i++)
        {
            if(i==0)
            {
                // check on the hours:
                let hours=+arrayTimes[i];
                if(hours>1000)
                {
                    return next(new Error("the hours at maximum is 1000 hours only"));
                }
            }
            else if(i==1)
            {
                // check on the minutes:
                let minutes=+arrayTimes[i];
                if(minutes>60)
                {
                    return next(new Error("the minutes is only maximum is 60"));
                }
            }
            else if(i==2)
            {
                // check on the seconds:
                let seconds=+arrayTimes[i];
                if(seconds>60)
                {
                    return next(new Error("the seconds must be only at maximum 60"));
                }
            }
        }
        // we will chck now on the other fields now:
         // other required links:
        let {otherRequiredLinks}=data;
        if(otherRequiredLinks)
        {
            // we will chekc on the validation then do the operation:
            let newOtherVariable=JSON.parse(otherRequiredLinks);
            // check on the validation of it:
            let v=checkOnCourseUpdateSchema(checkRequiredLinks,newOtherVariable);
            let resO=v(req,res,next);
            if(newOtherVariable.length<=0)
            {
                delete data.otherRequiredLinks;
            }
            if(resO)
            {
                // make the logic on it otherRequiredLinks:
                let arrayrequeiredLinks=[];
                newOtherVariable.forEach((ele)=>
                {
                    let newObjectMake={};
                    newObjectMake.link=ele.link;
                    newObjectMake.Describtion=ele.Describtion;
                    newObjectMake.linkId=nanoid(5);
                    arrayrequeiredLinks.push(newObjectMake);
                });
                // make the value:
                data.otherRequiredLinks=arrayrequeiredLinks;
            }
            else
            {
                console.log("there is an error in the validation and",resO);
            }
        }
        // other  on the videos:
        const {videos}=data;
        if(videos)
        {
            let newVideoVar=JSON.parse(videos);
            if(newVideoVar.length<=0)
            {
                return next(new Error("you must add video to the lesson"));
            }
            // validate on it:
            const rt=checkOnCourseUpdateSchema(checkVideoAddToLessons,newVideoVar);
            const result=rt(req,res,next);
            console.log(newVideoVar);
            if(result)
            {
                // make the logic of adding:
                let arrayAdding=[];
                newVideoVar.forEach((ele)=>
                {
                    let objectMakingNow={};
                    objectMakingNow.videoUrl=ele;
                    objectMakingNow.videoId=nanoid(5);
                    arrayAdding.push(objectMakingNow);
                });
                // add the videos array:
                data.videos=arrayAdding;
            }
            else
            {
                console.log("there is an error in the video validation",result);
            }
        }
        // add the course to  to the object:
        data.course=courseId;
        // make the documet in the db:
        await lessonModel.create(data);
        // update the hous and time of section:
        // get all lessons on that section:
        const getAllLessons=await lessonModel.find({section});
        let times=[];
        getAllLessons.forEach((ele)=>
        {
            const {timeOfLesson}=ele;
            times.push(timeOfLesson);
        });
        console.log(times);
        const getTimesTotal=calculateTotalTime(times);
        console.log("the total of times now",getTimesTotal);
        await sectionModel.updateOne({_id:section},{sectionHours:getTimesTotal});
        // return the response:
        return res.json({success:true,message:"the lessosn is added sucessfully",lessons:getAllLessons,numberLessonsOnThisSection:getAllLessons.length});
    }
    catch(err)
    {
        return next(err);
    }
}
// update lesson:
export const updateLesosn=async (req,res,next)=>
{
    try
    {
        console.log("yes i;m heere");
        // get he id of the lessons:
        const {lessonId}=req.params;
        const lesson=await lessonModel.findOne({_id:lessonId}).populate([{path:"section"},{path:"course",populate:[{path:"instructor"}]}]);
        if(!lesson)
            {
                return next(new Error("please check the lesson id the lesson is not exists or it may be deleted"));
            }
            console.log(lesson);
        const {name}=lesson.course.instructor;
       
        // get the id of the user:
        const {_id}=req.data;
        // check on the ownerty:
        console.log(lesson.course.instructor._id)
        if(lesson.course.instructor._id.toString()!=_id.toString())
        {
            return next(new Error("you can't update this lesson because you are not the admin of this course"));
        }
        // get the dat aof update:
        const data=req.body;
        // check on the fileds and files:
        if(req.files&&req.files.length>0)
        {
            // chekc on the query now:
            const {filesOptions}=req.query;
            if(!filesOptions)
            {
                return next(new Error("you jusr send the files options in the query with value(add,update,delete)"));
            }
            // check now on the files options:
            if(filesOptions=="add")
            {
                // make the add logic:
                let newArrayFiles=[...lesson.pdfs];
                // chekc on the added text to each file:
                let {uploadText}=req.body;
                if(!uploadText)
                {
                    return next(new Error("the upload text array must be sended when you upload files"));
                }
                let newUploadText=JSON.parse(uploadText);
                if(newUploadText.length!=req.files.length)
                {
                    return next(new Error("you should add describtion text for each file"));
                }
                for(let i=0;i<req.files.length;i++)
                {
                    // make the object for each file and add it:
                    let objectFile={};
                    const uploadFileOnCloudinry=await cloudinary.uploader.upload(req.files[i].path,{folder:`/uploads/teachingOnlineCenter/employees/${name}/courses/lessonsPdfs/`,resource_type:'auto'});
                    objectFile.secure_url=uploadFileOnCloudinry.secure_url;
                    objectFile.public_id=uploadFileOnCloudinry.public_id;
                    objectFile.UploadedId=nanoid(5);
                    objectFile.uploadText=newUploadText[i];
                    newArrayFiles.push(objectFile);
                }
                // add the files to it and delete all the others:
                data.pdfs=newArrayFiles;
                delete data.uploadText;
            }
            else if(filesOptions=="update")
            {
                // make the update logic:
                // get the array of objects from the body:
                const {pdfsUpdate}=req.body;
                // check on the data and make the update:
                const getParsing=JSON.parse(pdfsUpdate);
                const getValidate=checkOnCourseUpdateSchema(updatePdfsUploads,getParsing);
                const resy=getValidate(req,res,next);
                if(resy)
                {
                    // the vakudate is true then we will chekc on the  id and the newDescribtion:
                    if(getParsing.length!=req.files.length)
                    {
                        return next(new Error("sorry you must upload file for each update on the files"));
                    }
                    let arrayOfPdfs=[...lesson.pdfs];
                    for(let i=0;i<getParsing.length;i++)
                    {
                        // flag of founded:
                        let flag=false;
                        // chekc on the id and check on the new describtion:
                        for(let j=0;j<arrayOfPdfs.length;j++)
                        {
                            if(arrayOfPdfs[j].UploadedId.toString()==getParsing[i].id)
                                {
                                    flag=true;
                                    // make the update also:
                                    const uploadingFilecLo=await cloudinary.uploader.upload(req.files[i].path,{public_id:arrayOfPdfs[j].public_id,resource_type:'auto'});
                                    // make the update:
                                    arrayOfPdfs[j]={public_id:uploadingFilecLo.public_id,secure_url:uploadingFilecLo.secure_url,UploadedId:arrayOfPdfs[j].UploadedId,uploadText:getParsing[i].newDescribtion?getParsing[i].newDescribtion:arrayOfPdfs[j].uploadText};
                                }
                        }
                        if(!flag)
                        {
                            return next(new Error("the id of the file is not exist check the id and try again"));
                        }
                    }
                    // we will add the new array:
                    data.pdfs=arrayOfPdfs;
                    // we will delete  not allowed fields: 
                    delete data.pdfsUpdate;
                }
                else if(filesOptions=="delete")
                {
                    return next(new Error("sorry you can't upload any file in the option delete for filesOptions"))
                }
                else
                {
                    console.log("there is an error in the validate of the upload and update uploads",resy);
                }
            }
            else
            {
                return next(new Error("the value filesOtions must be add or update because ypou are uploaded an files"));
            }
        }
        // check on the delete:
        const {filesOptions}=req.query;
        if(filesOptions)
        {
            if(filesOptions=="delete")
            {
                //check for the id and check on it:
                const {idsOfFiles}=req.body;
                if(!idsOfFiles)
                {
                    return next(new Error("you must send the id of files you want to delete"));
                }
             let newIdsFiles=JSON.parse(idsOfFiles);
             if(newIdsFiles.length>0)
             {
                // egt the courses and delete what you want:
                let files=[...lesson.pdfs];
                let indexes=[];
                newIdsFiles.forEach((ele)=>
                {
                    let flagExists=false;
                    for(let i=0;i<files.length;i++)
                    {
                        if(ele.toString()==files[i].UploadedId)
                        {
                            flagExists=true;
                            indexes.push(i);
                        }
                    }
                    if(!flagExists)
                    {
                        return next(new Error("the id of the file is not exists check the id and try again"));
                    }
                });
                // loop on the indexes:
               let newArray=files.filter((ele,index)=>
            {
               
                if(!indexes.includes(index))
                {
                    return ele;
                }
            });
            // add the data to the new:    
            data.pdfs=newArray;
            // delet the nort allowed fields:
            delete data.idsOfFiles;
             }
             else
             {
                return next(new Error("you must send the id's of files you want to delete"));
             }
            }
        }
        // check for updte only text without uplooding files:
        const {pdfsUpdate}=req.body;
        if(pdfsUpdate)
        {
            const {filesOptions}=req.query;
            if(filesOptions)
            {
                return next(new Error("if you want to update the file describtion only the filesOptions query is not allowed"));
            }
            if(req.files&&req.files.length>0)
            {
                return next(new Error("you can't upload any file when you update the describtion of file only"));
            }
            // we will validae on it now:
            let newPdfsUpdate=JSON.parse(pdfsUpdate);
            const getVal=checkOnCourseUpdateSchema(updatePdfsUploads,newPdfsUpdate);
            const resNow=getVal(req,res,next);
            if(!resNow)
            {
                console.log("there isan error in the validate of pdfs update",resNow);
            }
            let newCopy=[...lesson.pdfs];
            // after validate we will loop on the newPdfsUpdate Annd check the id:
            for(let i=0;i<newPdfsUpdate.length;i++)
            {
                let flagExists=false;
                newCopy.forEach((ele,index)=>
                {
                    if(ele.UploadedId.toString()==newPdfsUpdate[i].id.toString())
                    {
                        flagExists=true;
                        ele.uploadText=newPdfsUpdate[i].newDescribtion;
                    }
                });
                if(!flagExists)
                {
                    return next(new Error("the id is not exists please chekc the id of the file you want to update it"));
                }
            }
            // make the update:
            data.pdfs=newCopy;
            // delet the not needed fields:
            delete data.pdfsUpdate;
        }
        // check on lesson hours:
        const {timeOfLesson}=req.body;
        let flagUpdateTime=false;
        if(timeOfLesson)
        {
            // make the logic of it:
            const newTimeArr=timeOfLesson.split(":");
            newTimeArr.forEach((ele,index)=>
            {
                if(index==0)
                {
                    if(+ele>1000||+ele<0)
                    {
                        return next(new Error("the hours must be larger than 0 and the smaller than 10000"));
                    }
                }
                else if(index==1)
                {
                    if(+ele>60||+ele<0)
                    {
                        return next(new Error("the miniutes must between the (0:60) minutes"));
                    }
                }
                else if(index==2)
                {
                    if(+ele>60||+ele<0)
                    {
                        return next(new Error("the seconds must be between (0:60) seconds"));
                    }
                }
                else
                {
                    return next(new Error("you can only write the hours and minutes and seconds on this format: (h:m:s)"))
                }
            });
            flagUpdateTime=true;
        }
        // check on the course and section with the multi probability:
        const {course}=req.body;
        const {section}=req.body;
        const newObject={course,section};
        if(Object.keys(newObject).length>0)
        {
            // chekc on all the probabilities:
            // if the two are exists:
            if(newObject.course&&newObject.section)
            {
                // get the course and get the section and check on it:
                const getCourse=await courseModel.findOne({_id:newObject.course});
                if(!getCourse)
                {
                    return next(new Error("the course is not exists please chekc the id"));
                }
                if(getCourse.instructor.toString()!=_id.toString())
                {
                    return next(new Error("sorry you are not the owner of this course"));
                }
                // cehck the section too:
                const getSection=await sectionModel.findOne({_id:newObject.section});
                if(!getSection)
                {
                    return next(new Error("the section is not exists check the id and try again"));
                }
                // cehck if this section is assigned to this course or not:
                if(getSection.course.toString()!=newObject.course.toString())
                {
                    return next(new Error("the section youn are selected is not assigned to this course please revise the data"));
                }
            }
            // if course exists and lesson not exists:
            else if(newObject.course&&!newObject.section)
            {
                // make the logic:
                const getCourse=await courseModel.findOne({_id:newObject.course});
                if(!getCourse)
                {
                    return next(new Error("the course is not exists check the id nd try or the course is may deleted"));
                }
                if(getCourse.instructor.toString()!=_id.toString())
                {
                    return next(new Error("the course you are selected is not owner to you you can't use it"));
                }
                // chekc with the section also of the lesson:
                if(lesson.section.course.toString()!=getCourse._id.toString())
                {
                    return next(new Error("you can't update the course and this section that the lesson is selected to it not related to this course"));
                }
            }
            // if section exists and course not exists:
            else if(newObject.section&&!newObject.course)
            {
                const getSection=await sectionModel.findOne({_id:newObject.section});
                if(!getSection)
                {
                    return next(new Error("the section is not exists or it may be deleted"));
                }
                if(getSection.course.toString()!=lesson.course._id.toString())
                {
                    return next(new Error("the section you want to update the lesson to not assigned to the course which is selected"));
                }
            }
            // if the two are not exists:
            else
            {
                console.log("the user not want to update the course or section");
            }
        }
    // update the other fields: and links and make update and delete and add:
    // make the all in the video :
    const {videosChanges}=req.body;
    if(videosChanges)
    {
        // get the new parsin from  an string:
        const newVideoChnges=JSON.parse(videosChanges);
        if(newVideoChnges.length>0)
        {
            // egtt eh query :
            const {videoOtpions}=req.query;
            if(!videoOtpions)
            {
                return next(new Error("if you want to make an changes n the videos you ust send the videoOtpions on the query"));
            }
            if(videoOtpions=="add")
            {
                // make the validation:
                const getValidate=checkOnCourseUpdateSchema(addVideo,newVideoChnges);
                const getRes=getValidate(req,res,next);
                if(getRes)
                {
                    // make the logic o thr code:
                    let arrayVideos=[...lesson.videos];
                    for(let i=0;i<newVideoChnges.length;i++)
                    {
                        // make the object:
                        let obejctVideo={};
                        obejctVideo.videoUrl=newVideoChnges[i];
                        obejctVideo.videoId=nanoid(5);
                        arrayVideos.push(obejctVideo);
                    }
                    // add the field:
                    data.videos=arrayVideos;
                    // delete unRequired fiedls:
                    delete data.videosChanges;
                }
                else
                {
                    console.log("there is an error on the validation of the addingvideo",getRes);
                }
            }
            else if(videoOtpions=="delete")
            {
                // make the validation:
                const makeValidation=checkOnCourseUpdateSchema(deleteVideo,newVideoChnges);
                const getgRes=makeValidation(req,res,next);
                if(getgRes)
                {
                    // get t eloop;
                    let indexsArray=[];
                    for(let i=0;i<newVideoChnges.length;i++)
                    {
                        let flag=false;
                        for(let j=0;j<lesson.videos.length;j++)
                        {
                            if(lesson.videos[j].videoId.toString()==newVideoChnges[i].toString())
                            {
                                flag=true;
                                indexsArray.push(j);
                            }
                        }
                        if(!flag)
                        {
                            return next(new Error("the video id is not exists check the id and try again "));
                        }
                    }
                    let newArrayVideos=lesson.videos.filter((ele,index)=>
                    {
                        if(!indexsArray.includes(index))
                        {
                            return ele;
                        }
                    });
                    // add the fields of videos:
                    data.videos=newArrayVideos;
                    // delete the other not required fields:
                    delete data.videosChanges;
                }
                else
                {
                    console.log("there is an error in the validation of the vvideo of the delete",getgRes);
                }
            }
            else if(videoOtpions=="update")
            {
                // make the valideation:
                const getVlidate=checkOnCourseUpdateSchema(updateVieo,newVideoChnges);
                const getReq=getVlidate(req,res,next);
                if(getReq)
                {
                    // loop on the array:
                    let array=[...lesson.videos]
                    for(let i=0;i<newVideoChnges.length;i++)
                    {
                        console.log(lesson.videos.length);
                        for(let j=0;j<lesson.videos.length;j++)
                        {
                            if(newVideoChnges[i].id.toString()==lesson.videos[j].videoId.toString())
                            {
                                flag=true;
                                array[j].videoUrl=newVideoChnges[i].url;
                            }
                        }
                        if(!flag)
                        {
                            return next(new Error("the video is not exists check the id and try again"));
                        }
                    }
                    data.videos=array;
                    delete data.videosChanges;
                }
                else
                {
                    console.log("there is an error in the validation of update the video",getReq);
                }
            }
            else
            {
                return next(new Error("the value if the videoOtpions must be add or update or delete"))
            }
        }
        else
        {
            delete data.videosChanges;
        }
    }
    // check on the other required links:
    const {requiredLinks}=data;
    if(requiredLinks)
    {
        const newRequiredLinks=JSON.parse(requiredLinks);
        if(newRequiredLinks.length>0)
        {
            // get the options for required fields:
            const {requiredLinksOptions}=req.query;
            if(!requiredLinksOptions)
            {
                return next(new Error("the requiredLInksOptions must send in  the query if you want update the links"));
            }
            if(requiredLinksOptions=="add")
            {
                // make the add:
                const validate=checkOnCourseUpdateSchema(addRequiredLinks,newRequiredLinks);
                const getRes=validate(req,res,next);
                if(getRes)
                {
                    let links=[...lesson.otherRequiredLinks];
                    for(let i=0;i<newRequiredLinks.length;i++)
                    {
                        let objectLink={};
                        objectLink.link=newRequiredLinks[i].link;
                        objectLink.linkId=nanoid(5);
                        objectLink.Describtion=newRequiredLinks[i].Describtion;
                        links.push(objectLink);
                    }
                    // add the fields:
                    data.otherRequiredLinks=links;
                    // delete the field that un reqired:
                    delete data.requiredLinks;
                }
                else
                {
                    console.log("there is an error on the validation of the add of links",getRes);
                }
            }
            else if(requiredLinksOptions=="update")
            {
                //chekc on the validation:
                const chekcValidate=checkOnCourseUpdateSchema(updteLinks,newRequiredLinks);
                const getRes=chekcValidate(req,res,next);
                if(getRes)
                {
                    let links=[...lesson.otherRequiredLinks];
                    for(let i=0;i<newRequiredLinks.length;i++)
                    {
                        let flag=false;
                        for(let j=0;j<links.length;j++)
                        {
                           if(!newRequiredLinks[i].id)
                           {
                            return next(new Error("you must neter the id of the link you want to updates"));
                           }
                           if(newRequiredLinks[i].id.toString()==links[j].linkId.toString())
                           {
                            flag=true;
                            // check what will it update:
                            if(newRequiredLinks[i].link&&newRequiredLinks[i].desc)
                            {
                                // make the logic:
                                links[j].link=newRequiredLinks[i].link;
                                links[j].Describtion=newRequiredLinks[i].desc;
                            }
                            else if(newRequiredLinks[i].link&&!newRequiredLinks[i].desc)
                            {
                                // make the logic:
                                links[j].link=newRequiredLinks[i].link;
                            }
                            else if(newRequiredLinks[i].desc&&!newRequiredLinks[i].link)
                            {
                                // make the logic:
                                links[j].Describtion=newRequiredLinks[i].desc;
                            }
                            else
                            {
                                return next(new Error("you must at least update ont field either desc or link orupdate the two together"));
                            }
                           }
                        }
                        if(!flag)
                        {
                            return next(new Error("the id of the link is not exists check the id and try again"));
                        }
                    }
                    // add the fields:
                    data.otherRequiredLinks=links;
                    delete data.requiredLinks;
                }
                else
                {
                    console.log("there is an error in the validation of the links",getRes);
                }
            }
            else if(requiredLinksOptions=="delete")
            {
                // maek the delete:
                // make the validation on it: and make ehte should do:
                const nakeValidation=checkOnCourseUpdateSchema(deleteLink,newRequiredLinks);
                const getResFormIT=nakeValidation(req,res,next);
                if(getResFormIT)
                {
                    let links=[...lesson.otherRequiredLinks];
                    let indexesDelete=[];
                    newRequiredLinks.forEach((ele1,index1)=>
                    {
                        let falg=false;
                        links.forEach((ele2,index)=>
                        {
                            if(ele2.linkId.toString()==ele1.toString())
                            {
                                falg=true;
                                indexesDelete.push(index);
                            }
                        });
                        if(!falg)
                        {
                            return next(new Error("the linkId you want to delete is not exists check the id of it and try again"));
                        }
                    });
                    let final=links.filter((ele,index)=>
                    {
                        console.log(indexesDelete,index)
                        if(indexesDelete.includes(index)==false)
                        {
                            return ele;
                        }
                        else
                        {
                            console.log("we will not return it");
                        }
                    });
                    console.log(final);
                    data.otherRequiredLinks=final;
                    delete data.requiredLinks;                 
                }
                else
                {
                    return next(new Error("the validation for delete links not true",getResFormIT));
                }
            }
            else
            {
                return next(new Error("the requiredLInks must be one of this vales (add,delete,update)"));
            }
        }
        else
        {
            // delete the not allowed field :
            delete data.requiredLinks;
        }
    }
    // uodate the document:
    let newlesosn=await lessonModel.findOneAndUpdate({_id:lessonId},data,{new:true}).populate([{path:"section"},{path:"course"}]);
    // chek on the time flag and do what required:
    if(flagUpdateTime)
    {
        // get all the times and updatre section time:
        if(data.section&&data.section.toString()!=lesson.section._id.toString())
        {
            // update the new and the old section:
            const oldUpdatedSection=await lessonModel.find({section:lesson.section._id});
            // get the array of it:
            let timesOld=[];
            oldUpdatedSection.forEach((ele)=>
            {
                const {timeOfLesson}=ele;
                timesOld.push(timeOfLesson);
            });
            const oldTotal=calculateTotalTime(timesOld);
            await sectionModel.updateOne({_id:lesson.section._id},{sectionHours:oldTotal});
            // update the new also:
            const getNewsLessons=await lessonModel.find({section:data.section});
            let timesArrayNews=[];
            getNewsLessons.forEach((ele)=>
            {
                const {timeOfLesson}=ele;
                timesArrayNews.push(timeOfLesson);
            });
            const getNew=calculateTotalTime(timesArrayNews);
            // update the section:
            sectionModel.updateOne({_id:newlesosn.section._id.toString()},{sectionHours:getNew});
        }
        else
        {
            // updte the old section only:
            const getLesosns=await lessonModel.find({section:newlesosn.section._id.toString()});
            let arrayTimes=[];
            getLesosns.forEach((ele)=>
            {
                const {timeOfLesson}=ele;
                arrayTimes.push(timeOfLesson);
            });
            const getTimesFinal=calculateTotalTime(arrayTimes);
            await sectionModel.updateOne({_id:newlesosn.section._id.toString()},{sectionHours:getTimesFinal});
        }
    }
    // retrunt he resposne:
    return res.json({success:true,message:"the lesson is updated sucessfully",lesson:newlesosn});
    }
    catch(err)
    {
        return next(err);
    }
}
// delete lesson:
export const  deleteLesosn=async (req,res,next)=>
{
    try
    {
        // egtt he id of the user:
        const {_id}=req.data;
        // egtt he id of the lesson:
        const {lessonId}=req.params;
        // check on the existsence :
        const getLesson=await lessonModel.findOne({_id:lessonId}).populate([{path:"section"},{path:"course"}]);
        const newGet={...getLesson};
        console.log(getLesson);
        if(!getLesson)
        {
            return next(new Error("the lesson is not exists check the id and try again"));
        }
        // chekc on the owenrty:
        if(_id.toString()!=getLesson.course.instructor.toString())
        {
            return next(new Error("sorry you aare not the owner of this course to delete the lessosn"));
        }
        // delete the lesson:
        await getLesson.deleteOne();
        // update the time of the section:
        const allLesosns=await lessonModel.find({section:getLesson.section._id});
        let arrayTimes=[];
        allLesosns.forEach((ele)=>
        {
            const {timeOfLesson}=ele;
            arrayTimes.push(timeOfLesson);
        });
        const getTime=calculateTotalTime(arrayTimes);
        await sectionModel.updateOne({_id:getLesson.section._id},{sectionHours:getTime});
        // retutn gthe response:
        return res.json({success:true,message:"the lessson is deleted successfully"});
    }
    catch(err)
    {
        return next(err);
    }
}
// get lessons with all the filters and with all options(get the lessons):
export const getLesosns=async (req,res,next)=>
{
    try
    {
        // get the data of the filetr:
        const data=req.query;
        // egt the id of the course:
        const {course}=data;
        delete data.course;
        let lessons=[];
        // check on the data now if it delete or not:
        if(Object.keys(data).length==0)
        {
            // get the dafualt fot he course only:
            lessons=await lessonModel.find({course}).populate([{path:'section'},{path:"course"}]).sort("createdAt");
            // return the response:
            return res.json({success:true,lessons,numberLessons:lessons.length});
        }
        // check if the keys ara eoty or not:
        let emptyONot=false;
        const newMap=new Map(Object.entries(data));
        newMap.forEach((value,key)=>
        {
            if(value)
            {
                emptyONot=true;
            }
        });
        if(!emptyONot)
        {
                        // get the dafualt fot he course only:
                        lessons=await lessonModel.find({course}).populate([{path:'section'},{path:"course"}]).sort("createdAt");
                        // return the response:
                        return res.json({success:true,lessons,numberLessons:lessons.length});
        }
        let objectFilter={};
        if(data.lessonName)
            objectFilter.lessonName={$regex:data.lessonName,$options:"i"};
        if(data.section)
            objectFilter.section=data.section;
        lessons=await lessonModel.find({course,...objectFilter}).populate([{path:"section"},{path:"course"}]).sort("createdAt");
        // rertut the reposen:
        return res.json({success:true,lessons,numberLessons:lessons.length});        
    }
    catch(err)
    {
        return next(err);
    }
}