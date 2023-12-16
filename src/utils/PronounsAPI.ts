import axios from 'axios';
import PageData from '../interfaces/PageData';
import { EnglishProfile, Opinion } from '../interfaces/PageData';

import NodeCache from 'node-cache';

const dataCache = new NodeCache({
	stdTTL: 60
});

interface UserResponse {
	data: PageData;
}

class User {
	private profile: EnglishProfile;
	private data: PageData;

	constructor(r: UserResponse) {
		this.data = r.data;
		this.profile = r.data.profiles.en;
	}

	get description() {
		let { description } = this.profile;
		return description ?? '';
	}

	get age() {
		return this.profile.age;
	}

	get pronouns() {
		return this.allPronouns.shift();
	}

	get allPronouns() {
		return this.profile.pronouns;
	}

	get allNames() {
		return this.profile.names;
	}

	get words() {
		return this.profile.words;
	}

	get username() {
		return this.data.username;
	}

	get avatar() {
		return this.data.avatar;
	}
}

const getUser = async (name: string): Promise<User> => {
	let resp: UserResponse;
	try {
		resp = await axios.get(`https://en.pronouns.page/api/profile/get/${name}?version=2`);
	} catch (err) {
		console.log(err);
	}

	return new User(resp);
};

export const getUserByDiscord = async (discordId: string): Promise<User> => {
	const hasCache = dataCache.has(discordId);
	if (hasCache) return dataCache.get(discordId) as User;

	let resp: {
		data: string;
	};
	try {
		resp = await axios.get(`https://en.pronouns.page/api/user/social-lookup/discord/${discordId}`);
	} catch (err) {
		console.log(err);
	}

	const user = getUser(resp.data);
	dataCache.set(discordId, user);

	return user;
};

export const getEmoji = (type: Opinion) => {
	switch (type) {
		case 'yes':
			return '💖';
		case 'no':
			return '❌';
		case 'close':
			return '<:close_friends:1075426436174848011>';
		case 'meh':
			return '👍';
		case 'jokingly':
			return '😜';
		default: {
			console.log(`${type} was not specified.`);
			return '❔';
		}
	}
};
