import axios from 'axios';
import PageData from '../interfaces/PageData';
import { EnglishProfile, Opinion } from '../interfaces/PageData';

interface UserResponse {
	data: PageData;
}

class User {
	private profile: EnglishProfile;

	constructor(r: UserResponse) {
		this.profile = r.data.profiles.en;
	}

	get description() {
		return this.profile.description;
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
}

export const getUser = async (name: string): Promise<User> => {
	let resp: UserResponse;
	try {
		resp = await axios.get(`https://en.pronouns.page/api/profile/get/${name}?version=2`);
	} catch (err) {
		console.log(err);
	}
	return new User(resp);
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
	}
};
