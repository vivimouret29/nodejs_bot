module.exports = {
    data: {
        name: 'purge',
        description: 'a dynamic purge',
        args: true
    },
    async execute(message, client, language, args, initDateTime) {
        if (!(message.author.id == owner)) return await sendEmbed(message, language.restricted);

        var amount = parseInt(args[0]);

        if (isNaN(amount)) {
            await sendEmbed(message, language.pruneInvalid);
        } else if (amount == 1) {
            await message.delete().catch(O_o => { });
        } else if (amount > 1 && amount < 101) {
            await message.channel
                .bulkDelete(amount, true)
                .catch(err => {
                    console.error(err);
                    sendEmbed(message, language.pruneError);
                });
        } else { await sendEmbed(message, language.pruneOut); };
    }
};