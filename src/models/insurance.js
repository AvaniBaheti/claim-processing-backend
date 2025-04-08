import { EntitySchema } from 'typeorm';
import { Payer } from './payer.js';
import { User } from './user.js';
import { v4 as uuidv4 } from 'uuid'; 

export const Insurance = new EntitySchema({
    name: "Insurance",
    tableName: "Insurance",
    columns: {
        id: {
            type: "uuid", 
            primary: true,
            generated: "uuid", 
            default: () => `gen_random_uuid()` 
        },
        name: {
            type: "varchar",
            nullable: false
        },
        policy_number: {
            type: "varchar",
            nullable: false
        },
        coverage_details: {
            type: "text",
            nullable: false
        },
        maximum_amount: {
            type: "numeric",
            nullable: false
        },
        created_at: {
            type: "timestamp",
            createDate: true,
            default: () => "CURRENT_TIMESTAMP"
        },
        updated_at: {
            type: "timestamp",
            updateDate: true,
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP"
        }
    },
    relations: {
        payer: {
            type: "many-to-one",
            target: "Payer",
            joinColumn: true,
            onDelete: "CASCADE"
        },
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: true,
            onDelete: "CASCADE"
        }
    }
});
