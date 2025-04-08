import { EntitySchema } from 'typeorm';

export const Payer = new EntitySchema({
    name: "Payer",
    tableName: "Payers",
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
        password: {
            type: "varchar",
            nullable: false
        },
        address: {
            type: "text",
            nullable: false
        },
        email: {
            type: "varchar",
            unique: true,
            nullable: false
        },
        phone: {
            type: "varchar",
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
    }
});
