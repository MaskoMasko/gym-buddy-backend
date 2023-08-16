import bodyParser from "body-parser";
import cookieparser from "cookie-parser";
import express from "express";
import authRouter from "./routes/auth";
import chatRoom from "./routes/chatRoom";
import friends from "./routes/friends";
import gymLocations from "./routes/gymLocations";
import home from "./routes/home";
import messages from "./routes/messages";
import blogs from "./routes/blogs";
import { Server } from "socket.io";
import http from "http";
import exercises from "./routes/exercises";
import statistics from "./routes/statistics";
import { client } from "./prismaClient";

const app = express();
const server = http.createServer(app);
export const io = new Server(server);
// io.emit("greeting", "Greetings ");
io.on("connection", (socket) => {
  socket.emit("greeting", "this is something");
});
//   // io.sockets.emit("message", "this is my message");
//   socket.emit("greeting", "hello world");
// });
// io.on("greeting", () => {
//   console.log("this is something");
// });

// io.on("connection", (socket) => {
//   socket.on("message", async (msg) => {
//     console.log(JSON.stringify(msg));
//     await client.message.create({
//       data: {
//         text: msg.text,
//         sender: { connect: { id: parseInt(msg.senderId) } },
//         chatRoom: { connect: { id: parseInt(msg.chatRoomId) } },
//       },
//     });
//     io.emit("message", msg);
//   });
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });
app.get("/testing", (req, res) => {
  res.sendFile(__dirname + "/testing.html");
});
app.use(bodyParser.urlencoded());
app.use(cookieparser());

app.use(bodyParser.json());
app.use("/images", express.static("images"));
app.use("/", authRouter);
app.use("/", home);
app.use("/", chatRoom);
app.use("/", messages);
app.use("/", gymLocations);
app.use("/", friends);
app.use("/", blogs);
app.use("/", exercises);
app.use("/", statistics);

server.listen(4000, () => {
  console.log(`Server running on http://localhost:4000`);
});
