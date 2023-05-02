import {Entity, Property, Unique, ManyToOne, PrimaryKey} from "@mikro-orm/core";
@Entity()
export class BadWord {
    @PrimaryKey()
    word!: string;
}