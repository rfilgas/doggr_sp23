import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import {BadWord} from "../entities/BadWord.js";
import { readFileSync } from 'fs';
readFileSync('./path-to-file', 'utf-8');

export class BadWordSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		const words = readFileSync('../seedData/badwords.txt', 'utf-8');
		const badWords = words.split('\r\n');

		for (let i = 0; i < badWords.length; i++) {
			em.create(BadWord, {
				word: badWords[i],
			});
		}
	}
}