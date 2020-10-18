const { execute } = require("../reply/daftbot");

module.exports = {
    name: 'talk',
    description: 'a dynamic trashtalk',
    execute(message) {
        message.reply('commence par calmer ton python éclaté')
    }
}