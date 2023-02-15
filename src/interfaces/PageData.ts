export type Opinion = 'close' | 'yes' | 'meh' | 'no';

interface Options {
	value: String;
	opinion: Opinion;
}

export interface EnglishProfile {
	names: Options[];
	pronouns: Options[];
	description: string;
	age: number;
	links: string[];
	words: {
		values: Options[];
	}[];
}

export default interface PageData {
	id: string;
	username: string;
	avatar: string;
	profiles: {
		en: EnglishProfile;
	};
}
