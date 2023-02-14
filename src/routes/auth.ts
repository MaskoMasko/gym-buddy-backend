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

router.post("/login", async (req, res) => {
  const { name, email } = req.body;
  const user = await client.user.findFirst({
    where: { name, email },
  });
  // if else >> if return return !?
  if (!user) {
    res.send({ message: "Invalid name or email" });
  } else if (user && !user.emailVerified) {
    res.send({ message: "Verify your email before continuing." });
  } else {
    res.send({ message: "Login successful." });
  }
  console.log({ login: user });
});

router.post("/signup", async (req, res) => {
  const { name, email } = req.body;
  const verificationToken = jwt.sign({ email }, secretKey, {
    expiresIn: "24h",
  });
  const user = await client.user.create({
    data: {
      name,
      email,
      token: verificationToken,
      friends: { connectOrCreate: [] },
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

export default router;
