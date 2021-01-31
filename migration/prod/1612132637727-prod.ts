import {MigrationInterface, QueryRunner} from "typeorm";

export class prod1612132637727 implements MigrationInterface {
    name = 'prod1612132637727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "gasto_tipo_enum" AS ENUM('Fixo', 'Variável', 'Renda')`);
        await queryRunner.query(`ALTER TABLE "gasto" ADD "tipo" "gasto_tipo_enum" NOT NULL DEFAULT 'Variável'`);
        await queryRunner.query(`ALTER TABLE "gasto" ADD "obs" text NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gasto" DROP COLUMN "obs"`);
        await queryRunner.query(`ALTER TABLE "gasto" DROP COLUMN "tipo"`);
        await queryRunner.query(`DROP TYPE "gasto_tipo_enum"`);
    }

}
