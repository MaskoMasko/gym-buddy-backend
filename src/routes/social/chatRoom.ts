import express from "express";
import { client } from "../../prismaClient";

const router = express.Router();

router.get("/chat-room", async (req, res) => {
  const chatRooms = await client.chatRoom.findMany();
  if (!chatRooms) {
    return res.send({
      message: "To start create chat room: POST -> /create-room",
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
  // console.log(users);
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

router.post("/create-room", async (req, res) => {
  const { user1Id, user2Id, roomName } = req.body;
  const chatRoom = await client.chatRoom.create({
    data: {
      name: roomName,
      participants: {
        connect: [
          { id: user1Id }, // Connect user with id 1
          { id: user2Id }, // Connect user with id 2
        ],
      },
    },
  });
  for (const id of [user1Id, user2Id]) {
    await client.user.update({
      where: {
        id,
      },
      data: { chatRoomId: chatRoom.id },
    });
  }
  const newChatRoom = await client.chatRoom.findFirst({
    where: { id: chatRoom.id },
    include: { participants: true },
  });
  if (newChatRoom) {
    return res.send({ data: newChatRoom });
  }
  return res
    .status(500)
    .send({ message: "Error while creating chat room. Try again later!" });
});

router.get(`/users-chat-rooms/:userId`, async (req, res) => {
  const { userId } = req.params;
  const userWithChatRooms = await client.user.findFirst({
    where: {
      id: Number(userId),
    },
    include: {
      chatRooms: {
        include: {
          messages: true,
          participants: true,
        }
      },
    },
  });
  if (!userWithChatRooms) {
    return res.send(`User with id ${userId} does not exist`);
  }
  const chatRoomsWithLastMessage = userWithChatRooms.chatRooms.map((chatRoom) => {
    return {...chatRoom, lastMessage: chatRoom.messages.at(-1) ?? "Start a new conversation!"}
  })
  res.json({ data: chatRoomsWithLastMessage});
});

export default router;
