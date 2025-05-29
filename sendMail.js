
const nodemailer = require("nodemailer")

const forgotPasswordMail = async (email, token) =>{


try{
 let mailTransport = nodemailer.createTransport({
          service:"gmail",
        
        auth:{
            user:`${process.env.EMAIL}`,
            pass:`${process.env.EMAIL_PASSWORD}`
        }
    })

    const mailMessage = {
        from:`${process.env.EMAIL}`,
        to:`${email}`,
        subject:"Reset password notification",
        html: `<h1>Here is the token to reset your password, please click on the link button, 
        <a href="http://www.yourcareerex.com/reset-password/${token}>Reset Password</a>

        ${token}
        
        <h1/>`
    }

    await mailTransport.sendMail(mailMessage)

}catch(error){

    console.log(error)
}
   
}

const validEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }




module.exports = {
    forgotPasswordMail,
    validEmail
}

