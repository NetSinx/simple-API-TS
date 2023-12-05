import { MigrationInterface, QueryRunner } from "typeorm";

export class User1701735269874 implements MigrationInterface {
    name = 'User1701735269874'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "nama"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "nama" character varying(200) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "nama"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "nama" character(200) NOT NULL`);
    }

}
