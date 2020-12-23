import {MigrationInterface, QueryRunner} from "typeorm";

export class prod1608740548290 implements MigrationInterface {
    name = 'prod1608740548290'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "jobs_to_run" ("id" SERIAL NOT NULL, "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "dia_do_mes_pra_rodar" smallint NOT NULL, "tabela" text NOT NULL, "id_da_entidade" integer NOT NULL, "sql" text NOT NULL, CONSTRAINT "PK_18f9002e4b42e821df4b9121476" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "jobs_to_run"`);
    }

}
