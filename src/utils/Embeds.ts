import { User, EmbedBuilder } from 'discord.js';

export const notLinked = (user: User) => {
	const errorEmbed = new EmbedBuilder().setColor('#ff697b');
	errorEmbed.setTitle('Error!');
	errorEmbed.setDescription(`${user.username} has not linked their pronouns.page :c`);
	errorEmbed.setFooter({
		text: `You should yell at them to link theirs.`
	});
	return errorEmbed;
};
