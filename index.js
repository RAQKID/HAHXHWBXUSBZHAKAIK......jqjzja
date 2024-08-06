require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const express = require('express');
const app = express();
const port = 3000;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages] });

const prefix = '*';
const command = 'apikey';

// Read allowed channel IDs from .env and split them into an array
const allowedChannelIds = process.env.ALLOWED_CHANNEL_IDS.split(',');

// Read predefined messages from .env and split them into an array
const predefinedMessages = process.env.PREDEFINED_MESSAGES.split(';');

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (commandName === command) {
        // Check if the message was sent in one of the allowed channels
        if (allowedChannelIds.includes(message.channel.id)) {
            const randomMessage = predefinedMessages[Math.floor(Math.random() * predefinedMessages.length)];
            const embed = new EmbedBuilder()
                .setTitle('Your API Key')
                .setDescription(`***Don't share this code to everyone, someone or anyone.***\n\n__${randomMessage}__`)
                .setTimestamp();
            
            try {
                await message.author.send({ embeds: [embed] });
                message.reply('I have sent you a DM with your API Key or UserID!');
            } catch (error) {
                message.reply("I couldn't send you a DM. Please check your privacy settings.");
            }
        } else {
            message.reply('You can only use this command in specific channel(s).');
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);

// Express server
app.get('/', (req, res) => {
    res.send('Bot is running!');
});

app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}`);
});