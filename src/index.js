require('dotenv').config();
const { Client, Intents, Collection } = require('discord.js');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
    ],
    partials: [
        'MESSAGE',
        'GUILD_MEMBER',
        'USER',
        'CHANNEL',
    ],
});

['commands', 'aliases'].forEach(f => client[f] = new Collection());
['commands', 'events'].forEach(f => require(`./handlers/${f}`)(client));

client.login(process.env.token);