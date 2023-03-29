'use.strict'

const { DaftBot } = require("../daftbot.js"),
    { zelda: zedIco } = require('../../resx/emojis.json');

class Weapons extends DaftBot {
    constructor(dbClient) {
        super(dbClient);

        this.weapons = [];
        this.rarity = {
            'legendary': 0.05,
            'epic': 0.1,
            'rare': 0.15,
            'uncommon': 0.2,
            'common': 0.33
        };

        this.roll = {};
    };

    setPreRoll(client) {
        this.getWeapons(client);
        this.roll = {
            'sword': roll(this.weapons[0].sword),
            'clubs': roll(this.weapons[0].clubs),
            'spear': roll(this.weapons[0].spear),
            'twohands': roll(this.weapons[0].twohands),
            'shield': roll(this.weapons[0].shield),
            'bow': roll(this.weapons[0].bow),
            'axes': roll(this.weapons[0].axes),
            // 'hammer': roll(this.weapons[0].hammer),
            'boomerang': roll(this.weapons[0].boomerang)
        };
    };

    getWeapons(client) {
        var items = [],
            item = [],
            id,
            name,
            type,
            rarity;

        for (let d = 0; d < zedIco.length; d++) {
            items.push(client.emojis.cache.find(emoji => emoji.name === zedIco[d]));

            if (items[d] == undefined) { continue; };

            type = items[d].name.split('_')[0];
            name = items[d].name.slice(3).split('_').join(' ');
            id = Number(items[d].id);

            switch (type) {
                case 'sw':
                    rarity = this.setSwordRarity(name, rarity);
                    break;
                case 'cl':
                    rarity = this.setSwordRarity(name, rarity);
                    break;
                case 'sp':
                    rarity = this.setSpearRarity(name, rarity);
                    break;
                case 'th':
                    rarity = this.setSpearRarity(name, rarity);
                    break;
                case 'sh':
                    rarity = this.setShieldRarity(name, rarity);
                    break;
                case 'bw':
                    rarity = this.setBowRarity(name, rarity);
                    break;
                // case 'ha':
                //     rarity = this.setAxesRarity(name, rarity);
                //     break;
                case 'ax':
                    rarity = this.setAxesRarity(name, rarity);
                    break;
                case 'bo':
                    rarity = this.setAxesRarity(name, rarity);
                    break;
            };

            item.push({
                "key": id,
                "value": {
                    "id": id,
                    "cache": items[d],
                    "name": name,
                    "type": type,
                    "rarity": rarity
                }
            });
        };

        this.weapons.push({
            "sword": item.filter(item => item.value.type === 'sw'),
            "clubs": item.filter(item => item.value.type === 'cl'),
            "spear": item.filter(item => item.value.type === 'sp'),
            "twohands": item.filter(item => item.value.type === 'th'),
            "shield": item.filter(item => item.value.type === 'sh'),
            "bow": item.filter(item => item.value.type === 'bw'),
            "axes": item.filter(item => item.value.type === 'ax'),
            // "hammer": item.filter(item => item.value.type === 'ha'),
            "boomerang": item.filter(item => item.value.type === 'bo')
        });
    };

    setSwordRarity(itemName) {
        if (itemName.includes('goddess') || itemName.includes('master') || itemName.includes('fierce') || itemName.includes('ages') || itemName.includes('eightfold') || itemName.includes('royalequip')) {
            return this.rarity.legendary;
        } else if (itemName.includes('lynel') || itemName.includes('ancient') || itemName.includes('royalguard')) {
            return this.rarity.epic;
        } else if (itemName.includes('moonlight') || itemName.includes('guardian') || itemName.includes('scythe') || itemName.includes('soldier')) {
            return this.rarity.rare;
        } else if (itemName.includes('flameblade') || itemName.includes('frostblade') || itemName.includes('thunderblade') || itemName.includes('rito') || itemName.includes('koh') || itemName.includes('demon') || itemName.includes('gerudo')) {
            return this.rarity.uncommon;
        } else {
            return this.rarity.common;
        };
    };

    setSpearRarity(itemName) {
        if (itemName.includes('master') || itemName.includes('duality') || itemName.includes('ages') || itemName.includes('eightfold') || itemName.includes('royalequip')) {
            return this.rarity.legendary;
        } else if (itemName.includes('lynel') || itemName.includes('ancient') || itemName.includes('royalguard')) {
            return this.rarity.epic;
        } else if (itemName.includes('windcleaver') || itemName.includes('guardian') || itemName.includes('scythe') || itemName.includes('flameblade') || itemName.includes('frostblade') || itemName.includes('thunderblade') || itemName.includes('soldier')) {
            return this.rarity.rare;
        } else if (itemName.includes('flamespear') || itemName.includes('frostspear') || itemName.includes('thunderspear') || itemName.includes('rito') || itemName.includes('koh') || itemName.includes('demon') || itemName.includes('gerudo') || itemName.includes('biggoron')) {
            return this.rarity.uncommon;
        } else {
            return this.rarity.common;
        };
    };

    setShieldRarity(itemName) {
        if (itemName.includes('hylian') || itemName.includes('hero') || itemName.includes('royalequip')) {
            return this.rarity.legendary;
        } else if (itemName.includes('lynel') || itemName.includes('ancient') || itemName.includes('royalguard') || itemName.includes('daybreaker')) {
            return this.rarity.epic;
        } else if (itemName.includes('guardian') || itemName.includes('soldier')) {
            return this.rarity.rare;
        } else if (itemName.includes('rito') || itemName.includes('koh') || itemName.includes('demon') || itemName.includes('gerudo') || itemName.includes('biggoron')) {
            return this.rarity.uncommon;
        } else {
            return this.rarity.common;
        };
    };

    setBowRarity(itemName) {
        if (itemName.includes('light') || itemName.includes('twilight') || itemName.includes('skyward') || itemName.includes('royalequip')) {
            return this.rarity.legendary;
        } else if (itemName.includes('lynel') || itemName.includes('ancient') || itemName.includes('royalguard')) {
            return this.rarity.epic;
        } else if (itemName.includes('eagle') || itemName.includes('guardian') || itemName.includes('soldier')) {
            return this.rarity.rare;
        } else if (itemName.includes('falcon') || itemName.includes('koh') || itemName.includes('demon') || itemName.includes('gerudo') || itemName.includes('biggoron')) {
            return this.rarity.uncommon;
        } else {
            return this.rarity.common;
        };
    };

    setAxesRarity(itemName) {
        if (itemName.includes('wind')) {
            return this.rarity.legendary;
        } else if (itemName.includes('giant') || itemName.includes('novelty')) {
            return this.rarity.epic;
        } else if (itemName.includes('guardian') || itemName.includes('tri')) {
            return this.rarity.rare;
        } else if (itemName.includes('forked') || itemName.includes('sledgehammer')) {
            return this.rarity.uncommon;
        } else {
            return this.rarity.common;
        };
    };
};

function roll(weapon) {
    let line = [];
    if (weapon.length == 0) return line;
    for (let i = 0; i < weapon.length; i++) if (weapon[i].value.rarity >= Math.random()) line.push(weapon[i].value);
    return line;
};


exports.Weapons = Weapons;