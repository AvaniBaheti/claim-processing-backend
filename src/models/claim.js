import { EntitySchema } from 'typeorm';

export const Claim = new EntitySchema({
    name: "Claim",
    tableName: "Claims",
    columns: {
        id: {
            type: "uuid", 
            primary: true,
            generated: "uuid", 
            default: () => `gen_random_uuid()` 
        },
        insurance_id: {
            type: "uuid",
            nullable: false
        },
        amount: {
            type: "numeric",
            nullable: false
        },
        procedure_code: {
            type: "varchar",
            nullable: false
        },
        status: {
            type: "varchar",
            nullable: false,
            default: 'PENDING'
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
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: true,
            onDelete: "CASCADE"
        },
        insurance: {
            type: "many-to-one",      
            target: "Insurance",     
            joinColumn: { name: "insurance_id", referencedColumnName: "id" },
            onDelete: "CASCADE"      
        }
    }
});
