module.exports = {
    name: 'say',
    description: 'a dynamic tchat',
    execute(message, args) {
        const sayMessage = args.join(" ")
        
        message.delete().catch(O_o => { })
        message.channel.send(sayMessage)
    }
};