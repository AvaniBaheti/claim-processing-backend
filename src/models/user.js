import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id;

    @Column()
    name;

    @Column({ unique: true })
    email;

    @Column()
    password;

    @Column({
        type: 'enum',
        enum: ['patient', 'employee', 'admin', 'doctor', 'hospitalStaff'],
        default: 'patient'
    })
    role;

    @CreateDateColumn()
    created_at;

    @UpdateDateColumn()
    updated_at;
}
