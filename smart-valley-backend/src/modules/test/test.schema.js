import joi from 'joi';


//check on the course id:

export const checkCousreId=joi.object(
{
courseId:joi.string().min(5).max(40).required(),
}).required();


//make the test wiht the questions:
export const makeTestSchema = joi.object({
    testName: joi.string().min(5).max(100).required(),
    testQuestions: joi.array().min(1).items(
      joi.object({
        question: joi.string().min(1).max(2000).required(),
        questionsChooses: joi.array().items(
          joi.object({
            chooseNumber: joi.string().min(1).max(2000).required(),
            choose: joi.string().min(1).max(3000).required(),
          }).required()
        ),
        questionPhoto: joi.string().uri().min(5).max(4000),
        questionMarks:joi.number().min(0).max(1000).required(),
        questionNote: joi.string().min(2).max(100),
        questionAnswer: joi.array().min(1).items(
          joi.object({
            choose:joi.string().min(1).max(2000).required(),
          }).required()
        )
      }).required()
    ).required(),
  }).required();
// check on the tets you want tp updaet it:
export const checkTestSchema=joi.object(
{
testId:joi.string().min(5).required(),
}).required();

// make un update on the test question o

export const makeUpdtaeOnTestQuestions=joi.object(
{
  testQuestionsModif:joi.array().min(1).items(joi.object({
    questionId:joi.string().min(5).required(),
    questionModifications:joi.object({
      questionPhoto:joi.string().uri(),
      questionPhotoOption:joi.boolean().allow(""),
      questionNote:joi.string().min(1).max(2000),
      questionMarks:joi.number().min(0).max(2000),
      question:joi.string().min(1).max(2000),
    }).unknown().required(),
  }).required().unknown()).required(),
}).required().unknown();
// question chooses for adding validation:
export const addingChoosesValidation=joi.array().min(1).items(joi.object(
{
  chooseNumber:joi.string().min(1).max(2000).required(),
  choose:joi.string().min(1).max(2000).required(),
}).required()).required();
// mak tyhe validation for the updating test questions:
export const updateTestQuestions=joi.array().min(1).items(joi.object(
{
chooseId:joi.string().min(4).max(10).required(),
chooseUpdates:joi.object(
{
chooseNumber:joi.string().min(1).max(10),
choose:joi.string().min(1).max(20),
}).required(),
}).required()).required();
//deleting any test chooses from the for deleting any choose from the test:
export const deletingTestChooses=joi.array().min(1).items(joi.object(
{
choosoeId:joi.string().min(4).max(10).required(),
}).required()).required();
// quesry tht use in the question updating:
export const testQuestionUpdatingQuery=joi.object(
{
questionChoosesOptions:joi.string().valid("adding","updating","deleting").allow(""),
answersoptions:joi.string().valid("adding","deleting","updating").allow(""),
}).required();

// adidng chooses of answers:
export const addingChoosesOfAnswersSchema=joi.array().items(joi.object(
{
  chooseId:joi.string().min(4).max(5).required(),
  choose:joi.string().min(1).max(30000).required(),
}).required()).min(1).required();
export const updateTestsAnswersOfTets=joi.array().items(joi.object(
{
  answerId:joi.string().min(4).max(5).required(),
  choose:joi.string().min(1).max(200000).required(),
  chooseId:joi.string().min(3).max(5).required(),
}).required()).min(1).required();
export const deleteChoosesTest=joi.array().min(1).items(joi.string().min(3).max(10).required()).required();
// deleett eh test:
export const checktestIdSchema=joi.object(
{
  testId:joi.string().min(5).required(),
}).required();
// solve the test schema:
export const solveTestSchema=joi.object(
{
eachQuestion:joi.array().items(joi.object(
{
questionId:joi.string().min(5).max(6).required(),
answersOfThisQuestionsChooses:joi.array().min(1).items(joi.string().min(4).max(7).required()),
answerOfQuestionNotMcq:joi.string().min(1).max(1200000),
}).required()).min(1).required(),
}).required();
// get the test for the ins with filters:
export const testsForInsSchema=joi.object(
{
course:joi.string().allow(""),
examName:joi.string().min(1).allow(""),
}).required();
export const getResultForInsWIthFiltersOptions=joi.object(
{
  finalResult:joi.string().valid("true","false").allow(""),
}).required();
export const checkOnResultId=joi.object(
{
  resultId:joi.string().min(5).required(),
}).required();
export const markEssayQuestionSchema=joi.object(
{
resultsOfEssayQuestions:joi.array().min(1).items(joi.object(
{
  questionId:joi.string().min(4).max(7).required(),
  state:joi.string().valid("trueQuestion","falseQuestion").required(),
}).required()).required(),
}).required();
export const getResultsOptions=joi.object(
{
filter:joi.string().valid("underMarking","marked").allow("").required(),
}).required();
export const checkCourseId=joi.object(
{
  courseId:joi.string().min(5).max(30).required(),
}).required();
export const getWithFIlterOptionsForCourse=joi.object(
{
examName:joi.string().min(1).allow(""),
}).required();

export const getSpRes=joi.object({
  resId:joi.string().min(5).max(40).required(),
}).required();

export const checkExamId=joi.object(
{
examId:joi.string().min(5).required(),
}).required();