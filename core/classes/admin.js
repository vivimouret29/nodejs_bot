'use.strict'

class Admin {
    constructor() {
        this.id = this.id;
        this.username = this.username;
        this.guild = this.guild;
    };

    setAdminProperty(admin) {
        this.id = Number(admin.id);
        this.username = String(admin.username);
        this.guild = Number(admin.guild);

        return {
            'id': Number(this.id),
            'username': String(this.username),
            'guild': Number(this.guild)
        };
    };

    getAdminProperty(adminId, adminProperty) {
        for (let i = 0; i < adminProperty.length; i++) {
            if (adminProperty[i].key == Number(adminId)) {
                this.id = Number(adminProperty[i].value.id);
                this.username = String(adminProperty[i].value.username);
                this.guild = Number(adminProperty[i].value.guild);

                return {
                    'id': Number(this.id),
                    'username': String(this.username),
                    'guild': Number(this.guild)
                };
            };
        };
    };
};

exports.Admin = Admin;