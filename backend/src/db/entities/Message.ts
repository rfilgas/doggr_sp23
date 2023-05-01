
import {Entity, Property, Unique, ManyToMany, ManyToOne, PrimaryKey} from "@mikro-orm/core";
import { User } from "./User.js";
import type { Rel } from '@mikro-orm/core';

@Entity({ tableName: "messages"})
export class Message {

    @PrimaryKey()
    messageId!: number;

    // The person who sent the message
    @ManyToOne({primary: false})
    sender!: Rel<User>;

    // The account receiving the message
    @ManyToOne({primary: false})
    receiver!: Rel<User>;

    @Property()
    created_at = new Date();

    @Property()
    message!: string;

}

// pnpm migration:create --name "Messages"
