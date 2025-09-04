import EventEmitter from "node:events";
import { sendTestEmail } from "../email/sendTestEmail.js";

export const emailEvent = new EventEmitter();

emailEvent.on("sendConfirmEmail", async ({ email, otp }) => {
  try {
    await sendTestEmail({ to: email, subject: "Confirm Your Email", text: `Your OTP is: ${otp}` });
  } catch (err) {
    console.log(`Email failed ${err}`);
  }
});

emailEvent.on("forgetpassword", async ({ email, otp }) => {
  try {
    await sendTestEmail({ to: email, subject: "Reset Your Password", text: `Your reset OTP is: ${otp}` });
  } catch (err) {
    console.log(`Email failed ${err}`);
  }
});
