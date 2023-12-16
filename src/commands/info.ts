import { Discord, Slash } from 'discordx';
import {
	ActionRowBuilder,
	bold,
	ButtonBuilder,
	ButtonStyle,
	ClientUser,
	CommandInteraction,
	EmbedBuilder
} from 'discord.js';
import { client } from '../index';

@Discord()
class Info {
	@Slash({ name: 'info', description: 'Find out more information about the bot' })
	async info(interaction: CommandInteraction) {
		let user: ClientUser;
		if (!client.user) return;
		user = client.user;

		const servers = (await client.guilds.fetch()).size;

		const embed = new EmbedBuilder();
		embed.setTitle('Info');
		embed.setDescription(
			`${user.username} is a bot created by [astrid](https://twitter.com/maybeastrid)`
		);
		embed.addFields([
			{
				name: 'Servers',
				value: bold(`${servers}`),
				inline: true
			}
		]);

		const button = new ButtonBuilder()
			.setLabel('View on GitHub')
			.setStyle(ButtonStyle.Link)
			.setURL('https://github.com/astridlol/Lilian');

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

		await interaction.reply({
			components: [row],
			embeds: [embed],
			ephemeral: true
		});
	}
}
