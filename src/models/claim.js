import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.js';

@Entity('claims')
export class Claim {
    @PrimaryGeneratedColumn()
    id;

    @ManyToOne(() => User)
    user;

    @Column()
    insurance_id;

    @Column('numeric')
    amount;

    @Column()
    procedure_code;

    @Column({
        type: 'enum',
        enum: ['PENDING', 'PROCESSING', 'APPROVED', 'REJECTED', 'FUNDED'],
        default: 'PENDING'
    })
    status;

    @CreateDateColumn()
    created_at;

    @UpdateDateColumn()
    updated_at;
}
