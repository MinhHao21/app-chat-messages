const formatTime = require('date-format');
const createMessage = (messageText, name) =>{
    return {
        messageText,
        name,
        createAt: formatTime("dd/MM/yyyy - hh:mm:ss",new Date())
    }
}

module.exports = {
    createMessage
}