'use.strict'

class User {
    constructor() {
        this.id = this.id;
        this.username = this.username;
        this.platform = this.platform;
        this.pseudo = this.pseudo;
        this.rubis = this.rubis;
        this.canroll = this.canroll;
        this.roll = this.roll;
        this.lastroll = this.lastroll;
        this.dailyroll = this.dailyroll;
        this.canwork = this.canwork;
        this.claimwork = this.claimwork;
        this.guildid = this.guildid;

    };

    setUserProperty(user) {
        this.id = Number(user.id);
        this.username = String(user.username);
        this.platform = String(user.platform);
        this.pseudo = String(user.pseudo);
        this.rubis = Number(user.rubis);
        this.canroll = Boolean(user.canroll);
        this.roll = Number(user.roll);
        this.lastroll = String(user.lastroll);
        this.dailyroll = String(user.dailyroll);
        this.canwork = Boolean(user.canwork);
        this.claimwork = String(user.claimwork);
        this.guildid = String(user.guildid);

        return {
            'id': Number(this.id),
            'username': String(this.username),
            'platform': String(this.platform),
            'pseudo': String(this.pseudo),
            'rubis': Number(this.rubis),
            'canroll': Boolean(this.canroll),
            'roll': Number(this.roll),
            'lastroll': String(this.lastroll),
            'dailyroll': String(this.dailyroll),
            'canwork': Boolean(this.canwork),
            'claimwork': String(this.claimwork),
            'guildid': String(this.guildid)
        };
    };

    getUserProperty(userId, userProperty) {
        for (let i = 0; i < userProperty.length; i++) {
            if (userProperty[i].key == Number(userId)) {
                this.id = Number(userProperty[i].value.id);
                this.username = String(userProperty[i].value.username);
                this.platform = String(userProperty[i].value.platform);
                this.pseudo = String(userProperty[i].value.pseudo);
                this.rubis = Number(userProperty[i].value.rubis);
                this.canroll = Boolean(userProperty[i].value.canroll);
                this.roll = Number(userProperty[i].value.roll);
                this.lastroll = String(userProperty[i].value.lastroll);
                this.dailyroll = String(userProperty[i].value.dailyroll);
                this.canwork = Boolean(userProperty[i].value.canwork);
                this.claimwork = String(userProperty[i].value.claimwork);
                this.guildid = String(userProperty[i].value.guildid);

                return {
                    'id': Number(this.id),
                    'username': String(this.username),
                    'platform': String(this.platform),
                    'pseudo': String(this.pseudo),
                    'rubis': Number(this.rubis),
                    'canroll': Boolean(this.canroll),
                    'roll': Number(this.roll),
                    'lastroll': String(this.lastroll),
                    'dailyroll': String(this.dailyroll),
                    'canwork': Boolean(this.canwork),
                    'claimwork': String(this.claimwork),
                    'guildid': String(this.guildid)
                };
            };
        };
    };
};

exports.User = User;