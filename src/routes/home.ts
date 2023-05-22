import express from "express";
import jwt, { JwtPayload as ORJwtPayload } from "jsonwebtoken";
import { client } from "../prismaClient";
import { jwtSecret } from "../constants";
import { authenticateToken } from "../middleware";

interface JwtPayload extends ORJwtPayload {
  email: string;
  userId: string;
}

const router = express.Router();
router.get("/home", authenticateToken, async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")!;
  // console.log(token);
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const userId = (decoded as JwtPayload).userId;
    const user = await client.user.findFirst({
      where: { id: Number(userId) },
      include: { friends: true, chatRooms: { include: { messages: true } } },
    });
    const isEmailVerified = user?.emailVerified;
    // console.log(user);
    if (!user || !isEmailVerified) {
      res.send({ message: "Not authorized." });
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
    return res.json({ message: "Not authorized." });
  }
});

export default router;
