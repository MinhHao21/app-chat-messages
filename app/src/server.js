const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { createMessage } = require("./utils/create-message");
const { getUserList, addUser, removeUser, findUser } = require("./utils/users");

const publicPathDirectory = path.join(__dirname, "../public");
app.use(express.static(publicPathDirectory));
const server = http.createServer(app);
const io = socketio(server);

//lắng nghe sự kiện kết nối từ client
io.on("connection", (socket) => {
  //nhận sự kiện từ client
  socket.on("join room client to server", ({ room, username }) => {
    // xử lý cho client vào phòng
    socket.join(room);

    //gửi cho client vừa kết nối vào
    socket.emit(
      "send message from server to client",
      createMessage(`Chào mừng bạn đến với ${room}`, "Admin")
    );

    //gửi cho các client còn lại
    socket.broadcast
      .to(room)
      .emit(
        "send message from server to client",
        createMessage(
          `Có một người dùng mới ${username} tham gia vào ${room}`,
          "Admin"
        )
      );

    //chat
    socket.on("send message from client to server", (messageText, callback) => {
      const filter = new Filter();
      if (filter.isProfane(messageText)) {
        return callback("messageText không hợp lệ");
      }

      const id = socket.id;
      const user = findUser(id);

      console.log(messageText);
      io.to(room).emit(
        "send message from server to client",
        createMessage(messageText, user.name)
      );
      callback();
    });

    //xử lý chia sẻ vị trí
    socket.on(
      "share location from client to server",
      ({ latitude, longitude }) => {
        const linkLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const id = socket.id;
        const user = findUser(id);
        io.to(room).emit(
          "share location from server to client",
          createMessage(linkLocation, user.name)
        );
      }
    );

    //xử lý userList
    const newUser = {
      id: socket.id,
      name: username,
      room: room,
    };
    addUser(newUser);
    io.to(room).emit("send user list from server to client", getUserList(room));

    //ngắt kết nối
    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.to(room).emit(
        "send user list from server to client",
        getUserList(room)
      );
      console.log("client left server");
    });
  });
});

const port = 4567;
server.listen(port, () => {
  console.log(`app run on http://localhost:${port}`);
});

//node: Dùng socket.emit nếu server chỉ phản hồi cho 1 client( chính là client gửi event lên cho server)
//      Dùng io nêu server muốn phản hồi cho tất cả các client đang kết nối với nó
