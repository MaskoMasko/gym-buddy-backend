import express from "express";
import { client } from "../../prismaClient";
import sgMail from "@sendgrid/mail";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { jwtSecret, refreshJwtSecret } from "../../constants";

const router = express.Router();

if (!process.env.SENDGRID_API_KEY) {
  throw Error(
    "process.env.SENDGRID_API_KEY is undefined. Check your env file configuration."
  );
}
if (!process.env.EMAIL) {
  throw Error(
    "process.env.EMAIL is undefined. Check your env file configuration."
  );
}

const sendToMail = process.env.EMAIL;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/refresh-token", async (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  jwt.verify(refreshToken, refreshJwtSecret, async (err: any) => {
    if (err) return res.sendStatus(403);
    const user = await client.user.findFirst({ where: { refreshToken } });
    if (!user) {
      return res.sendStatus(401);
    }
    const accessToken = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: "1h",
    });
    const updatedUser = await client.user.update({
      where: { id: user.id },
      data: { accessToken: accessToken },
    });

    res.json({ user: updatedUser });
  });
});

router.post("/login", async (req, res) => {
  const { email } = req.body;
  if (req.body.password) {
    const user = await client.user.findFirst({
      where: { email },
    });
    // if else >> if return return !?
    if (!user) {
      res
        .status(401)
        .json({ message: `Email ${email} does not exist in our database.` });
    } else if (user && !user.emailVerified) {
      res
        .status(401)
        .json({ message: "Verify your email before continuing.", user });
    } else {
      const passwordMatches = await bcrypt.compare(
        req.body.password,
        user.password!
      );
      if (!passwordMatches) {
        return res.json({ error: "Invalid email or password" });
      }

      const refreshToken = jwt.sign({ userId: user.id }, refreshJwtSecret);
      const newUser = await client.user.update({
        where: { id: user.id },
        data: { refreshToken },
        include: {
          friends: true,
          chatRooms: {
            include: {
              messages: true,
            },
          },
        },
      });
      return res.json({ message: "Login successful", user: newUser });
    }
  } else {
    const user = await client.user.findFirst({
      where: { email },
    });
    // if else >> if return return !?
    if (!user) {
      res.status(401).json({
        error: `Email ${email} does not exist in our database.`,
      });
    } else if (user && !user.emailVerified) {
      res.json({ error: "Verify your email before continuing.", user });
    } else {
      res.json({ user });
    }
  }
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await client.user.findFirst({ where: { email } });
  if (existingUser) {
    return res.json({
      message: "User with this email already exists",
      userExists: true,
    });
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = await client.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "1h" });
  const newUser = await client.user.update({
    where: { id: user.id },
    data: { accessToken: token },
  });
  // console.log({ signup: newUser });
  if (!user) {
    throw Error("Error while creating a user. Try again later!");
  }
  const msg = {
    to: sendToMail, // Change to your recipient
    from: sendToMail, // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: `<strong><a href="http://localhost:4000/verify?token=${token}">Verify email</a></strong>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      res.json({
        message:
          "User was successfully created. Verify your email to continue!",
        newUser,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/verify", async (req, res) => {
  const token = req.query.token;
  const user = await client.user.findFirst({
    where: { accessToken: token as string },
  });
  if (!user) {
    return res.status(400).send("Invalid token");
  }
  const updatedUser = await client.user.update({
    where: { id: user.id },
    data: { emailVerified: true },
  });
  // console.log({ verifiedUser: updatedUser });
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

  const msg = {
    to: sendToMail, // Change to your recipient
    from: sendToMail, // Change to your verified sender
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
