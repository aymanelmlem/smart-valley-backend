function checkTestValidation(data,schema)
{
return (req,res,next)=>
{
    try
    {
        // hcekc on the data:
        const afterCheck=schema.validate(data);
        let errorsMessages=[];
        if(afterCheck.error)
        {
            afterCheck.error.details.forEach((ele)=>
            {
                errorsMessages.push(ele.message);
            });
            return next(new Error(errorsMessages));
        }
        return true;
    }
    catch(err)
    {
        return next(err);
    }
}
}

// this fucntion to check on the 
export function checkTestIfItWillMarkAutoOrNot(testQuestions)
{
try
{
    let auto=true;
    for(let i=0;i<testQuestions.length;i++)
    {
        if(!testQuestions[i].questionsChooses||testQuestions[i].questionsChooses.length==0)
        {
            auto=false;
        }
    }
    if(auto)
    {
        return true;
    }
    else
    {
        return false;
    }
}
catch(err)
{
    console.log("there is an error",err);
}
}

// function to chec on  the chooses and the answers:
function checkAnswersAndChoosesOptions(testQuesstionsUpdated,indexOfQuestionInTheTestQUestionsArray)
{
try
{
// first chekc on the relation between chooses and anwers:
// there is an question chooses and not have answers:
if((testQuesstionsUpdated[indexOfQuestionInTheTestQUestionsArray].questionsChooses&&testQuesstionsUpdated[indexOfQuestionInTheTestQUestionsArray].questionsChooses.length>=0)&&(!testQuesstionsUpdated[indexOfQuestionInTheTestQUestionsArray].questionAnswer||testQuesstionsUpdated[indexOfQuestionInTheTestQUestionsArray].questionAnswer.length<=0))
{
    return "check the question structure if the question have an chooses that must have an answers and ooposite  is true (the data of test not updated)";
}
// there is an answers and not have any question chooses:
if((testQuesstionsUpdated[indexOfQuestionInTheTestQUestionsArray].questionAnswer&&testQuesstionsUpdated[indexOfQuestionInTheTestQUestionsArray].questionAnswer.length>=0)&&(!testQuesstionsUpdated[indexOfQuestionInTheTestQUestionsArray].questionsChooses||testQuesstionsUpdated[indexOfQuestionInTheTestQUestionsArray].questionsChooses.length<=0))
{
    return "there is an error the question have answers and not have question (the data of test not updated)";
}
// check on the question and the chooses now also that the chooses from the question:
let allChooseNumber=[];
let chooses=[];
for(let i=0;i<testQuesstionsUpdated[indexOfQuestionInTheTestQUestionsArray].questionsChooses.length;i++)
{
allChooseNumber.push(testQuesstionsUpdated[indexOfQuestionInTheTestQUestionsArray].questionsChooses[i].chooseNumber);
chooses.push(testQuesstionsUpdated[indexOfQuestionInTheTestQUestionsArray].questionsChooses[i].choose);
}
testQuesstionsUpdated[indexOfQuestionInTheTestQUestionsArray].questionAnswer.forEach((ele)=>
{
    if(!allChooseNumber.includes(ele.chooseNumber))
    {
        return "the question answer not from the chooses that available";
    }
    if(!chooses.includes(ele.choose))
    {
        return "the question answer not from the chooses that available";
    }
});
return "all is good now";
}
catch(err)
{
    console.log("there is an error in the chekc anseering and chooses validarion",err);
}
}
export function checkRealationBetweenAnswersAndChoosesAdding(ChooseIdNew,answerNew,choosesBeforeArray,QuestionsBefore)
{
    try
    {
        // check on the exists first:
        for(let i=0;i<choosesBeforeArray.length;i++)
        {
            const {chooseId:ci,choose:chi}=choosesBeforeArray[i];
            let flagOfQuestion=false;
            if(ci.toString()==ChooseIdNew.toString()||chi==answerNew)
            {
                return "error the choose id is already exists before in the answers options";
            }
            QuestionsBefore.forEach((ele)=>
            {
                const {choose,chooseId}=ele;
                if(choose==answerNew&&chooseId.toString()==ChooseIdNew.toString())
                {
                    flagOfQuestion=true;
                }
            });
            if(!flagOfQuestion)
            {
                return "error,the answer chooses is not exists on the question or the choose not compatible with the answer id";
            }
        }
        return "all is good now";
    }
    catch(err)
    {
        console.log("there is an error in the fucntion of check the realton between the chooses and questions",err);
    }
}
// check on the updationg status:
export function checkOnTheUpdatingOptions(answerId,answerNew,ChooseIdNew,AnswersBeforeArray,questionsOptionsBeforeArray)
{
try
{
// chec iif the answer id os exists on the answers array or not:
let flagOfExistsOnAnswrs=false;
let flagOfReapitng=false;
let indexOnArray="";
for(let i=0;i<AnswersBeforeArray.length;i++)
{

    const {answerId:oldAnswerId,chooseId}=AnswersBeforeArray[i];
    if(oldAnswerId.toString()==answerId.toString())
    {
        flagOfExistsOnAnswrs=true;
        indexOnArray=i;
        if(ChooseIdNew.toString()==chooseId.toString())
        {
            flagOfReapitng=true;
            break;
        }
        break;
    }
    if(ChooseIdNew.toString()==chooseId)
    {
        flagOfReapitng=true;
        break;
    }

}
if(!flagOfExistsOnAnswrs)
{
    return "error,the answwr id you want to update is not exists in the answers";
}
if(flagOfReapitng)
{
    return "error,the answer is already exists before check on the question and chooses";
}
// check on the chooseId and the choose is exists or not:
let flagOfQuestion=false;
for(let i=0;i<questionsOptionsBeforeArray.length;i++)
{
const {choose,chooseId}=questionsOptionsBeforeArray[i];
if(choose==answerNew&&chooseId.toString()==ChooseIdNew.toString())
{
    flagOfQuestion=true;
    break;
}
}
return `all is good ,${indexOnArray}`;
}
catch(err)
{
    console.log("error,there is an error in the updating of question answer",err);
}
}
// check on the test fucntion to solve the test by the students and make all validations:
export function solveTestByStdValidation(testQuestions,eachQuestion)
{
    try
    {
        // check first on the numbers of questions if it equels or not:
        if(testQuestions.length!=eachQuestion.length)
        {
            return "error,you must answer all the test questions  all the questions are required";
        }
        // check on that all the questions are exists and solved:
        // get all the questions from the students:
        let allQuestionsIdsFromStudents=[];
        eachQuestion.forEach((ele)=>
        {
            const {questionId}=ele;
            allQuestionsIdsFromStudents.push(questionId);
        })
        let flagOfExistsOfQuestions=true;
        testQuestions.forEach((ele)=>
        {
            const {questionId}=ele;
            if(!allQuestionsIdsFromStudents.includes(questionId))
            {
                flagOfExistsOfQuestions=false;
            }
            if(!flagOfExistsOfQuestions)
            {
                return "error all the questions must be answered because all the questions are required";
            }
        });
        if(!flagOfExistsOfQuestions)
            {
                return "error all the questions must be answered because all the questions are required";
            }
        // the validation is good now and all is done successfully:
        return "yes continue";
    }
    catch(err)
    {
        return `there is an erro in the fucntion of test validation ${err}`;
    }
}
export default checkTestValidation;