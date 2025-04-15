/* eslint-disable prettier/prettier */
import * as bcrypt from 'bcrypt';
import { BaseEntity } from 'src/base-entity';
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  last_seen_at: Date;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  city: string;

  @Column()
  address: string;

  @Column({ default: false })
  admin: boolean;

  @Column({ default: false })
  service_provider: boolean;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.password);
    } catch {
      throw new Error('Error validating password');
    }
  }
}
