import nodemailer from 'nodemailer';
import logError from './logError';
const sendToken = async (email: string, token: string, subject:string, link:boolean=false): Promise<void> => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
		auth: {
			// ถ้าใช้ gmail ต้องไปเปิด https://www.google.com/settings/security/lesssecureapps ให้เป็น on
			// from https://stackoverflow.com/questions/26196467/sending-email-via-node-js-using-nodemailer-is-not-working

            // เนื่องจาก google ยกเลิก less secure app จึงต้องเปลี่ยนเป็นการใช้ app password แทน
            // https://stackoverflow.com/questions/59188483/error-invalid-login-535-5-7-8-username-and-password-not-accepted
			user: process.env.NEXT_PUBLIC_EMAIL_USER, // your Gmail email address
			pass: process.env.NEXT_PUBLIC_EMAIL_PASS, // your Gmail password
		},
	});

    let mailOptions;
    if (link){
        // const verificationURL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/trpc/verified?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
        const verificationURL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/trpc/verified?input=${encodeURIComponent(JSON.stringify({ email:email,token:token }))}`;
        mailOptions = {
            from: process.env.NEXT_PUBLIC_EMAIL_USER, // sender address
            to: email, // list of receivers
            subject: "Your OTP for Verification - LearnTor", // Subject line
            text: `Verification Token: ${verificationURL} (valid for 15 minutes)`, // plain text body
            html: `<p>Click the link below to verify your account:</p>
                <a href="${verificationURL}">${verificationURL}</a>`, // HTML body with clickable link
        };
    }
    else{
        mailOptions = {
            from: process.env.NEXT_PUBLIC_EMAIL_USER, // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: `OTP : ${token} in 15 miniutes`, // plain text body
        };
    }

    transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error('Error sending verification email:', error);
            logError(error);
		} else {
			console.info('Verification email sent:', info.response);
		}
	});
};

function generateToken(): string {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

export {sendToken,generateToken};