import express from "express";
import { client } from "../prismaClient";

const router = express.Router();

router.post("/messages", async (req, res) => {
  const { text, senderId, chatRoomId } = req.body;

  try {
    const newMessage = await client.message.create({
      data: {
        text,
        sender: { connect: { id: parseInt(senderId) } },
        chatRoom: { connect: { id: parseInt(chatRoomId) } },
      },
    });
    res.json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to send message" });
  }
});

export default router;
