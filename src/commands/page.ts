import {
	CommandInteraction,
	ApplicationCommandOptionType,
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonInteraction,
	ButtonStyle,
	APIEmbedField,
	GuildMember
} from 'discord.js';
import { Slash, Discord, SlashOption, ButtonComponent } from 'discordx';
import { getUserByDiscord, getEmoji } from '../utils/PronounsAPI';
import * as embeds from '../utils/Embeds';

@Discord()
export class PageCommand {
	@Slash({ name: 'page', description: 'View a members names, pronouns, and more!' })
	async setup(
		@SlashOption({
			description: 'The member to search for',
			name: 'member',
			required: true,
			type: ApplicationCommandOptionType.User
		})
		member: GuildMember,
		interaction: CommandInteraction
	) {
		await interaction.deferReply({
			ephemeral: true
		});

		try {
			await interaction.guild.members.fetch();
		} catch (err) {
			await interaction.editReply({
				content: 'Could not fetch members. Are permissions set up correctly?'
			});
			return;
		}

		const { user } = member;

		if (!user) {
			await interaction.editReply({
				content: "Could not find that member. Are you sure they're in this server?"
			});
			return;
		}

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

		const pronouns = chosenUser.allPronouns.map((pronoun) => {
			let emoji = getEmoji(pronoun.opinion);
			return `${emoji} ${pronoun.value}`;
		});
		const names = chosenUser.allNames.map((name) => {
			let emoji = getEmoji(name.opinion);
			return `${emoji} ${name.value}`;
		});

		const embed = new EmbedBuilder().setColor('#9beba7');
		embed.setAuthor({
			name: chosenUser.username,
			iconURL: chosenUser.avatar,
			url: `https://en.pronouns.page/@${chosenUser.username}`
		});

		const embedDesc = [`🍰 Age: ${chosenUser.age}`];

		if (chosenUser.description && chosenUser.description.length > 0)
			embedDesc.push(`>>> ${chosenUser.description}`);

		embed.setDescription(embedDesc.join('\n'));

		embed.addFields([
			{
				name: 'Pronouns',
				value: pronouns.join('\n'),
				inline: true
			},
			{
				name: 'Names',
				value: names.join('\n'),
				inline: true
			}
		]);

		const button = new ButtonBuilder()
			.setLabel('View words')
			.setStyle(ButtonStyle.Primary)
			.setCustomId(`words_${member.id}`);
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

		await interaction.editReply({
			embeds: [embed],
			components: [row]
		});
	}

	@ButtonComponent({
		id: /words_[0-9]{0,25}/
	})
	async handler(interaction: ButtonInteraction): Promise<void> {
		await interaction.deferReply({
			ephemeral: true
		});

		const discordId = interaction.customId.split('_')[1];

		let apiData = await getUserByDiscord(discordId);

		let fields: APIEmbedField[] = apiData.words.map((category) => {
			const fieldName = '‎';
			let fieldValues = [];

			category.values.forEach((word) => {
				let emoji = getEmoji(word.opinion);
				fieldValues.push(`${emoji} ${word.value}`);
			});

			return {
				name: fieldName,
				value: fieldValues.join('\n')
			};
		});

		const embed = new EmbedBuilder().setColor('#9beba7');
		embed.setTitle(`Words to use and what not to use`);
		embed.setFields(fields);
		await interaction.editReply({
			embeds: [embed]
		});
	}
}
