/* eslint-disable prettier/prettier */
import { BaseEntity } from '../base-entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  last_seen_at: Date;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  city: string;
}
