let userList = [
    {
        id: "1",
        name: "Võ Minh Hào",
        room: "nnm02",
    },
    {
        id: "2",
        name: "Nguyễn Thị Hiền",
        room: "nnm01",
    },
];

const addUser = (newUser) => {
    userList = [...userList, newUser];
};

const removeUser = (id) => {
    userList = userList.filter((user) => user.id !== id);
};

const getUserList = (room) => userList.filter((user)=> user.room === room);

const findUser = (id) => userList.find((user) => user.id === id);
module.exports = {
    getUserList,
    addUser,
    removeUser,
    findUser,
}