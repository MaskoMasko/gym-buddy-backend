import express from "express";
import { client } from "../prismaClient";
import sgMail from "@sendgrid/mail";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const router = express.Router();
//jwt secret key
export const secretKey = crypto.randomBytes(64).toString("hex");

if (!process.env.SENDGRID_API_KEY) {
  throw Error(
    "process.env.SENDGRID_API_KEY is undefined. Check your env file configuration."
  );
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const salt = crypto.randomBytes(16).toString("hex");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  crypto.pbkdf2(
    password,
    salt,
    10000,
    64,
    "sha512",
    async (err, derivedKey) => {
      if (err) throw err;

      // compare the derived key with the previously hashed password
      let hashedPassword = derivedKey.toString("hex");
      console.log(hashedPassword);
      const user = await client.user.findFirst({
        where: { email, password: hashedPassword },
      });
      // if else >> if return return !?
      if (!user) {
        res.json({ message: "Check your credentials." });
      } else if (user && !user.emailVerified) {
        res.json({ message: "Verify your email before continuing." });
      } else {
        res.json({ message: "Login successful." });
      }
      console.log({ login: user });
    }
  );
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const verificationToken = jwt.sign({ email }, secretKey, {
    expiresIn: "24h",
  });
  crypto.pbkdf2(
    password,
    salt,
    10000,
    64,
    "sha512",
    async (err, derivedKey) => {
      if (err) throw err;
      let hashedPassword = derivedKey.toString("hex");
      const user = await client.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          token: verificationToken,
        },
      });
      console.log({ signup: user });
      if (!user) {
        throw Error("Error while creating a user. Try again later!");
      }
      if (!process.env.EMAIL) {
        throw Error(
          "process.env.EMAIL is undefined. Check your env file configuration."
        );
      }
      const msg = {
        to: process.env.EMAIL, // Change to your recipient
        from: process.env.EMAIL, // Change to your verified sender
        subject: "Sending with SendGrid is Fun",
        text: "and easy to do anywhere, even with Node.js",
        html: `<strong><a href="http://localhost:4000/verify?token=${verificationToken}">Verify email</a></strong>`,
      };
      sgMail
        .send(msg)
        .then(() => {
          res.send({
            message:
              "User was successfully created. Verify your email to continue!",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  );
});

router.get("/verify", async (req, res) => {
  const token = req.query.token;
  const user = await client.user.findFirst({
    where: { token: token as string },
  });
  if (!user) {
    return res.status(400).send("Invalid token");
  }
  const updatedUser = await client.user.update({
    where: { id: user.id },
    data: { emailVerified: true },
  });
  console.log({ verifiedUser: updatedUser });
  res.send("Email verified");
});
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await client.user.findFirst({
    where: {
      email,
    },
  });
  if (!user) {
    throw Error(`Email ${email} doesn't exist in our database!`);
  }
  if (!process.env.EMAIL) {
    throw Error(
      "process.env.EMAIL is undefined. Check your env file configuration."
    );
  }
  const msg = {
    to: process.env.EMAIL, // Change to your recipient
    from: process.env.EMAIL, // Change to your verified sender
    subject: "Forgot password",
    text: "forgot password",
    html: `<strong><a href="http://localhost:4000/password-reset-success">Reset password</a></strong>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      res.send({
        message: "Check email and confirm that you own that account!",
      });
    })
    .catch((error) => {
      console.log(error);
    });
});
router.get("/password-reset-success", (req, res) => {
  res.send("Success! Return to app and reset password");
});
export default router;

//login with invalid email -> create account -> verify email -> access to other routes
//login with valid email -> access to other routes
//reset-password has to work only in app
