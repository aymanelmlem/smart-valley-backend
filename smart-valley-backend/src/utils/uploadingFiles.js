import multer,{diskStorage} from 'multer';
function uploadingFileRequets()
{
   try
   {
    const st=diskStorage({});
    const allowedMimes = [
      'image/png', 
      'image/jpeg', 
      'image/webp', 
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'application/vnd.ms-powerpoint', 
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', 
      'application/vnd.ms-excel', 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    const multerObject=multer({storage:st,fileFilter:(req,file,cb)=>{
        if(!allowedMimes.includes(file.mimetype))
        {
          cb(new Error("The file format should be an image (.jpg, .png, .webp), PDF, Word, PowerPoint, or Excel"), false);
        }
        else{
            cb(null,true)
        }
    }});
    console.log("yes okay");
    return multerObject;
   }
   catch(err)
   {
    console.log(err);
    return next(err);
   
   }
};
export default uploadingFileRequets;