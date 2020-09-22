# bot_discord

tout d'abord, clonez le git en ssh
allez dans le dossier `bot_discord` et entrez ces lignes de commandes :
```
$ npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (bot_discord) 
version: (1.0.0) 1.0.0
description: it's a discord's bot
entry point: (index.js) main.js
test command: 
git repository: (git@gitlab.com:vivimouret29/bot_discord.git) 
keywords: 
author: mouret
license: (ISC) 
About to write to /home/daftmob/bot_discord/package.json:

{
  "name": "bot_discord",
  "version": "1.0.0",
  "description": "it's a discord's bot",
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+ssh://git@gitlab.com/vivimouret29/bot_discord.git"
  },
  "author": "mouret",
  "license": "ISC",
  "bugs": {
    "url": "https://gitlab.com/vivimouret29/bot_discord/issues"
  },
  "homepage": "https://gitlab.com/vivimouret29/bot_discord#readme"
}


Is this OK? (yes) yes
```

puis :
```
$ npm install discord.js -save
npm notice created a lockfile as package-lock.json. You should commit this file.
+ discord.js@12.3.1
added 15 packages from 17 contributors and audited 15 packages in 1.116s
found 0 vulnerabilities



   ╭────────────────────────────────────────────────────────────────╮
   │                                                                │
   │      New patch version of npm available! 6.14.4 → 6.14.8       │
   │   Changelog: https://github.com/npm/cli/releases/tag/v6.14.8   │
   │               Run npm install -g npm to update!                │
   │                                                                │
   ╰────────────────────────────────────────────────────────────────╯

```
et enfin rentrez la commande indiquée ci-dessus *(pensez au sudo si vous avez pas les droits)*


informations venant :  
https://dev.to/quentinium/creer-son-propre-bot-discord-pio#:~:text=Cr%C3%A9ation%20du%20Bot%20%3A,cliquez%20sur%20%22Add%20Bot%22

autre informations pour déployer son bot :   
https://discordpy.readthedocs.io/en/latest/discord.html
https://discord.com/developers/applications
