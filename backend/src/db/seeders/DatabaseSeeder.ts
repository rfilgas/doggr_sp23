import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import {UserSeeder} from "./UserSeeder.js";
import {MessageSeeder} from "./MessageSeeder.js";
import {BadWordSeeder} from "./BadWordSeeder.js";

export class DatabaseSeeder extends Seeder {

	async run(em: EntityManager): Promise<void> {
		return this.call(em, [
			UserSeeder,
			MessageSeeder,
			BadWordSeeder
		]);
	}

}
