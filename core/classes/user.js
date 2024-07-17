'use.strict'

class User {
    constructor() {
        this.canroll = this.canroll;
        this.id = this.id;
        this.username = this.username;
        this.roll = this.roll;
        this.lastroll = this.lastroll;
        this.guildId = this.guildId;

    };

    setUserProperty(user) {
        this.id = Number(user.id);
        this.username = String(user.username);
        this.canroll = Boolean(user.canroll);
        this.roll = Number(user.roll);
        this.lastroll = String(user.lastroll);
        this.guildId = String(user.guildId);

        return {
            'id': Number(this.id),
            'username': String(this.username),
            'canroll': Boolean(this.canroll),
            'roll': Number(this.roll),
            'lastroll': String(this.lastroll),
            'guildId': String(this.guildId)
        };
    };

    getUserProperty(userId, userProperty) {
        for (let i = 0; i < userProperty.length; i++) {
            if (userProperty[i].key == Number(userId)) {
                this.id = Number(userProperty[i].value.id);
                this.username = String(userProperty[i].value.username);
                this.canroll = Boolean(userProperty[i].value.canroll);
                this.roll = Number(userProperty[i].value.roll);
                this.lastroll = String(userProperty[i].value.lastroll);
                this.guildId = String(userProperty[i].value.guildId);

                return {
                    'id': Number(this.id),
                    'username': String(this.username),
                    'canroll': Boolean(this.canroll),
                    'roll': Number(this.roll),
                    'lastroll': String(this.lastroll),
                    'guildId': String(this.guildId)
                };
            };
        };
    };
};

exports.User = User;