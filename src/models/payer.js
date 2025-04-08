import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('payers')
export class Payer {
    @PrimaryGeneratedColumn()
    id;

    @Column()
    name;

    @Column('text')
    address;

    @Column()
    contact_email;

    @Column()
    contact_phone;

    @CreateDateColumn()
    created_at;

    @UpdateDateColumn()
    updated_at;
}
