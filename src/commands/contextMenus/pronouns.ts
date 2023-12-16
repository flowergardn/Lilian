import {
	EmbedBuilder,
	ApplicationCommandType,
	UserContextMenuCommandInteraction
} from 'discord.js';
import { Discord, ContextMenu } from 'discordx';
import { getUserByDiscord, getEmoji } from '../../utils/PronounsAPI';
import * as embeds from '../../utils/Embeds';

@Discord()
export class PronounsCommand {
	@ContextMenu({
		name: 'View prefered pronouns',
		type: ApplicationCommandType.User
	})
	async pronounsContextMenu(interaction: UserContextMenuCommandInteraction) {
		await interaction.deferReply({
			ephemeral: true
		});

		const user = interaction.targetUser;

		if (user.bot) {
			await interaction.reply({
				content:
					"Sadly technology isn't advanced enough for all Discord bots to have pronouns.page accounts :("
			});
			return;
		}

		let chosenUser = await getUserByDiscord(user.id);

		if (chosenUser == null) {
			await interaction.editReply({
				embeds: [embeds.notLinked(user)]
			});
			return;
		}

		const pronouns = chosenUser.allPronouns.map((pronoun) => {
			let emoji = getEmoji(pronoun.opinion);
			return `${emoji} ${pronoun.value}`;
		});

		const embed = new EmbedBuilder().setColor('#9beba7');
		embed.setTitle(`${user.globalName}s pronouns`);
		embed.setDescription(pronouns.join('\n'));
		await interaction.editReply({
			embeds: [embed]
		});
	}
}
