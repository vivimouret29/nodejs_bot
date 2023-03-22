'use.strict'

class User {
    constructor() {
        this.canroll = this.canroll;
        this.id = this.id;
        this.username = this.username;
        this.roll = this.roll;
        this.lastroll = this.lastroll;
    };

    setUserProperty(user) {
        this.id = Number(user.id);
        this.username = String(user.username);
        this.canroll = Boolean(user.canroll);
        this.roll = Number(user.roll);
        this.lastroll = Number(user.lastroll);

        return {
            'id': Number(this.id),
            'username': String(this.username),
            'canroll': Boolean(this.canroll),
            'roll': Number(this.roll),
            'lastroll': Number(this.lastroll)
        };
    };

    getUserProperty(userId, userProperty) {
        for (let i = 0; i < userProperty.length; i++) {
            if (userProperty[i].key == Number(userId)) {
                this.id = Number(userProperty[i].value.id);
                this.username = String(userProperty[i].value.username);
                this.canroll = Boolean(userProperty[i].value.canroll);
                this.roll = Number(userProperty[i].value.roll);
                this.lastroll = Number(userProperty[i].value.lastroll);

                return {
                    'id': Number(this.id),
                    'username': String(this.username),
                    'canroll': Boolean(this.canroll),
                    'roll': Number(this.roll),
                    'lastroll': Number(this.lastroll)
                };
            };
        };
    };
};

exports.User = User;