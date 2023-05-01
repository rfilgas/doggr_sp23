import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import {User} from "../entities/User.js";
import {Message} from "../entities/Message.js";

export class MessageSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {

		em.create(Message, {
			sender: await em.findOne(User, { email: 'email@email.com' }),
			receiver: await em.findOne(User, { email: 'email2@email.com' }),
			message: "hello pal"
		});

		em.create(Message, {
			sender: await em.findOne(User, { email: 'email@email.com' }),
			receiver: await em.findOne(User, { email: 'email2@email.com' }),
			message: "what's going on?"
		});

		em.create(Message, {
			sender: await em.findOne(User, { email: 'email2@email.com' }),
			receiver: await em.findOne(User, { email: 'email@email.com' }),
			message: "hello back buddy"
		});

		em.create(Message, {
			sender: await em.findOne(User, { email: 'email@email.com' }),
			receiver: await em.findOne(User, { email: 'email3@email.com' }),
			message: "hello Doglord"
		});

		em.create(Message, {
			sender: await em.findOne(User, { email: 'email3@email.com' }),
			receiver: await em.findOne(User, { email: 'email@email.com' }),
			message: "Hi Spot"
		});

		em.create(Message, {
			sender: await em.findOne(User, { email: 'email@email.com' }),
			receiver: await em.findOne(User, { email: 'email2@email.com' }),
			message: "don't call me buddy."
		});

	}

}
