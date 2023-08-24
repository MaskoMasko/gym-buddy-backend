import bodyParser from "body-parser";
import cookieparser from "cookie-parser";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import authRouter from "./routes/auth/auth";
import blogs from "./routes/blogs/blogs";
import chatRoom from "./routes/social/chatRoom";
import comments from "./routes/blogs/comments";
import exercises from "./routes/exercises";
import friends from "./routes/social/friends";
import gymLocations from "./routes/gymLocations";
import home from "./routes/home";
import likes from "./routes/blogs/likes";
import messages from "./routes/social/messages";
import statistics from "./routes/statistics";

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
app.use("/", comments);
app.use("/", likes);

server.listen(4000, () => {
  console.log(`Server running on http://localhost:4000`);
});
