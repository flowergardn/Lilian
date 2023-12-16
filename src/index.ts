import 'reflect-metadata';

import { importx } from '@discordx/importer';
import { Client } from 'discordx';
import NodeCache from 'node-cache';
import { CommandInteraction, EmbedBuilder, GatewayIntentBits } from 'discord.js';

require('dotenv').config();

const commandCache = new NodeCache({ stdTTL: 2.5 });

export const client = new Client({
	intents: [GatewayIntentBits.GuildMembers],
	silent: false
});

client.on('ready', async () => {
	await client.clearApplicationCommands();
	await client.initApplicationCommands();

	console.log('> Bot online, logged in as: ' + client.user!!.tag);
});

client.on('interactionCreate', (interaction) => {
	if (interaction instanceof CommandInteraction) {
		let name = interaction.commandName;
		if (commandCache.has(name)) {
			const embed = new EmbedBuilder();
			embed.setDescription('⏱ This command was used recently, please wait');

			interaction.reply({
				ephemeral: true,
				embeds: [embed]
			});
			return;
		}
		commandCache.set(name, true);
	}

	client.executeInteraction(interaction);
});

async function start() {
	await importx(__dirname + '/commands/*.{js,ts}');
	await importx(__dirname + '/commands/*/*.{js,ts}');
	await client.login(process.env.TOKEN!!);
}

start();
