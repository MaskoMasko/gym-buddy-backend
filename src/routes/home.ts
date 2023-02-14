import express from "express";
import jwt, { JwtPayload as ORJwtPayload } from "jsonwebtoken";
import { client } from "../prismaClient";
import { secretKey } from "./auth";

interface JwtPayload extends ORJwtPayload {
  email: string;
}

const router = express.Router();
router.get("/home", async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")!;
  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await client.user.findFirst({
      where: { email: (decoded as JwtPayload).email },
    });
    const isEmailVerified = user?.emailVerified;
    console.log({ home: user });
    if (!user || !isEmailVerified) {
      res.status(401).send({ message: "Not authorized." });
    } else {
      res.send({ message: "Access granted." });
    }
  } catch (error) {
    return res.status(401).send({ message: "Not authorized." });
  }
});

export default router;
