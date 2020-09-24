require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const {
    ErelaClient
} = require('erela.js');

const mongoose = require('mongoose');

const StateManager = require("./utils/StateManager");
const {
    registerCommands,
    registerEvents,
    registerMusicEvents
} = require('./utils/register');

(async () => {
    client.commands = new Map();
    client.aliases = new Map();
    await registerCommands(client, '../commands');
    await registerEvents(client, '../events');

    await client.login(process.env.BOT_TOKEN);

    /* client.music = new ErelaClient(client, [{
        host: process.env.HOST,
        port: process.env.PORT,
        password: process.env.PASSWORD
    }]);
    await registerMusicEvents(client.music, '../musicEvents'); */

    client.mongoose = require('../database/db');
    client.mongoose.init();
})();
