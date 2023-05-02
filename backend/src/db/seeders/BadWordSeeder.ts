import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import {BadWord} from "../entities/BadWord.js";
import { readFileSync } from 'fs';
import path from "path";

export class BadWordSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		const dir = path.resolve("./src/db/seeders/badwords.txt");
		const words = readFileSync(dir, 'utf-8');
		const badWords = words.split('\r\n');

		for (let i = 0; i < badWords.length; i++) {
			await em.upsert(BadWord, {
				word: badWords[i],
			});
		}
	}
}