import { nanoid } from "nanoid";
import courseModel from "../../../db/models/courses/courses.model.js";
import testModel from "../../../db/models/tests/tests.model.js";
import checkTestValidation, { checkOnTheUpdatingOptions, checkRealationBetweenAnswersAndChoosesAdding, checkTestIfItWillMarkAutoOrNot, solveTestByStdValidation } from "./tests.fucntions.js";
import { addingChoosesOfAnswersSchema, addingChoosesValidation, deleteChoosesTest, deletingTestChooses, updateTestQuestions, updateTestsAnswersOfTets } from "./test.schema.js";
import participntsModel from "../../../db/models/participnts/partcipints.model.js";
import resultsModel from "../../../db/models/results/results.model.js";
import { Error } from "mongoose";

// make the test controller:
export const makeNewTest=async (req,res,next)=>
{
    try 
    {
        // egt the id ogf the ins:
        const {_id}=req.data;
        // get the id of the course:
        const {courseId}=req.params;
        // chekc the realtion bwteeen the ins and the course:
        const course=await courseModel.findOne({_id:courseId});
        if(!course)
        {
            return next(new Error("checl the id of the course the cousre is not exists"));
        }
        // hcekc on the realtion bwtween the ins and the course:
        if(course.instructor.toString()!=_id.toString())
        {
            return next(new Error("you are not the owner of this course to make any action on it"));
        }
        // now get the data of the test:
        let data=req.body;
        // check on all the cases now and make the changes:
        // now we will check i the same cousre have the same name or not:
        const getTest=await testModel.findOne({forCourse:courseId,testName:data.testName});
        if(getTest)
        {
            return next(new Error("this test with the same name has already exists before"));
        }
        data.forCourse=courseId;
        // male th eid for each question:
        data.testQuestions.forEach((ele)=>
        {
            ele.questionId=nanoid(5);
        });
        data.autoCorrectOrNot=true;
        // we must chekc if the anwers are exist  we will check that the answer and that number are already exists or not(important and check on the answer and chooses number and choose text):
        for(let i=0;i<data.testQuestions.length;i++)

        {
            const {questionsChooses,questionAnswer}=data.testQuestions[i];
            if(questionsChooses)
            {
                if(questionsChooses.length>0)
                {
                    let choosesIdsWithAllOfIt=[]
                    // we must make an id for each choose option:
                    for(let j=0;j<questionsChooses.length;j++)
                    {                        
                        // we will make an id for each choose:
                        let id=nanoid(5);
                        data.testQuestions[i].questionsChooses[j].chooseId=id;
                       let objectOfQuestion={id,chooseName:data.testQuestions[i].questionsChooses[j].choose};
                       choosesIdsWithAllOfIt.push(objectOfQuestion);
                    }
                    // now we will check on the if the answer of quetion  exists or not:
                    if(!questionAnswer||questionAnswer.length<=0)
                    {
                        return next(new Error("sorry,when you add an questionsChooses you must add an answer to it"));
                    }
                    // loop on it on the question chooses and get the choose number and other:
                    questionAnswer.forEach((ele2)=>
                        {
                            const {choose}=ele2;
                            let flag=false;
                            choosesIdsWithAllOfIt.forEach((ele3)=>
                            {
                                const {id,chooseName}=ele3;
                                if(chooseName==choose)
                                {
                                    flag=true;
                                    ele2.chooseId=id;
                                }
                            });
                            if(!flag)
                            {
                                return next(new Error("you must choose the answer from the chooses you make only"))
                            }
                            ele2.answerId=nanoid(5);
                        });
                        data.testQuestions[i].questionAnswer=questionAnswer;
                        console.log("yes or no i'm good")
                }                
            }
            else
            {
                data.autoCorrectOrNot=false;
            }
        }
        // make the test in the db:
        await testModel.create(data);
        // return the response:
        return res.json({success:true,message:"the test is maked sucessfully"});
    }
    catch(err)
    {
        return next(err);
    }
}
// updaet the test data:
export const updateTestData=async (req,res,next)=>
{
    try
    {
        // get the id of the test:
        const {testId}=req.params;
        // get the id of the ins:
        const {_id}=req.data;
        // check the test is it ecists:
        const testData=await testModel.findOne({_id:testId}).populate([{path:"forCourse"}]);
        if(!testData)
        {
            return next(new Error("the test is not exists check the id of the test and try again"));
        }
        // cehck the authority of the ins and the tester:
        if(testData.forCourse.instructor.toString()!=_id.toString())
        {
            return next(new Error("you can't make any update or modification on this test because you are not the owener of this test"));
        }
        // egt the data of  the test previous:
        const {testQuestions}=testData;
        // get the data of update:
        const dataUpdate=req.body;
        // chekc on the every fields first:
        const {testQuestionsModif}=dataUpdate;
        if(testQuestionsModif)
        {
            if(testQuestionsModif.length>0)
            {
                // loop on the array and make the modifications:
                testQuestionsModif.forEach((ele)=>
                {
                    const {questionId,questionModifications}=ele;
                    let flagOfIdExists=false;
                    // we now have the first object with two fields one fro the id and one for question modifications:
                    // first we will chekc on the question id:
                    let indexOfEleemntOnTheArray="";
                    testQuestions.forEach((ele2,indexOnArrayOfQuestion)=>
                    {
                        if(ele2.questionId.toString()===questionId.toString())
                        {
                            flagOfIdExists=true;
                            indexOfEleemntOnTheArray=indexOnArrayOfQuestion;
                        }
                    });
                    if(!flagOfIdExists)
                    {
                        return next(new Error("check the id of question because it is not correct"));
                    }
                    // hcekc on the index first also:
                    if(!indexOfEleemntOnTheArray&&indexOfEleemntOnTheArray!=0)
                    {
                        return next(new Error("there is an eror in the logic and index of question"));
                    }
                    // check for the data that will update:
                    // check first for the question photo:
                    const {questionPhoto}=questionModifications;
                    // chek cfotr the option sof delete aslo:
                    const {questionPhotoOption}=questionModifications;
                    if(questionPhotoOption||questionPhotoOption==true)
                    {
                       
                            // check for the photo if it exists or not:
                            if(testQuestions[indexOfEleemntOnTheArray].questionPhoto)
                            {
                                testQuestions[indexOfEleemntOnTheArray].questionPhoto="";
                                questionPhoto="";
                            }
                            else
                            {
                                return next(new Error("there is no eror to the question to delete it"))
                            }
                    }
                    if(questionPhoto)
                    {
                            testQuestions[indexOfEleemntOnTheArray].questionPhoto=questionPhoto;
                    }
                    // check now for the question marks:
                    const {questionNote}=questionModifications;
                    if(questionNote)
                    {
                        testQuestions[indexOfEleemntOnTheArray].questionNote=questionNote;
                    }
                    // chekc also for the question notes:
                    const {questionMarks}=questionModifications;
                    if(questionMarks)
                    {
                        testQuestions[indexOfEleemntOnTheArray].questionMarks=questionMarks;
                    }
                    // check for the question only:
                    const {question}=questionModifications;
                    if(question)
                    {
                        testQuestions[indexOfEleemntOnTheArray].question=question;
                    }
                    // check for th ethers of the question chooses:
                    const {questionsChooses}=questionModifications;
                    if(questionsChooses)
                    {
                            // check on the options if it exists or not:
                            const {questionChoosesOptions}=req.query;
                            if(!questionChoosesOptions)
                            {
                                return next(new Error("you must send the testQuestion options in the query"));
                            }
                            if(questionChoosesOptions=="adding")
                            {
                                // make the validation for adding:
                                const getVal=checkTestValidation(questionsChooses,addingChoosesValidation);
                                const afetrVal=getVal(req,res,next);
                                if(afetrVal)
                                {
                                    // loop on the chooses:
                                    for(let i=0;i<testQuestions.length;i++)
                                    {
                                        testQuestions[i].chooseId=nanoid(5);
                                        testQuestions[indexOfEleemntOnTheArray].push(testQuestions[i]);
                                    }
                                }
                                else
                                {
                                    return next(new Error("there is an error in the validation of test questionn chooses"));
                                }
                                // make the logic for all the elemtts on the same ques:
                            }
                            else if(questionChoosesOptions=="updating")
                            {
                                // make the validation on the questionsChooses:
                                const getVal=checkTestValidation(questionsChooses,updateTestQuestions);
                                const getRes=getVal(req,res,next);
                                if(getRes)
                                {
                                    //make the logic:
                                    for(let i=0;i<questionsChooses.length;i++)
                                    {
                                        // loop on each chooses and mae the logic:
                                        let flagIndexExist=false;
                                        const {chooseId,chooseUpdates}=questionsChooses[i];
                                        for(let j=0;j<testQuestions[indexOfEleemntOnTheArray].questionsChooses.length;j++)
                                        {
                                            if(testQuestions[indexOfEleemntOnTheArray].questionsChooses[j].chooseId.toString()==chooseId.toString())
                                            {
                                                flagIndexExist=true;
                                                // make the logic then break:
                                                const {chooseNumber,choose}=chooseUpdates;
                                                if(chooseNumber)
                                                {
                                                    testQuestions[indexOfEleemntOnTheArray].questionsChooses[j].chooseNumber=chooseNumber;
                                                }
                                                if(choose)
                                                {
                                                    testQuestions[indexOfEleemntOnTheArray].questionsChooses[j].choose=choose;
                                                }
                                                break;
                                            }
                                        }
                                        if(!flagIndexExist)
                                        {
                                            return next(new Error("the question chooses id is not exists check the id of choose and try again"));
                                        }
                                    }
                                }
                                else
                                {
                                    return next(new Error("the testChooses updating not valid check the structure of send"));
                                }
                            }
                            else if(questionChoosesOptions=="deleting")
                            {
                                // make the validation on the questionsChooses:
                                const getValidationForDelete=checkTestValidation(questionsChooses,deletingTestChooses);
                                const getResOfVal=getValidationForDelete(req,res,next);
                                if(getResOfVal)
                                {
                                    // make the logic of it:
                                    for(let i=0;i<questionsChooses.length;i++)
                                    {
                                        const {choosoeId}=questionsChooses[i];
                                        let arrayOfIndexesThatWillDelete=[];
                                     testQuestions[indexOfEleemntOnTheArray].questionsChooses=testQuestions[indexOfEleemntOnTheArray].questionsChooses.filter((ele3)=>
                                        {
                                          if(ele3.chooseId.toString()!=choosoeId.toString())
                                          {
                                            return ele3;
                                          }
                                        });
                                    }
                                }
                                else
                                {
                                    return next(new Error("there is an error on deleting the the chooses val"));
                                }
                                // make the logic and make an update on the choose:
                            }
                            else
                            {
                                return next(new Error("the questionChoosesOptions must be one ot it (adding,updating,deleting)"));
                            }

                    }
                    // check on the answers object if it exists to maek the modifications:
                    // choose now on the answers if it have an modification:
            const {answerChooses}=questionModifications;
            if(answerChooses)
            {
                if(answerChooses.length>0)
                {
                    const {answersoptions}=req.query;
                    if(answersoptions)
                    {
                        if(answersoptions=="adding")
                        {
                            // check and make validation on it first:
                            const getAfetrVal=checkTestValidation(answerChooses,addingChoosesOfAnswersSchema);
                            const getRes=getAfetrVal(req,res,next);
                            if(getRes)
                            {
                                for(let j=0;j<answerChooses.length;i++)
                                {
                                    const {chooseId,choose}=answerChooses[j];
                                   let resultAfterFun=checkRealationBetweenAnswersAndChoosesAdding(chooseId,choose,testQuestions[indexOfEleemntOnTheArray].questionAnswer,testQuestions[indexOfEleemntOnTheArray].questionsChooses);
                                   if(resultAfterFun=="all is good now")
                                   {
                                    // make the id for the answer:
                                    const makeId=nanoid(5);
                                    answerChooses[j].answerId=makeId;
                                    testQuestions[indexOfEleemntOnTheArray].questionAnswer.push(answerChooses[j]);
                                   }
                                   else
                                   {
                                    return next(new Error(resultAfterFun))
                                   }
                                }
                            }
                            else
                            {
                                return next(new Error("the answer chooses validation is not true"));
                            }
                        }
                        else if(answersoptions=="updating")
                        {
                            //check on the answer and check on the ohters:
                            const getVal=checkTestValidation(answerChooses,updateTestsAnswersOfTets);
                            const getAdter=getVal(req,res,next);
                            if(getAdter)
                            {
                                for(let i=0;i<answerChooses.length;i++)
                                {
                                    const {answerId,choose,chooseId}=answersoptions[i];
                                    const getresult=checkOnTheUpdatingOptions(answerId,choose,chooseId,testQuestions[indexOfEleemntOnTheArray].questionAnswer,testQuestions[indexOfEleemntOnTheArray].questionsChooses);
                                    if(getresult.startsWith("error"))
                                    {
                                        return next(new Error(getresult))
                                    }
                                    else
                                    {
                                        const index=+getresult.split(",")[1];
                                        testQuestions[indexOfEleemntOnTheArray].questionAnswer[index].chooseId=chooseId;
                                        testQuestions[indexOfEleemntOnTheArray].questionAnswer[index].choose=choose;
                                    }
                                }
                            }
                            else
                            {
                                return next(new Error("the test answers update not true of validation"));
                            }
                        }
                        else if(answersoptions=="deleting")
                        {
                            // validation on the delting options of the :
                            const getVal=checkTestValidation(answerChooses,deleteChoosesTest);
                            // make the updating o fthe lemtts:
                            const getRes=getVal(req,res.next);
                            if(getRes)
                            {
                                let indexes=[];
                                for(let i=0;i<answerChooses.length;i++)
                                {
                                    for(let j=0;j<testQuestions[indexOfEleemntOnTheArray].questionAnswer.length;j++)
                                    {
                                        const {answerId}=testQuestions[indexOfEleemntOnTheArray].questionAnswer[j];
                                        if(answerId.toString()==answerChooses[i].toString())
                                        {
                                            indexes.push(j);
                                        }
                                    }
                                }
                                testQuestions[indexOfEleemntOnTheArray].questionAnswer=testQuestions[indexOfEleemntOnTheArray].questionAnswer.filter((ele,index)=>
                                    {
                                        if(!indexes.includes(index))
                                        {
                                            return ele;
                                        }
                                    });
                            }
                    
                            else
                            {
                                return next(new Error(getRes));
                            }
                        }
                    }
                    else
                    {
                        return next(new Error("the answers options must be exists to know what action we will take"))
                    }
                }
                else
                {
                  // we nmust check f the question if it have question chooses it have answers and the answers must be from the question chooses (very im[portnat check):
                }
            }
            else
            {
                // we nmust check f the question if it have question chooses it have answers and the answers must be from the question chooses (very im[portnat check):
            }
                })
            }
            else
            {
                return next(new Error("there is no question updated because you are not making any change on any question"))
            }
            // make the modificartions:
            const getRes=checkTestIfItWillMarkAutoOrNot(testQuestions);
            let updateFinal=await testModel.findOneAndUpdate({_id:testId},{testQuestions,autoCorrectOrNot:getRes}).populate([{path:'forCourse'}]);
            return res.json({success:true,message:"the teste is updated sucessfully",test:updateFinal})
        }
        else
        {
            return next(new Error("sending the data on the body is not true"));
        }
    }
    catch(err)
    {
        return next(err);
    }
}
// deleet the test:
export const deleteTest=async (req,res,next)=>
{
    try
    {
        // get the id of the user:
        const {_id}=req.data;
        // get the id of the test:
        const {testId}=req.params;
        // check on the test and the relation between the test and the user:
        const test=await testModel.findOne({_id:testId}).populate([{path:"forCourse",populate:[{path:"instructor"}]}]);
        if(!test)
        {
            return next(new Error("there is no test by this id chekc the id of the test and try again"));
        }
        console.log(_id)
        console.log(test.forCourse.instructor.toString());
        // chekc the realtion:
        if(_id.toString()!=test.forCourse.instructor._id.toString())
        {
            return next(new Error("you can't delete this test because you are not the owener of this test"));
        }
        // delete the test document from the model:
        await test.deleteOne();
        await resultsModel.deleteMany({test:testId});
        // retur the resposne:
        return res.json({success:true,message:"the test is deleted successfully"});
    }
    catch(err)
    {
        return next(err);
    }
}
// solve the test controller:
export const solveTestSchema=async (req,res,next)=>
    {
      try
      {
        // get the user id fisrt:
        const {_id}=req.data;
        // get the test id:
        const {testId}=req.params;
        // get the test course:
        // check if the test is exists fisrt or not:
        const test=await testModel.findOne({_id:testId});
        if(!test)
        {
            return next(new Error("the test is not exists check the testId and try"));
        }
        // chekc of the students is an participnts on this cousre or not:
        const userPartcipints=await participntsModel.findOne({user:_id,course:test.forCourse});
        if(!userPartcipints)
        {
            return next(new Error("you must be first join to this course first to be able to solve the test and watch all the course resources"));
        }
        // check on the user if  he take this test before:
        const getResults=await resultsModel.findOne({student:userPartcipints._id,test:testId});
        if(getResults)
        {
            return next(new Error("you can't take this test again because you are already take this before"));
        }
        // get the test qeistions fisrt:
        const {testQuestions}=test;
        // get the students questions and answers:
        const {eachQuestion}=req.body;
        // calling the fucntion of validation:
        const resultOfValidation=solveTestByStdValidation(testQuestions,eachQuestion);
        if(resultOfValidation!="yes continue")
        {
            return next(new Error(`${resultOfValidation}`));
        }
        // continue to make the result and check on the answers and others:
        let restOfQuestions=[];
        let studentMarks=0;
        let finalResult=true;
        let totalMarksOfTest=0;
        let correctAnswers=[];
        let wrongAnswers=[];
        // loop on each question:
        for(let i=0;i<testQuestions.length;i++)
        {
            console.log("there is the question");
            const {question,questionMarks,questionId:questionIdOriginal,questionAnswer,questionsChooses}=testQuestions[i];
            totalMarksOfTest+=questionMarks;
            // make loop to get the stident answer to this questions:
            for(let j=0;j<eachQuestion.length;j++)
            {
                const {questionId,answersOfThisQuestionsChooses,answerOfQuestionNotMcq}=eachQuestion[j];
               
                if(questionIdOriginal.toString()==questionId.toString())
                {
                    console.log("i found it");
                    if(questionAnswer&&questionAnswer.length>0)
                    {
                        if(questionAnswer.length>0)
                        {
                            console.log("i enter there");
                            if(questionAnswer.length>1)
                            {
                                // multible answers:
                                console.log("final final")
                                if(questionAnswer.length==answersOfThisQuestionsChooses.length)
                                {
                                    console.log("one option");
                                    let flagOfTrue=true;
                                    for(let k=0;k<questionAnswer.length;k++)
                                    {
                                        if(!answersOfThisQuestionsChooses.includes(questionAnswer[k].chooseId.toString()))
                                        {
                                            flagOfTrue=false;
                                        }
                                    }
                                    if(flagOfTrue)
                                    {
                                        studentMarks+=questionMarks;
                                        correctAnswers.push({question,questionMarks,questionIdOriginal,questionAnswer,questionsChooses,answersOfThisQuestionsChooses})
                                    }
                                    else
                                    {
                                        wrongAnswers.push({question,questionMarks,questionIdOriginal,questionAnswer,questionsChooses,answersOfThisQuestionsChooses});
                                        console.log(wrongAnswers);
                                        console.log("there is an wrong answer");
                                        console.log("there is an error question chooses i make now");
                                    }
                                }
                                else
                                {
                                    // the answer is not true;
                                    console.log("option two")
                                    console.log("there is an erorr answer");
                                    console.log("final final")
                                    wrongAnswers.push({question,questionMarks,questionIdOriginal,questionAnswer,questionsChooses,answersOfThisQuestionsChooses});
                                }
                            }
                            else
                            {
                                // one answer:
                                if(questionAnswer.length==answersOfThisQuestionsChooses.length&&questionAnswer.length==1&&answersOfThisQuestionsChooses.length==1)
                                 {
                                    if(questionAnswer[0].chooseId.toString()==answersOfThisQuestionsChooses[0].toString())
                                    {
                                        studentMarks+=questionMarks;
                                        correctAnswers.push({question,questionMarks,questionIdOriginal,questionAnswer,questionsChooses,answersOfThisQuestionsChooses})
                                    }
                                    else
                                    {
                                        wrongAnswers.push({question,questionMarks,questionIdOriginal,questionAnswer,questionsChooses,answersOfThisQuestionsChooses})
                                        console.log("there is an wrong answer");
                                    }
                                 }
                                 else
                                 {
                                    wrongAnswers.push({question,questionMarks,questionIdOriginal,questionAnswer,questionsChooses,answersOfThisQuestionsChooses})
                                    console.log("there is an wrong answer");
                                 }
                            }
                        }
                    }
                    else
                    {
                        // this is an essay question:
                        finalResult=false;
                        // push the question in the array of essay questions:
                        // make th eibject of the question:
                        let objectOfEssayQuestion={};
                        objectOfEssayQuestion.question=question;
                        objectOfEssayQuestion.mark=questionMarks;
                        objectOfEssayQuestion.studentAnswer=answerOfQuestionNotMcq;
                        objectOfEssayQuestion.questionId=questionIdOriginal;
                        restOfQuestions.push(objectOfEssayQuestion);
                        console.log(restOfQuestions);
                    }
                }
                else
                {
                    continue;
                }
            }
        }
        // make the logic based on the final result:
        if(finalResult)
        {
            console.log(wrongAnswers);
            console.log(correctAnswers);
            // make the logic for if this is the final result:
            // save the docuemnt of the test in the results and save the correct answers and wrong answers:
            await resultsModel.create({student:userPartcipints._id,test:testId,finalResult:true,questionOfTest:testQuestions,studentsAnswers:eachQuestion,totalMarksOfTest:totalMarksOfTest,studentMarks:`${studentMarks}/${totalMarksOfTest}`,wrongAnswers,correctAnswers,abilityToseen:"marked"});
            // return  the resposne:
            return res.json({success:true,message:`you sucessfully finished the exam your results is: ${studentMarks}/${totalMarksOfTest}`});
        }
        else
        {
            // make the logic if it not final result and there is an asssay question not marked yet:
            await resultsModel.create({student:userPartcipints._id,test:testId,finalResult:false,questionOfTest:testQuestions,studentsAnswers:eachQuestion,totalMarksOfTest:totalMarksOfTest,studentMarks:`${studentMarks}/${totalMarksOfTest}`,wrongAnswers,correctAnswers,restOfQuestions:restOfQuestions,abilityToseen:"underMarking"});
            // return the response:
            return res.json({success:true,message:"you successfully finished the exam wait for the result the exam will marked then the result will send to you"})
        }
      }
      catch(err)
      {
        return next(err);
      }
    }   
