import express from "express";
import { client } from "../prismaClient";

const router = express.Router();

router.get("/users", async (req, res) => {
  const users = await client.user.findMany();
  res.json({ data: users.map(({ id, name }) => ({ id, name })) });
});

router.post("/add-friend/:userId", async (req, res) => {
  const { userId } = req.params;
  const { friendId } = req.body;
  const user = await client.user.findFirst({
    where: {
      id: parseInt(userId),
    },
  });
  if (!user) {
    return res
      .status(404)
      .send({ message: `User with id of ${userId} does not exist.` });
  }
  const friend = await client.user.findFirst({
    where: {
      id: parseInt(friendId),
    },
  });
  if (!friend) {
    return res
      .status(404)
      .send({ message: `User with id of ${friendId} does not exist.` });
  }

  const updatedUser = await client.user.update({
    where: { id: parseInt(userId) },
    data: {
      friends: { connect: { id: parseInt(friendId) } },
    },
    include: { friends: true },
  });
  res.json({ updatedUser });
});

export default router;
