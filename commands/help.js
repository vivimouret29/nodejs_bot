module.exports = {
    name: 'help',
    description: 'a dynamic help',
    execute(message) {
        message.delete().catch(O_o => { })
        message.channel.send('```Liste help :\n\
                help : faire ce que tu fais ducon\n\
                ping : teste la latence\n\
                prune : supprime des lignes (commande admin)\n\
                say : me fait répéter n\'importe quelle connerie\n\
                status : currently unusable \n\
                uptime : depuis quand le bot est actif\n\
                version : bah...\n\
                ```')
    }
};