import {
	EmbedBuilder,
	ApplicationCommandType,
	UserContextMenuCommandInteraction
} from 'discord.js';
import { Discord, ContextMenu } from 'discordx';
import { getUser, getEmoji } from '../utils/PronounsAPI';
import { prisma } from '../index';
import * as embeds from '../utils/Embeds';

@Discord()
export class NamesCommand {
	@ContextMenu({
		name: 'View prefered names',
		type: ApplicationCommandType.User
	})
	async namesContextMenu(interaction: UserContextMenuCommandInteraction) {
		const user = interaction.targetUser;

		if (user.bot) {
			await interaction.reply({
				content:
					"Sadly technology isn't advanced enough for all Discord bots to have pronouns.page accounts :("
			});
		}

		let chosenUser = await prisma.user.findFirst({
			where: {
				discordId: user.id
			}
		});

		if (chosenUser == null) {
			await interaction.reply({
				embeds: [embeds.notLinked(user)],
				ephemeral: true
			});
			return;
		}

		let apiData = await getUser(chosenUser.pronounsPage);

		const _names = [];

		apiData.allNames.map((name) => {
			let emoji = getEmoji(name.opinion);
			_names.push(`${emoji} ${name.value}`);
		});

		const embed = new EmbedBuilder().setColor('#9beba7');
		embed.setTitle(`${user.username}s names`);
		embed.setDescription(_names.join('\n'));
		await interaction.reply({
			embeds: [embed],
			ephemeral: true
		});
	}
}

// add names
// add overview (names, pronouns, words)
