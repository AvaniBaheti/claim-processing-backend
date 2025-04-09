import { EntitySchema } from 'typeorm';

export const User = new EntitySchema({
    name: "User",
    tableName: "Users",
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
        email: {
            type: "varchar",
            unique: true,
            nullable: false
        },
        password: {
            type: "varchar",
            nullable: false,
            select: false
        },
        created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP"
        },
        updated_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP"
        }
    }
});
