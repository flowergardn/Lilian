import {
	EmbedBuilder,
	ApplicationCommandType,
	UserContextMenuCommandInteraction
} from 'discord.js';
import { Discord, ContextMenu } from 'discordx';
import { getUser, getEmoji } from '../../utils/PronounsAPI';
import { prisma } from '../../index';
import * as embeds from '../../utils/Embeds';

@Discord()
export class PronounsCommand {
	@ContextMenu({
		name: 'View prefered pronouns',
		type: ApplicationCommandType.User
	})
	async pronounsContextMenu(interaction: UserContextMenuCommandInteraction) {
		const user = interaction.targetUser;

		if (user.bot) {
			await interaction.reply({
				content:
					"Sadly technology isn't advanced enough for all Discord bots to have pronouns.page accounts :(",
				ephemeral: true
			});
			return;
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

		const pronouns = apiData.allPronouns.map((pronoun) => {
			let emoji = getEmoji(pronoun.opinion);
			return `${emoji} ${pronoun.value}`;
		});

		const embed = new EmbedBuilder().setColor('#9beba7');
		embed.setTitle(`${user.username}s pronouns`);
		embed.setDescription(pronouns.join('\n'));
		await interaction.reply({
			embeds: [embed],
			ephemeral: true
		});
	}
}