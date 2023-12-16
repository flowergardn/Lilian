import { User, EmbedBuilder } from 'discord.js';

export const notLinked = (user: User) => {
	const errorEmbed = new EmbedBuilder().setColor('#ff697b');
	errorEmbed.setTitle('Error!');
	errorEmbed.setDescription(
		`${user.username} has not linked their Discord to [pronouns.page](https://pronouns.page). They can do so at [pronouns.page/account](https://en.pronouns.page/account).`
	);
	errorEmbed.setImage('https://i.imgur.com/N87lJbc.png');
	return errorEmbed;
};
