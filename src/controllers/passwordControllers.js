import crypto from 'crypto';
import nodemailer from 'nodemailer'; //para enviar msj al mail

const userGmail = 'emailtest11.2024@gmail.com'
const passAppGmail = "cthe uadu gkbx ozpz"; 



let users = [
    {
        email: 'jlangiolini@gmail.com', resetToken: null, resetTokenExp: null
    }
]

//'micaelaangiolini@gmail.com'

//configuracion del transporte de Nodemailer 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: userGmail,
    pass: passAppGmail,
  },
});

//controlador para recuperar contrasena
export const recoverPassword = async(req,res) => {
  const {email} = req.body;

  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(404).json ({ error: 'Email no encontrar'});
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetToken = resetToken;
  user.resetTokenExp = Date.now()+ 3600000;

  const mailOptions = {
    from: userGmail,
    to: email,
    subject: 'Recuperacion de contrasena',
    text: `Utiliza el siguiente enlace para recuperar tu contraseña: http://localhost:3000/reset-password?token=${resetToken}`
  };

  try {
      await transporter.sendMail(mailOptions);
      res.json({message: 'Emial de recuperacion enviado'});
  } catch (error) {
    console.error ('Error enviando email:' , error);
    res.status(500).json({error: 'Error enviando email'});
  };

}

export const resetPassword = async (req,res) => {
   const { token, newPassword} = req.body;

   const user = users.find(user => user.resetToken === token && user.resetTokenExp > Date.now());
   if (!user) {
    return res.status(400).json({error: 'Token invalido o expirado'})
   }

   user.password = newPassword;
   user.resetToken = null;
   user.resetTokenExp = null;

   res.json({message: 'Contraseña restrablecida con exito'});
};
