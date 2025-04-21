import express from 'express';
import cors from 'cors';
import connectToDb from './db/connection.js';
import empRouter from './src/modules/employees/employees.routes.js';
import schedule from 'node-schedule';
import employeeModel from './db/models/employees/meployees.model.js';
import sendingEmail from './src/utils/sendEmail.js';
import categoryRouter from './src/modules/categories/catgeory.routes.js';
import userRouter from './src/modules/users/users.routes.js';
import testRouter from './src/modules/test/test.routes.js';
import dotenv from 'dotenv';

const app = express();
app.use(express.json());
app.use(cors());

// إعداد dotenv
dotenv.config();

// الاتصال بالقاعدة
await connectToDb();

// مسارات API
app.use("/employees", empRouter);
app.use("/categories", categoryRouter);
app.use("/users", userRouter);
app.use("/tests", testRouter);

// الصفحة غير موجودة
app.all("*", (req, res) => {
  return res.json({
    success: false,
    message: "the api is not found  please revise the api initialization",
  });
});

// معالج الأخطاء العامة
app.use((err,req, res,next) => {
  return res.json({
    success: false,
    message: err.message,
  });
});

// جدولة المهمة
schedule.scheduleJob("0 0 12 * * 5", async () => {
  try {
    const allUsers = await employeeModel.find({ isActivated: false });
    for (let i = 0; i < allUsers.length; i++) {
      const { email, emailCode, name } = allUsers[i];
      const sendingEmailOne = await sendingEmail({
        to: email,
        subject: "reminding for Activate your email(teachingOnlineCenter)",
        html: `<table border="0" cellpadding="0" cellspacing="0" width="100%">
        ... (HTML content) ... </table>`
      });
      if (!sendingEmailOne) {
        console.log("the email is not valid or the internet connection is not stable");
      }
    }
  } catch (err) {
    console.log(`this an error in the schedule job ${err}`);
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

