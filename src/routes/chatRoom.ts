import express from "express";
import { client } from "../prismaClient";

const router = express.Router();

router.get("/chat-room", async (req, res) => {
  const chatRooms = await client.chatRoom.findMany();
  if (!chatRooms) {
    return res.send({
      message: "To start create chat room: GET -> /create-room",
    });
  }
  return res.json(chatRooms);
});
router.get("/chat-room/:chatRoomId", async (req, res) => {
  const { chatRoomId } = req.params;
  const users = await client.user.findMany();
  const messages = await client.message.findMany();
  const chatRoom = await client.chatRoom.findFirst({
    where: {
      id: parseInt(chatRoomId),
    },
  });
  if (!chatRoom) {
    return res.send({ message: "There is no chat room with that id" });
  }
  console.log(users);
  const usersFromChatRoom = users.filter(
    (user) => user.chatRoomId === chatRoom.id
  );
  const messagesFromChatRoom = messages.filter(
    (message) => message.chatRoomId === chatRoom.id
  );
  return res.json({
    ...chatRoom,
    participants: [...usersFromChatRoom],
    messages: [...messagesFromChatRoom],
  });
});

router.get("/create-room", async (req, res) => {
  const addedUserIds = [1, 2];
  const newChatRoom = await client.chatRoom.create({
    data: {
      name: "Grup[a",
      participants: {
        connect: [
          { id: 1 }, // Connect user with id 1
          { id: 2 }, // Connect user with id 2
        ],
      },
    },
  });
  for (const id of addedUserIds) {
    await client.user.update({
      where: {
        id,
      },
      data: { chatRoomId: newChatRoom.id },
    });
  }
  console.log(newChatRoom);
  if (newChatRoom) {
    return res.send({ message: "Chat Room was successfully created!" });
  }
  return res
    .status(500)
    .send({ message: "Error while creating chat room. Try again later!" });
});

export default router;
