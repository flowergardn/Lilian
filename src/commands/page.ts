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
import { prisma } from '../index';
import { getUser, getEmoji } from '../utils/PronounsAPI';
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

		
		await member.fetch()

		const {user} = member

		if(!user) {
			console.log(member)
			await interaction.reply({
				content: "Could not find that member. Are you sure they're in this server?",
				ephemeral: true
			})
			return;
		}

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
		const names = apiData.allNames.map((name) => {
			let emoji = getEmoji(name.opinion);
			return `${emoji} ${name.value}`;
		});

		const embed = new EmbedBuilder().setColor('#9beba7');
		embed.setAuthor({
			name: apiData.username,
			iconURL: apiData.avatar,
			url: `https://en.pronouns.page/@${apiData.username}`
		});
		embed.setDescription(`🍰 Age: ${apiData.age}\n> ${apiData.description ?? ''}`);

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

		await interaction.reply({
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

		const id = interaction.customId.split('_')[1];

		let chosenUser = await prisma.user.findFirst({
			where: {
				discordId: id
			}
		});

		let apiData = await getUser(chosenUser.pronounsPage);

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
