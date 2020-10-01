module.exports = {
    name: 'uptime',
    description: 'a dynamic uptime',
    execute(message) {
        client.on('ready', () => {
            let days = Math.floor(client.uptime / 86400000);
            let hours = Math.floor(client.uptime / 3600000) % 24;
            let minutes = Math.floor(client.uptime / 60000) % 60;
            let seconds = Math.floor(client.uptime / 1000) % 60;

            console.log(client)
            console.log(hours)
            console.log(minutes)
            console.log(seconds)

            message.delete().catch(O_o => { })
            message.channel.send(`\`__UPTIME|SATELLITE__:__${days}D:${hours}H:${minutes}M:${seconds}S__\``);
        })
    },
};