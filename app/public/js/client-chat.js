//yêu cầu server kết nối với client
const socket = io();

document.getElementById("form-messages").addEventListener("submit", (e) => {
  e.preventDefault();
  const messageText = document.getElementById("input-messages").value;
  console.log(messageText);

  const acknowledgements = (errors) => {
    if (errors) {
      return alert("tin nhắn không hợp lệ");
    }
    console.log("Đã gửi");
  };
  socket.emit(
    "send message from client to server",
    messageText,
    acknowledgements
  );
});

socket.on("send message from server to client", (message) => {
  console.log(message);
  // hiển thị lên màn hình
  const { createAt, messageText, name } = message;
  const htmlContent = document.getElementById("app__messages").innerHTML;
  const messagesElement = `
  <div class="message-item">
    <div class="message__row1">
      <p class="message__name">${name}</p>
      <p class="message__date">${createAt}</p>
    </div>
    <div class="message__row2">
      <p class="message__content">
          ${messageText}
      </p>
    </div>
  </div>
  `;
  let contentRender = htmlContent + messagesElement;
  document.getElementById("app__messages").innerHTML = contentRender;

  // clear input messages
  document.getElementById("input-messages").value = "";
});

//gửi vị trí
document.getElementById("btn-share-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("trình duyệt đàn dùng không hỗ trợ");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position);
    const { latitude, longitude } = position.coords;
    socket.emit("share location from client to server", {
      latitude,
      longitude,
    });
  });
});

socket.on("share location from server to client", (data) => {
  const { createAt, messageText, name } = data;
  const htmlContent = document.getElementById("app__messages").innerHTML;
  const messagesElement = `
  <div class="message-item">
    <div class="message__row1">
      <p class="message__name">${name}</p>
      <p class="message__date">${createAt}</p>
    </div>
    <div class="message__row2">
      <p class="message__content">
      <a href ="${messageText}" target="_blank">Vị trí của ${name}</a>
      </p>
    </div>
  </div>
  `;
  let contentRender = htmlContent + messagesElement;
  document.getElementById("app__messages").innerHTML = contentRender;
});

//xử lý query string
const queryString = location.search;
console.log(queryString);
const params = Qs.parse(queryString, {
  ignoreQueryPrefix: true,
});
console.log("params: ", params);
const { room, username } = params;
socket.emit("join room client to server", { room, username });
// hiển thị tên phòng lên màn hình
document.getElementById("app__title").innerHTML = room;

// xử lý userList
socket.on("send user list from server to client", (userList) => {
  console.log("UserList:", userList);
  let contentHtml = "";
  userList.map((user) => {
    contentHtml += `
    <li class="app__item-user">${user.name}</li>
    `;
  });
  document.getElementById("app__list-user--content").innerHTML = contentHtml;
});
