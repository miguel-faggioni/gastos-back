import {MigrationInterface, QueryRunner} from "typeorm";

export class prod1607645344636 implements MigrationInterface {
    name = 'prod1607645344636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "debito_automatico" DROP CONSTRAINT "FK_e241a052a9415ea06a73a580a32"`);
        await queryRunner.query(`ALTER TABLE "debito_automatico" DROP CONSTRAINT "FK_deb981a43f104507e47a74ec188"`);
        await queryRunner.query(`ALTER TABLE "debito_automatico" DROP CONSTRAINT "FK_7109b2af48a703147ca1922d00f"`);
        await queryRunner.query(`ALTER TABLE "debito_automatico" ALTER COLUMN "categoriaId" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "debito_automatico"."categoriaId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "debito_automatico" ALTER COLUMN "modoDePagamentoId" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "debito_automatico"."modoDePagamentoId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "debito_automatico" ALTER COLUMN "pessoaId" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "debito_automatico"."pessoaId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "modo_de_pagamento" DROP CONSTRAINT "FK_db275d2995dd3620a7d266b474b"`);
        await queryRunner.query(`ALTER TABLE "modo_de_pagamento" ALTER COLUMN "pessoaId" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "modo_de_pagamento"."pessoaId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gasto" DROP CONSTRAINT "FK_8e5a2ea02f1313849b9b9f8dbf8"`);
        await queryRunner.query(`ALTER TABLE "gasto" DROP CONSTRAINT "FK_b169905d113ec772de065a884c3"`);
        await queryRunner.query(`ALTER TABLE "gasto" DROP CONSTRAINT "FK_67eb1214a9486efba5135571cd7"`);
        await queryRunner.query(`ALTER TABLE "gasto" DROP CONSTRAINT "FK_5ba13238b92e725f83e3ed9f3dc"`);
        await queryRunner.query(`ALTER TABLE "gasto" ALTER COLUMN "dataUnixTimestamp" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "gasto"."dataUnixTimestamp" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gasto" ALTER COLUMN "categoriaId" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "gasto"."categoriaId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gasto" ALTER COLUMN "modoDePagamentoId" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "gasto"."modoDePagamentoId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gasto" ALTER COLUMN "pessoaId" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "gasto"."pessoaId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "categoria" DROP CONSTRAINT "FK_4a9b8e5fefb1449da0381c6d94e"`);
        await queryRunner.query(`ALTER TABLE "categoria" ALTER COLUMN "pessoaId" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "categoria"."pessoaId" IS NULL`);
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
        await queryRunner.query(`COMMENT ON COLUMN "categoria"."pessoaId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "categoria" ALTER COLUMN "pessoaId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categoria" ADD CONSTRAINT "FK_4a9b8e5fefb1449da0381c6d94e" FOREIGN KEY ("pessoaId") REFERENCES "pessoa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`COMMENT ON COLUMN "gasto"."pessoaId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gasto" ALTER COLUMN "pessoaId" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "gasto"."modoDePagamentoId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gasto" ALTER COLUMN "modoDePagamentoId" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "gasto"."categoriaId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gasto" ALTER COLUMN "categoriaId" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "gasto"."dataUnixTimestamp" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gasto" ALTER COLUMN "dataUnixTimestamp" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "gasto" ADD CONSTRAINT "FK_5ba13238b92e725f83e3ed9f3dc" FOREIGN KEY ("pessoaId") REFERENCES "pessoa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gasto" ADD CONSTRAINT "FK_67eb1214a9486efba5135571cd7" FOREIGN KEY ("modoDePagamentoId") REFERENCES "modo_de_pagamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gasto" ADD CONSTRAINT "FK_b169905d113ec772de065a884c3" FOREIGN KEY ("categoriaId") REFERENCES "categoria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gasto" ADD CONSTRAINT "FK_8e5a2ea02f1313849b9b9f8dbf8" FOREIGN KEY ("dataUnixTimestamp") REFERENCES "data"("unix_timestamp") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`COMMENT ON COLUMN "modo_de_pagamento"."pessoaId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "modo_de_pagamento" ALTER COLUMN "pessoaId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "modo_de_pagamento" ADD CONSTRAINT "FK_db275d2995dd3620a7d266b474b" FOREIGN KEY ("pessoaId") REFERENCES "pessoa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`COMMENT ON COLUMN "debito_automatico"."pessoaId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "debito_automatico" ALTER COLUMN "pessoaId" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "debito_automatico"."modoDePagamentoId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "debito_automatico" ALTER COLUMN "modoDePagamentoId" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "debito_automatico"."categoriaId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "debito_automatico" ALTER COLUMN "categoriaId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "debito_automatico" ADD CONSTRAINT "FK_7109b2af48a703147ca1922d00f" FOREIGN KEY ("pessoaId") REFERENCES "pessoa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "debito_automatico" ADD CONSTRAINT "FK_deb981a43f104507e47a74ec188" FOREIGN KEY ("modoDePagamentoId") REFERENCES "modo_de_pagamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "debito_automatico" ADD CONSTRAINT "FK_e241a052a9415ea06a73a580a32" FOREIGN KEY ("categoriaId") REFERENCES "categoria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
