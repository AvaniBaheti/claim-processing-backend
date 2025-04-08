import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Payer } from './payer.js';
import { User } from './user.js';

@Entity('insurance')
export class Insurance {
    @PrimaryGeneratedColumn()
    id;

    @ManyToOne(() => Payer)
    payer;

    @ManyToOne(() => User)
    user;

    @Column()
    name;

    @Column()
    policy_number;

    @Column('text')
    coverage_details;

    @CreateDateColumn()
    created_at;

    @UpdateDateColumn()
    updated_at;
}
