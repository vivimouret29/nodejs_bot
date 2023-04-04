'use.strict'

const { DaftBot } = require("../daftbot.js"),
    { zeldaArmors: zedIco } = require('../../resx/emojis.json');

class Armors extends DaftBot {
    constructor(dbClient) {
        super(dbClient);

        this.armors = [];
        this.rarity = {
            'legendary': 0.05,
            'epic': 0.1,
            'rare': 0.15,
            'uncommon': 0.2,
            'common': 0.33
        };

        this.roll = {};
        this.setRar = {
            lengendary: [
                'wild', 'korok', 'midna', 'majora', 'zant', 'hero', 'wind', 'sky',
                'time', 'twilight', 'ruta', 'naboris', 'medoh', 'rudania'
            ],
            rare: ['ancient', 'tingle', 'phantom', 'thunder', 'lynel', 'champion', 'radiant', 'royal'],
            epic: [
                'dark', 'gerudo', 'radient', 'sheikah', 'zora', 'royalguard', 'lizalfos',
                'diamond', 'fierce'
            ],
            uncommon: [
                'desert', 'flamebreaker', 'snowquill', 'soldier', 'ravio', 'salvager', 'moblin',
                'stealth'
            ],
            common: [
                'barbarian', 'climbing', 'rubber', 'well-worn', 'old', 'warm', 'bokoblin', 'lobster',
                'hylian', 'bandanna', 'sand', 'snow'
            ]
        };
    };

    setPreRoll(client) {
        this.getArmors(client);
        this.roll = {
            'head': roll(this.armors[0].head),
            'body': roll(this.armors[0].body),
            'legs': roll(this.armors[0].legs)
        };
    };

    getArmors(client) {
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
                case 'hd':
                    rarity = this.setRarity(name, rarity);
                    break;
                case 'bd':
                    rarity = this.setRarity(name, rarity);
                    break;
                case 'lg':
                    rarity = this.setRarity(name, rarity);
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

        this.armors.push({
            "head": item.filter(item => item.value.type === 'hd'),
            "body": item.filter(item => item.value.type === 'bd'),
            "legs": item.filter(item => item.value.type === 'lg')
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

exports.Armors = Armors;