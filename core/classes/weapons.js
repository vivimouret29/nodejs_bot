'use.strict'

const { DaftBot } = require("../daftbot.js"),
    { zeldaWeapons: zedIco } = require('../../resx/emojis.json');

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
        this.setRar = {
            lengendary: ['hylian', 'goddess', 'fierce', 'master', 'light', 'ages', 'twilight', 'skyward', 'wind', 'duality'],
            rare: [
                'hero', 'golden', 'moonlight', 'golden', 'seven', 'captain', 'sea', 'ancient', 'guardian',
                'daybreaker', 'mind', 'royalequip'
            ],
            epic: [
                'throwing', 'steel', 'lynel', 'thunderblade', 'smasher', 'gerudo', 'giant', 'frostblade',
                'flameblade', 'thunderspear', 'flamespear', 'emblazoned', 'biggoron', 'tri', 'sledgehammer',
                'novelty', 'zora', 'demon', 'windcleaver', 'duplex', 'serpentine', 'eightfold', 'phrenic',
                'royalguard', 'rito', 'frostspear'
            ],
            uncommon: [
                'double', 'lizal', 'reinforced', 'fisherman',
                'drillshaft', 'spiked', 'forked', 'koh', 'traveler',
                'soldier', 'sickle', 'broadsword', 'moblin'
            ],
            common: [
                'dragonbone', 'wooden', 'woodcutter', 'cobble',
                'boulder', 'breaker', 'bokoblin', 'torch', 'simple', 'mop', 'oar',
                'harpoon', 'hoe', 'pitchfork', 'soup', 'arm', 'hunter', 'rusty'
            ]
        };
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
                    rarity = this.setRarity(name);
                    break;
                case 'cl':
                    rarity = this.setRarity(name);
                    break;
                case 'sp':
                    rarity = this.setRarity(name);
                    break;
                case 'th':
                    rarity = this.setRarity(name);
                    break;
                case 'sh':
                    rarity = this.setRarity(name);
                    break;
                case 'bw':
                    rarity = this.setRarity(name);
                    break;
                // case 'ha':
                //     rarity = this.setRarity(name);
                //     break;
                case 'ax':
                    rarity = this.setRarity(name);
                    break;
                case 'bo':
                    rarity = this.setRarity(name);
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

    setRarity(itemName) {
        for (let rar in this.setRar) {
            for (let i = 0; i < this.setRar[rar].length; i++) {
                if (itemName.includes(this.setRar[rar][i])) {
                    switch (rar) {
                        case 'lengendary':
                            return this.rarity.legendary;
                        case 'rare':
                            return this.rarity.rare;
                        case 'epic':
                            return this.rarity.epic;
                        case 'uncommon':
                            return this.rarity.uncommon;
                        case 'common':
                            return this.rarity.common;
                    };
                };
            };
        };
        console.log('Error: ' + itemName);
    };
};

function roll(weapon) {
    let line = [];
    if (weapon.length == 0) return line;
    for (let i = 0; i < weapon.length; i++) if (weapon[i].value.rarity >= Math.random()) line.push(weapon[i].value);
    return line;
};


exports.Weapons = Weapons;