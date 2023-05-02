import {BadWord} from "./db/entities/BadWord.js";
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";

export async function hasBadWord(message: string, req: FastifyRequest): Promise<boolean> {
	const words = message.split(' ');
	for (let i = 0; i < words.length; i++) {
		const word = words[i];
		const badWordsFound = await req.em.count(BadWord, {word: word});
		if (badWordsFound > 0) {
			return true;
		}
	}
	return false;
}
export function passwordNotValid(password: string): boolean {
	const adminPassword = process.env.ADMIN_PASS;
	if (password !== adminPassword) {
		return true;
	}
	return false;
}