import {MigrationInterface, QueryRunner} from "typeorm";

export class prod1607490669027 implements MigrationInterface {
    name = 'prod1607490669027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "data" ("unix_timestamp" bigint NOT NULL, "dia" smallint NOT NULL, "mes" smallint NOT NULL, "ano" smallint NOT NULL, "dia_da_semana" smallint NOT NULL, "semana_do_ano" smallint NOT NULL, "hora" smallint NOT NULL, "minuto" smallint NOT NULL, "segundo" smallint NOT NULL, CONSTRAINT "PK_ae9831c7950755ea00b772f43c4" PRIMARY KEY ("unix_timestamp"))`);
        await queryRunner.query(`CREATE TABLE "debito_automatico" ("id" SERIAL NOT NULL, "dia_do_mes" smallint NOT NULL, "valor" numeric(13,2) NOT NULL, "categoriaId" integer, "modoDePagamentoId" integer, "pessoaId" integer, CONSTRAINT "PK_76797bf0f29de34dac8ee5a058a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "modo_de_pagamento" ("id" SERIAL NOT NULL, "nome" text NOT NULL, "sigla" text NOT NULL, "icone" text NOT NULL, "pessoaId" integer, CONSTRAINT "PK_226d55583d0c06684c824728675" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gasto" ("id" SERIAL NOT NULL, "valor" numeric(13,2) NOT NULL, "dataUnixTimestamp" bigint, "categoriaId" integer, "modoDePagamentoId" integer, "pessoaId" integer, CONSTRAINT "PK_cf2336fd738eaca8aab31dcb07b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categoria" ("id" SERIAL NOT NULL, "nome" text NOT NULL, "sigla" text NOT NULL, "icone" text NOT NULL, "pessoaId" integer, CONSTRAINT "PK_f027836b77b84fb4c3a374dc70d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "debito_automatico" ADD CONSTRAINT "FK_e241a052a9415ea06a73a580a32" FOREIGN KEY ("categoriaId") REFERENCES "categoria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "debito_automatico" ADD CONSTRAINT "FK_deb981a43f104507e47a74ec188" FOREIGN KEY ("modoDePagamentoId") REFERENCES "modo_de_pagamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "debito_automatico" ADD CONSTRAINT "FK_7109b2af48a703147ca1922d00f" FOREIGN KEY ("pessoaId") REFERENCES "pessoa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "modo_de_pagamento" ADD CONSTRAINT "FK_db275d2995dd3620a7d266b474b" FOREIGN KEY ("pessoaId") REFERENCES "pessoa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gasto" ADD CONSTRAINT "FK_8e5a2ea02f1313849b9b9f8dbf8" FOREIGN KEY ("dataUnixTimestamp") REFERENCES "data"("unix_timestamp") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gasto" ADD CONSTRAINT "FK_b169905d113ec772de065a884c3" FOREIGN KEY ("categoriaId") REFERENCES "categoria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gasto" ADD CONSTRAINT "FK_67eb1214a9486efba5135571cd7" FOREIGN KEY ("modoDePagamentoId") REFERENCES "modo_de_pagamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gasto" ADD CONSTRAINT "FK_5ba13238b92e725f83e3ed9f3dc" FOREIGN KEY ("pessoaId") REFERENCES "pessoa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categoria" ADD CONSTRAINT "FK_4a9b8e5fefb1449da0381c6d94e" FOREIGN KEY ("pessoaId") REFERENCES "pessoa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categoria" DROP CONSTRAINT "FK_4a9b8e5fefb1449da0381c6d94e"`);
        await queryRunner.query(`ALTER TABLE "gasto" DROP CONSTRAINT "FK_5ba13238b92e725f83e3ed9f3dc"`);
        await queryRunner.query(`ALTER TABLE "gasto" DROP CONSTRAINT "FK_67eb1214a9486efba5135571cd7"`);
        await queryRunner.query(`ALTER TABLE "gasto" DROP CONSTRAINT "FK_b169905d113ec772de065a884c3"`);
        await queryRunner.query(`ALTER TABLE "gasto" DROP CONSTRAINT "FK_8e5a2ea02f1313849b9b9f8dbf8"`);
        await queryRunner.query(`ALTER TABLE "modo_de_pagamento" DROP CONSTRAINT "FK_db275d2995dd3620a7d266b474b"`);
        await queryRunner.query(`ALTER TABLE "debito_automatico" DROP CONSTRAINT "FK_7109b2af48a703147ca1922d00f"`);
        await queryRunner.query(`ALTER TABLE "debito_automatico" DROP CONSTRAINT "FK_deb981a43f104507e47a74ec188"`);
        await queryRunner.query(`ALTER TABLE "debito_automatico" DROP CONSTRAINT "FK_e241a052a9415ea06a73a580a32"`);
        await queryRunner.query(`DROP TABLE "categoria"`);
        await queryRunner.query(`DROP TABLE "gasto"`);
        await queryRunner.query(`DROP TABLE "modo_de_pagamento"`);
        await queryRunner.query(`DROP TABLE "debito_automatico"`);
        await queryRunner.query(`DROP TABLE "data"`);
    }

}
