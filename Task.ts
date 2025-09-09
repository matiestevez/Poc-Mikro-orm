import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Task {

  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property({ default: false })
  completed: boolean = false;

  @Property({ type: 'date' })
  createdAt = new Date();

  constructor(title: string) {
    this.title = title;
  }
}