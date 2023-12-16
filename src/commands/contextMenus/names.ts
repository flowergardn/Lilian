import {
	EmbedBuilder,
	ApplicationCommandType,
	UserContextMenuCommandInteraction
} from 'discord.js';
import { Discord, ContextMenu } from 'discordx';
import { getEmoji, getUserByDiscord } from '../../utils/PronounsAPI';
import * as embeds from '../../utils/Embeds';

@Discord()
export class NamesCommand {
	@ContextMenu({
		name: 'View prefered names',
		type: ApplicationCommandType.User
	})
	async namesContextMenu(interaction: UserContextMenuCommandInteraction) {
		await interaction.deferReply({
			ephemeral: true
		});

		const user = interaction.targetUser;

		if (user.bot) {
			await interaction.editReply({
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

		const names = chosenUser.allNames.map((name) => {
			let emoji = getEmoji(name.opinion);
			return `${emoji} ${name.value}`;
		});

		const embed = new EmbedBuilder().setColor('#9beba7');
		embed.setTitle(`${user.globalName}s names`);
		embed.setDescription(names.join('\n'));
		await interaction.editReply({
			embeds: [embed]
		});
	}
}
