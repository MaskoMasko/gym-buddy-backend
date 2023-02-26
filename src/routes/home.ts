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
  console.log(token);
  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await client.user.findFirst({
      where: { email: (decoded as JwtPayload).email },
      include: { friends: true, chatRooms: true },
    });
    const isEmailVerified = user?.emailVerified;
    if (!user || !isEmailVerified) {
      res.status(401).send({ message: "Not authorized." });
    } else {
      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          friends: user.friends.map(({ name, id }) => ({
            id,
            name,
          })),
          chatRooms: user.chatRooms,
        },
      });
    }
  } catch (error) {
    return res.status(401).json({ message: "Not authorized." });
  }
});

export default router;
