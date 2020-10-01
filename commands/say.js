module.exports = {
    name: 'say',
    description: 'a dynamic tchat',
    args: true,
    execute(message, args) {
        const sayMessage = args.join(" ")
        
        message.delete().catch(O_o => { })
        message.channel.send(sayMessage)
    }
};