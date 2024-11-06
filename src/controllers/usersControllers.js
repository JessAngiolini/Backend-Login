import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connect from "../api/database";
import crypto from 'crypto';
import nodemailer from 'nodemailer'; //para enviar msj al mail


export const saveRegister = async (req, res) => {
  const { dni, email, nombre, apellido, user_password } = req.body;
  if (!dni || !email || !nombre || !apellido || !user_password) {
    console.log("Campos obligatorios faltantes");
    return res.status(400).send('Todos los campos son obligatorios');
  }

  try {
    const hash = await bcrypt.hash(user_password, 10);
    const connection = await connect();
    console.log("Conexión establecida", connection);
    const [results] = await connection.execute(
      'INSERT INTO users (dni, email, nombre, apellido, user_password) VALUES (?, ?, ?, ?, ?)',
      [dni, email, nombre, apellido, hash]
    );
    console.log("Usuario registrado", results);
    res.status(200).send('Usuario registrado exitosamente');
  } catch (err) {
    console.error("Error durante el registro:", err); // Detalles de depuración
    res.status(500).send('Error al registrar usuario');
  }
};


export const LoginCtrl = async (req, res) => {
  const { dni, user_password } = req.body;
  try {
    const connection = await connect();
    const [results] = await connection.execute('SELECT * FROM users WHERE dni = ?', [dni]);
    if (results.length === 0) {
      return res.status(401).send('Usuario no encontrado');
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (isMatch) {
      const token = jwt.sign({ id: user.id }, 'tu_secreto', { expiresIn: '1h' });
      return res.status(200).send({ token });
    } else {
      return res.status(401).send('Contraseña incorrecta');
    }
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).send('Error al iniciar sesión');
  }
};

const userGmail = 'emailtest11.2024@gmail.com'
const passAppGmail = "cthe uadu gkbx ozpz"; 



let users = [
    {
        email: 'prueba@gmail.com', resetToken: null, resetTokenExp: null
    }
]



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


/* export const getUsers = async (req, res) => {
  const db = await connect();
  const [rows] = await db.query("SELECT * from users");
  res.json(rows);
};
 */

