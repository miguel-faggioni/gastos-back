import {MigrationInterface, QueryRunner} from "typeorm";

export class prod1607487933053 implements MigrationInterface {
    name = 'prod1607487933053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "aviso_geral" ("id" SERIAL NOT NULL, "titulo" text NOT NULL, "conteudo" text NOT NULL, CONSTRAINT "PK_de4b7376c6c12a3e0099d9207e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "feedback" ("id" SERIAL NOT NULL, "quando" TIMESTAMP NOT NULL DEFAULT now(), "texto" text NOT NULL, CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuario" ("id" SERIAL NOT NULL, "email" text NOT NULL, "senha" text NOT NULL, CONSTRAINT "UQ_2863682842e688ca198eb25c124" UNIQUE ("email"), CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pessoa" ("id" SERIAL NOT NULL, "nome" text NOT NULL, "usuarioId" integer, CONSTRAINT "REL_9c0db2a74225ac3d35b72472e0" UNIQUE ("usuarioId"), CONSTRAINT "PK_bb879ac36994545a5a917a09ba5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pessoa" ADD CONSTRAINT "FK_9c0db2a74225ac3d35b72472e02" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pessoa" DROP CONSTRAINT "FK_9c0db2a74225ac3d35b72472e02"`);
        await queryRunner.query(`DROP TABLE "pessoa"`);
        await queryRunner.query(`DROP TABLE "usuario"`);
        await queryRunner.query(`DROP TABLE "feedback"`);
        await queryRunner.query(`DROP TABLE "aviso_geral"`);
    }

}
