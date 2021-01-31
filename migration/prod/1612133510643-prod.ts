import {MigrationInterface, QueryRunner} from "typeorm";

export class prod1612133510643 implements MigrationInterface {
    name = 'prod1612133510643'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "debito_automatico" ADD "tipo" "gasto_tipo_enum" NOT NULL DEFAULT 'Fixo'`);
      await queryRunner.query(`ALTER TABLE "debito_automatico" ADD "obs" text NOT NULL DEFAULT 'Débito automático'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "debito_automatico" DROP COLUMN "obs"`);
      await queryRunner.query(`ALTER TABLE "debito_automatico" DROP COLUMN "tipo"`);
    }

}
