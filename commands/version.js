const packageVersion = require("../package.json");
module.exports = {
    name: 'version',
    description: 'a dynamic view version',
    execute(message) {
        message.delete().catch(O_o => { })
        message.channel.send(`daftbot ${packageVersion.version}`)
    }
};