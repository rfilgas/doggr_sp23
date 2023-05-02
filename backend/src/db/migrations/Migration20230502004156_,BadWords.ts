import { Migration } from '@mikro-orm/migrations';

export class Migration20230502004156 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "bad_word" ("word" varchar(255) not null, constraint "bad_word_pkey" primary key ("word"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "bad_word" cascade;');
  }

}