// get all test for the suepr admin or instructor:
export const getTestsForSuperAdmin=async (req,res,next)=>
{
    try
    {
        // egt the id of the super admi or ins:
        const {_id}=req.data;
        // get the filters options:
        const filterData=req.query;
        // get all the ins courses:
        console.log("i'm here");
        const allCoursesForThisIns=await courseModel.find({instructor:_id});
        if(allCoursesForThisIns.length==0)
        {
            return next(new Error("you not have any courses for get the test of it"));
        }
        // get  all the courses id's for this ins:
        let coursesIdsWithObjectId=[];
        let coursesIdsWithOutObjectId=[];
        allCoursesForThisIns.forEach((ele)=>
        {
            const {_id}=ele;
            coursesIdsWithObjectId.push(_id.toString());
            coursesIdsWithOutObjectId.push(_id);
        });
        let ifFilter=false;
        const objectGetFormMap=new Map(Object.entries(filterData));
        objectGetFormMap.forEach((value,key)=>
        {
            if(value)
            {
                ifFilter=true;
            }
        });
        if(Object.keys(filterData).length==0)
        {
            const getTests=await testModel.find({forCourse:{$in:coursesIdsWithObjectId}}).sort("createdAt updatedAt");
            return res.json({success:true,tests:getTests,numberOfTests:getTests.length});
        }
        if(!ifFilter)
        {
            const getTests=await testModel.find({forCourse:{$in:coursesIdsWithOutObjectId}}).sort("createdAt updatedAt");
            return res.json({success:true,tests:getTests,numberOfTests:getTests.length});
        }
        let objectFilter={};
        if(filterData.course)
        {
           // cehck if this course is rrelated to the ins:
           if(coursesIdsWithOutObjectId.includes(filterData.course))
           {
            objectFilter.forCourse=filterData.course;
           }
           else
           {
            return next(new Error("the course you want to get it's tests not available for you because you are not the owner of it"));
           }
        }
        if(filterData.examName)
        {
          objectFilter.testName={$regex:filterData.examName,$options:"i"};
        }
        if(objectFilter.forCourse)
        {
            const getTests=await testModel.find(objectFilter).populate([{path:"forCourse"}]);
            return res.json({success:true,tests:getTests,numberOfTests:getTests.length})
        }
        else
        {
            const getTests=await testModel.find({forCourse:{$in:coursesIdsWithObjectId},...objectFilter}).populate([{path:"forCourse"}]);
            return res.json({success:true,tests:getTests,numberOfTests:getTests.length});
        }
    }
    catch(err)
    {
        return next(err);
    }
}
// get the spercifire test data:
export const getSpecefiecTestData=async (req,res,next)=>
{
    try
    {
        // get the id of the ins:
        const {_id}=req.data;
        // get the id of test:
        const {testId}=req.params;
        const test=await testModel.findOne({_id:testId}).populate([{path:"forCourse"}]);
        if(!test)
        {
            return next(new Error("the test is not exists check the id and try again"));
        }
        if(test.forCourse.instructor.toString()!=_id.toString())
        {
            return next(new Error("you can't access this data of course because you are not the owner of this course"));
        }
        // return the response:
        return res.json({success:true,test});
    }
    catch(err)
    {
        return next(err);
    }
}
// get all the not final result for specefiec tests with all filters options:
export const getTestsResultForIns=async (req,res,next)=>
{
    try
    {
        // egt the idof the ins:
        const {_id}=req.data;
        //get the id of the test:
        const {testId}=req.params;
        // get the filters options:
        const dataFilter=req.query;
        // cehck if the test is related to the ins:
        const test=await testModel.findOne({_id:testId}).populate([{path:"forCourse"}]);
        if(!test)
        {
            return next(new Error("there is no test by this id check the id and try again"));
        }
        if(test.forCourse.instructor.toString()!=_id.toString())
        {
            return next(new Error("sorry you can't watch the results of this test because you are not the owner of this test"));
        }
        // check on the filters options:
        const {finalResult}=dataFilter;
        if(!finalResult&&finalResult!=false&&finalResult!=0)
        {
            // egt all the results of this test:
            const results=await resultsModel.find({test:testId}).populate([{path:"test"},{path:"student",populate:[{path:"user"}]}]).sort("createdAt");
            return res.json({success:true,results,numberOfStdTakeTest:results.length});
        }
        else
        {
            if(finalResult=="true")
            {
                const results=await resultsModel.find({test:testId,finalResult:true}).populate([{path:"test"},{path:"student",populate:[{path:"user"}]}]).sort("createdAt");
                return res.json({success:true,results,numberOfStdTakeTest:results.length});
            }
            else if(finalResult=="false")
            {
                const results=await resultsModel.find({test:testId,finalResult:false}).populate([{path:"test"},{path:"student",populate:[{path:"user"}]}]).sort("createdAt");
                return res.json({success:true,results,numberOfStdTakeTest:results.length});
            }
            else
            {
                const results=await resultsModel.find({test:testId}).populate([{path:"test"},{path:"student",populate:[{path:'user'}]}]).sort("createdAt");
                return res.json({success:true,results,numberOfStdTakeTest:results.length});
            }
        }
   
    }
    catch(err)
    {
        return next(err);
    }
}
// mark the test by the ins or superadmin:
export const markEssayQuestion=async (req,res,next)=>
{
    try
    {
        // get the id of the ins:
        const {_id}=req.data;
        // egt the id of the result he want to continue mark it:
        const {resultId}=req.params;
        // check if it exists:
        const result=await resultsModel.findOne({_id:resultId}).populate([{path:"test",populate:[{path:"forCourse"}]}]);
        if(!result)
        {
            return next(new Error("the results or the test you wants to update or mark not exists check the id and try"));
        }
         // check if the results realted to this ins or not:
        if(result.test.forCourse.instructor.toString()!=_id.toString())
        {
            return next(new Error("sorry you can't mark this test because you are not the owner of this test and course"));
        }
        // check if the results will marked or not:
        if(result.finalResult)
        {
            return next(new Error("the test is automatically marked and the results produces automatically (there is no essay question to mark)"));
        }
        // check on the  questions and marks of it:
        let  {restOfQuestions,totalMarksOfTest,studentMarks,correctAnswers,wrongAnswers}=result;
        let studentMarkAfterHandle=+studentMarks.split("/")[0];
        let  {resultsOfEssayQuestions}=req.body;
        if(restOfQuestions.length!=resultsOfEssayQuestions.length)
        {
            return next(new Error(`you must mark all the essay questions that which is:${restOfQuestions.length}`));
        }
        for(let i=0;i<restOfQuestions.length;i++)
        {
            let {questionId:questionIdOrginal,mark,question,studentAnswer}=restOfQuestions[i];
            let flagExists=false;
            for(let j=0;j<resultsOfEssayQuestions.length;j++)
            {
                let  {questionId,state}=resultsOfEssayQuestions[j];
                if(questionIdOrginal.toString()==questionId.toString())
                {
                    flagExists=true;
                }
                if(state=="trueQuestion")
                {
                    studentMarkAfterHandle+=mark;
                    // add this in the correct answers:question,questionMarks,questionIdOriginal,questionAnswer,questionsChooses,answersOfThisQuestionsChooses
                    correctAnswers.push({question,mark,questionIdOriginal:questionIdOrginal,questionAnswer:studentAnswer});
                }
                else if(state=="falseQuestion")
                {
                    // add this in the false questions:
                    wrongAnswers.push({question,mark,questionIdOriginal:questionIdOrginal,questionAnswer:studentAnswer});
                }
                else
                {
                    return next(new Error("send one from this value only to mark the question: trueQuestion or falseQuestion"));
                }
            }
            if(!flagExists)
            {
                return next(new Error("check all the question id you are send becuse all the question is required"));
            }
        }
        // update the data in the results:
       let newResult= await resultsModel.findOneAndUpdate({_id:resultId},{restOfQuestions,totalMarksOfTest,correctAnswers,wrongAnswers,studentMarks:`${studentMarkAfterHandle}/${totalMarksOfTest}`,finalResult:true,abilityToseen:"marked"},{new:true}).populate([{path:"student",populate:[{path:"user"}]},{path:"test"}]);
       // returnt the response:
       return res.json({success:true,message:"the test is marked sucessfully",newResult});
    }
    catch(err)
    {
        return next(err);
    }
}
// متنساش تحدث seen وتطلع تظبطها يعني يا معلم بحيث اني ابعتها يعني ولا لا 
// ومتنساش تعمل ان هو مينفعش يمتحن اكتر من مره نفس الامتحان 

