import subscribersModel from "../../db/models/subscribers/subscribers.model.js";

async function getRequetsToMakeNotSeenState(requests,next)
{
    try
    {
        for(let i=0;i<requests.length;i++)
        {
            const {state}=requests[i];
            if(state=="notSeenYet")
            {
                await subscribersModel.updateOne({_id:requests[i]._id},{state:"noActionTaken"});
                console.log("yes solved");
            }
            else
            {
                continue;
            }
        }
    }
    catch(err)
    {
        return next(err);
    }
}
export default getRequetsToMakeNotSeenState;