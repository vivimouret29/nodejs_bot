'use.strict'

const { DaftBot } = require("../daftbot.js"),
    { zelda: zedIco } = require('../../resx/emojis.json'),
    { randomIntFromInterval } = require("../utils.js");

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

        this.fiRoll = [];
        this.seRoll = [];
        this.thRoll = [];
        this.foRoll = [];
        this.ffRoll = [];
    };

    setPreRoll(client) {
        this.getWeapons(client);
        
        // pre roll sword
        for (let i = 0; i < this.weapons[0].sword.length; i++) {
            let itemSet = this.weapons[0].sword[i].name.split('_'),
                _rdm = Math.random();

            if (itemSet.includes('goddess') || itemSet.includes('master') || itemSet.includes('fierce') || itemSet.includes('ages') || itemSet.includes('eightfold') || itemSet.includes('royalequip')) {
                if (_rdm < this.rarity.legendary) {
                    this.fiRoll.push(this.weapons[0].sword[i]);
                };
            } else if (itemSet.includes('lynel') || itemSet.includes('ancient') || itemSet.includes('royalguard')) {
                if (_rdm < this.rarity.epic) {
                    this.fiRoll.push(this.weapons[0].sword[i]);
                };
            } else if (itemSet.includes('moonlight') || itemSet.includes('guardian') || itemSet.includes('scythe') || itemSet.includes('soldier')) {
                if (_rdm < this.rarity.rare) {
                    this.fiRoll.push(this.weapons[0].sword[i]);
                };
            } else if (itemSet.includes('flameblade') || itemSet.includes('frostblade') || itemSet.includes('thunderblade') || itemSet.includes('rito') || itemSet.includes('koh') || itemSet.includes('demon') || itemSet.includes('gerudo')) {
                if (_rdm < this.rarity.uncommon) {
                    this.fiRoll.push(this.weapons[0].sword[i]);
                };
            } else {
                if (_rdm < this.rarity.common) {
                    this.fiRoll.push(this.weapons[0].sword[i]);
                };
            };
        };

        // pre roll claymore
        for (let i = 0; i < this.weapons[0].claymore.length; i++) {
            let itemSet = this.weapons[0].claymore[i].name.split('_'),
                _rdm = Math.random();

            if (itemSet.includes('master') || itemSet.includes('duality') || itemSet.includes('ages') || itemSet.includes('eightfold') || itemSet.includes('royalequip')) {
                if (_rdm < this.rarity.legendary) {
                    this.seRoll.push(this.weapons[0].claymore[i]);
                };
            } else if (itemSet.includes('lynel') || itemSet.includes('ancient') || itemSet.includes('royalguard')) {
                if (_rdm < this.rarity.epic) {
                    this.seRoll.push(this.weapons[0].claymore[i]);
                };
            } else if (itemSet.includes('windcleaver') || itemSet.includes('guardian') || itemSet.includes('scythe') || itemSet.includes('flameblade') || itemSet.includes('frostblade') || itemSet.includes('thunderblade') || itemSet.includes('soldier')) {
                if (_rdm < this.rarity.rare) {
                    this.seRoll.push(this.weapons[0].claymore[i]);
                };
            } else if (itemSet.includes('flamespear') || itemSet.includes('frostspear') || itemSet.includes('thunderspear') || itemSet.includes('rito') || itemSet.includes('koh') || itemSet.includes('demon') || itemSet.includes('gerudo') || itemSet.includes('biggoron')) {
                if (_rdm < this.rarity.uncommon) {
                    this.seRoll.push(this.weapons[0].claymore[i]);
                };
            } else {
                if (_rdm < this.rarity.common) {
                    this.seRoll.push(this.weapons[0].claymore[i]);
                };
            };
        };

        // pre roll shield
        for (let i = 0; i < this.weapons[0].shield.length; i++) {
            let itemSet = this.weapons[0].shield[i].name.split('_'),
                _rdm = Math.random();

            if (itemSet.includes('hylian') || itemSet.includes('hero') || itemSet.includes('royalequip')) {
                if (_rdm < this.rarity.legendary) {
                    this.thRoll.push(this.weapons[0].shield[i]);
                };
            } else if (itemSet.includes('lynel') || itemSet.includes('ancient') || itemSet.includes('royalguard') || itemSet.includes('daybreaker')) {
                if (_rdm < this.rarity.epic) {
                    this.thRoll.push(this.weapons[0].shield[i]);
                };
            } else if (itemSet.includes('guardian') || itemSet.includes('soldier')) {
                if (_rdm < this.rarity.rare) {
                    this.thRoll.push(this.weapons[0].shield[i]);
                };
            } else if (itemSet.includes('rito') || itemSet.includes('koh') || itemSet.includes('demon') || itemSet.includes('gerudo') || itemSet.includes('biggoron')) {
                if (_rdm < this.rarity.uncommon) {
                    this.thRoll.push(this.weapons[0].shield[i]);
                };
            } else {
                if (_rdm < this.rarity.common) {
                    this.thRoll.push(this.weapons[0].shield[i]);
                };
            };
        };

        // pre roll bow
        for (let i = 0; i < this.weapons[0].bow.length; i++) {
            let itemSet = this.weapons[0].bow[i].name.split('_'),
                _rdm = Math.random();

            if (itemSet.includes('light') || itemSet.includes('twilight') || itemSet.includes('skyward') || itemSet.includes('royalequip')) {
                if (_rdm < this.rarity.legendary) {
                    this.foRoll.push(this.weapons[0].bow[i]);
                };
            } else if (itemSet.includes('lynel') || itemSet.includes('ancient') || itemSet.includes('royalguard')) {
                if (_rdm < this.rarity.epic) {
                    this.foRoll.push(this.weapons[0].bow[i]);
                };
            } else if (itemSet.includes('eagle') || itemSet.includes('guardian') || itemSet.includes('soldier')) {
                if (_rdm < this.rarity.rare) {
                    this.foRoll.push(this.weapons[0].bow[i]);
                };
            } else if (itemSet.includes('falcon') || itemSet.includes('koh') || itemSet.includes('demon') || itemSet.includes('gerudo') || itemSet.includes('biggoron')) {
                if (_rdm < this.rarity.uncommon) {
                    this.foRoll.push(this.weapons[0].bow[i]);
                };
            } else {
                if (_rdm < this.rarity.common) {
                    this.foRoll.push(this.weapons[0].bow[i]);
                };
            };
        };

        // pre roll axes
        for (let i = 0; i < this.weapons[0].axes.length; i++) {
            let itemSet = this.weapons[0].axes[i].name.split('_'),
                _rdm = Math.random();

            if (itemSet.includes('wind')) {
                if (_rdm < this.rarity.legendary) {
                    this.ffRoll.push(this.weapons[0].axes[i]);
                };
            } else if (itemSet.includes('giant') || itemSet.includes('novelty')) {
                if (_rdm < this.rarity.epic) {
                    this.ffRoll.push(this.weapons[0].axes[i]);
                };
            } else if (itemSet.includes('guardian') || itemSet.includes('tri')) {
                if (_rdm < this.rarity.rare) {
                    this.ffRoll.push(this.weapons[0].axes[i]);
                };
            } else if (itemSet.includes('forked') || itemSet.includes('sledgehammer')) {
                if (_rdm < this.rarity.uncommon) {
                    this.ffRoll.push(this.weapons[0].axes[i]);
                };
            } else {
                if (_rdm < this.rarity.common) {
                    this.ffRoll.push(this.weapons[0].axes[i]);
                };
            };
        };
    };

    getWeapons(client) {
        var item = [],
            name = [],
            type = [];

        for (let d = 0; d < zedIco.length; d++) {
            item.push(client.emojis.cache.find(emoji => emoji.name === zedIco[d]));

            if (item[d] == undefined) { continue; };

            type.push(item[d].name.split('_')[0]);
            name.push(item[d].name.slice(3));

            switch (type[d]) {
                case 'sw':
                    this.fiRoll.push(item[d]);
                    break;
                case 'cl':
                    this.fiRoll.push(item[d]);
                    break;
                case 'sp':
                    this.seRoll.push(item[d]);
                    break;
                case 'th':
                    this.seRoll.push(item[d]);
                    break;
                case 'sh':
                    this.thRoll.push(item[d]);
                    break;
                case 'bw':
                    this.foRoll.push(item[d]);
                    break;
                case 'ha':
                    this.ffRoll.push(item[d]);
                    break;
                case 'ax':
                    this.ffRoll.push(item[d]);
                    break;
                case 'bo':
                    this.ffRoll.push(item[d]);
                    break;
            };
        };

        this.weapons.push({
            'sword': this.fiRoll,
            'claymore': this.seRoll,
            'shield': this.thRoll,
            'bow': this.foRoll,
            'axes': this.ffRoll
        });

        this.fiRoll = [];
        this.seRoll = [];
        this.thRoll = [];
        this.foRoll = [];
        this.ffRoll = [];
        
        return this.weapons;
    };
};

exports.Weapons = Weapons;