// get the results for the students that now marked or final marked:
export const getMarksForStudets=async (req,res,next)=>
{
    try
    {
        // egt the id of the user:
        const {_id}=req.data;
        // get the filter of options:
        const {filter}=req.body;
        let results;
        if(filter=="underMarking")
        {
            results=await resultsModel.find({student:_id,abilityToseen:"underMarking"}).populate([{path:'student'},{path:"test"}]);
            return res.json({success:true,results});
        }
        else if(filter=="marked")
        {
            results=await resultsModel.find({student:_id,abilityToseen:"marked"}).populate([{path:'student'},{path:"test"}]);
            return res.json({success:true,results});
        }
        else
        {
            results=await resultsModel.find({student:_id}).populate([{path:"student"},{path:"test"}]);
            // retur the resposne:
            return res.json({success:true,results});
        }
    }
    catch(err)
    {
        return next(err);
    }
}
// get the tests with the course plan:
export const getTheTestsThatRelatedToSpCourse=async (req,res,next)=>
{
    try
    {
        // get the id of the cousre:
        const {courseId}=req.params;
        // egt the testv realted to this course:
        const tests=await testModel.find({forCourse:courseId});
        const dataFIlter=req.query;
        const getObjectMap=new Map(Object.entries(dataFIlter));
        let flagOfFIlter=true;
        getObjectMap.forEach((value,key)=>
        {
            if(!value)
            {
                flagOfFIlter=false;
            }
        });
        if(flagOfFIlter)
        {
            const tests=await testModel.find({forCourse:courseId,testName:{$regex:dataFIlter.examName,$options:"i"}}).populate([{path:"forCourse"}]);
            return res.json({success:true,courseTests:tests});
        }
        // retur the  resposne:
        return res.json({success:true,courseTests:tests});
    }
    catch(err)
    {
        return next(err);
    }
}
// get the test data to the students: 
export const getTestDataToStdToSolve=async (req,res,next)=>
{
    try
    {
        // get the id of the std:
        const {_id}=req.data;
        // eg the id of test:
        const {testId}=req.params;

        // check if the test is exists or not:
        const test=await testModel.findOne({_id:testId});
        if(!test)
        {
            return next(new Error("the test is not exist check the id and try again"));
        }
        // check if the user is subscribe at the course that test realted to or not:
        const getSub=await participntsModel.findOne({user:_id,course:test.forCourse});
        if(!getSub)
        {
            return next(new Error("you can't access this test because you are not have this course or subscribe to it"));
        }
        // check if the user alreafy take this test before or not:
        const resultExists=await resultsModel.findOne({student:getSub._id,test:testId});
        if(resultExists)
        {
            return res.json({success:true,testData:test,takenThisTestBfore:true});
        }
        // return the response:
        return res.json({success:true,testData:test,takenThisTestBfore:false});
    }
    catch(err)
    {
        return next(err);
    }
}
// gte the specefiec result to the user:
export const getSpRseToStdController=async (req,res,next)=>
{
    try
    {
        // begt the id of the user:
        const {_id}=req.data;
        // get the id of the res:
        const {resId}=req.params;
        // chec the result:
        const result=await resultsModel.findOne({_id:resId}).populate([{path:"student",populate:[{path:"user"}]},{path:"test"}]);
        if(!result)
        {
            return next(new Error("check the id of the result you want to get"));
        }
        if(result.student.user._id.toString()!=_id.toString())
        {
            return next(new Error("you can't get this result because you are not the owner of this result"));
        }
        return res.json({success:true,result:result});
    }
    catch(err)
    {
        return next(err);
    }
}
// get the examresult by the ecxam id:
export const getResByExamToUser=async (req,res,next)=>
{
    try
    {
        // eg the id of the user:
        const {_id}=req.data;
        // get the id of he exam he wan tto get it's res:
        const {examId}=req.params;
        // ceonst chekc on the exam:
        const exam=await testModel.findOne({_id:examId});
        if(!exam)
        {
            return next(new Error("the exam is not exists check the id and try again"));
        }
        // check on if he is particpints or not:
        const getParticipnts=await participntsModel.findOne({user:_id,course:exam.forCourse});
        console.log(getParticipnts);
        if(!getParticipnts)
        {
            return next(new Error("you are not subscribe to this course to solve the exam or get the ressult of the exam"));
        }
        // check the result and send it:
        const results=await resultsModel.findOne({student:getParticipnts._id,test:examId}).populate([{path:'student',populate:[{path:"user"}]},{path:'test'}]);
        if(!results)
        {
            return next(new Error("you are not take this exam before to get the result of it"));
        }
        return res.json({success:true,result:results});
    }
    catch(err)
    {
        return next(err);
    }
}
// if you delet the test deletth eresults of this test(final);

