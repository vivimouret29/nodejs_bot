module.exports = {
    name: 'ping',
    description: 'a dynamic ping',
    async execute(message) {
        message.delete().catch(O_o => { })
        const wait = await message.channel.send("AAAAAAAATTTEEEEEEENNNNNNNNNNNNNDDDDDDDDDSSSSSSSSSSSSS!!!!")
        wait.edit(`bip. latence de ${wait.createdTimestamp - message.createdTimestamp}ms.. bip boup..`)
    },
};