import axios from 'axios';
import PageData from '../interfaces/PageData';
import { EnglishProfile } from '../interfaces/PageData';

interface UserResponse {
	data: PageData;
}

class User {
	private data: UserResponse;
	private profile: EnglishProfile;

	constructor(r: UserResponse) {
		this.data = r;
		this.profile = r.data.profiles.en;
	}

	get description() {
		return this.profile.description;
	}
}

export const getUser = async (name: string): Promise<User> => {
	console.log(`getting user ${name}`);
	let resp: UserResponse;
	try {
		resp = await axios.get(`https://en.pronouns.page/api/profile/get/${name}?version=2`);
		console.log(`successfully fetched`);
	} catch (err) {
		console.log(err);
	}
	return new User(resp);
};
