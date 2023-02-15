import {
	CommandInteraction,
	ApplicationCommandOptionType,
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonInteraction,
	ButtonStyle,
	spoiler
} from 'discord.js';
import { Slash, Discord, SlashOption, ButtonComponent } from 'discordx';
import { prisma } from '../index';
import { getUser } from '../utils/PronounsAPI';

const randomWords = (amount) => {
	let string = '';
	for (var i = 0; i < amount; i++) {
		const word = require('random-word')();
		if (string.length > 0) string += ` ${word}`;
		else string = word;
	}
	return string;
};

@Discord()
export class SetupCommand {
	@Slash({ name: 'setup', description: 'Setup your pronouns.page.' })
	async setup(
		@SlashOption({
			description: 'Your pronouns.page username',
			name: 'username',
			required: true,
			type: ApplicationCommandOptionType.String
		})
		username: string,
		interaction: CommandInteraction
	) {
		let user = await prisma.user.findFirst({
			where: {
				discordId: interaction.user.id
			}
		});

		if (user != null && user.verified) {
			interaction.reply({
				content: `You've already linked your pronouns.page!`,
				ephemeral: true
			});
			return;
		} else if (user == null) {
			user = await prisma.user.create({
				data: {
					discordId: interaction.user.id,
					verificationPhrase: randomWords(5),
					pronounsPage: username
				}
			});
		}

		let phrase = user.verificationPhrase;

		const embed = new EmbedBuilder();
		embed.setColor('#ffc7fc');
		embed.setTitle('Setting up');
		embed.setDescription(
			"In order to link your pronouns.page, enter the words below into your pronouns.page description. Then, click the button below once you're done."
		);
		embed.setFields([
			{
				name: 'Words',
				value: phrase
			}
		]);

		const button = new ButtonBuilder()
			.setLabel('Link account')
			.setStyle(ButtonStyle.Primary)
			.setCustomId(`link_${username}`);
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

		await interaction.reply({
			embeds: [embed],
			components: [row],
			ephemeral: true
		});
	}

	@ButtonComponent({ id: /link_[A-Za-z_\-0-9]{0,24}/ })
	async handler(interaction: ButtonInteraction): Promise<void> {
		let user = await prisma.user.findFirst({
			where: {
				discordId: interaction.user.id
			}
		});

		const pronounAccount = await getUser(user.pronounsPage);

		const { description: desc } = pronounAccount;

		if (!desc.includes(user.verificationPhrase)) {
			await interaction.reply({
				content: `Please enter the words into your description to link your account!\n${spoiler(
					'you can clear them after :)'
				)}`,
				ephemeral: true
			});
			return;
		}

		const embed = new EmbedBuilder().setColor('#9beba7');
		embed.setTitle('Success!');
		embed.setDescription('You have successfully verified your pronouns.page!');
		embed.setFooter({
			text: 'You can now remove the words from your description'
		});

		await interaction.reply({
			embeds: [embed],
			ephemeral: true
		});

		await prisma.user.update({
			where: {
				discordId: interaction.user.id
			},
			data: {
				verified: true
			}
		});
	}
}
