import {MigrationInterface, QueryRunner} from "typeorm";

export class addUser1670094459905 implements MigrationInterface {
    name = 'addUser1670094459905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("idNumber" SERIAL NOT NULL, "id" character varying NOT NULL DEFAULT '', "email" character varying NOT NULL, "firstName" character varying NOT NULL DEFAULT '', "lastName" character varying NOT NULL DEFAULT '', "isActivated" boolean NOT NULL DEFAULT false, "activationLink" character varying NOT NULL DEFAULT '', "image" character varying NOT NULL DEFAULT '', "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "role" character varying NOT NULL DEFAULT 'USER', CONSTRAINT "PK_400332f5c67d8a42d92c83f113d" PRIMARY KEY ("idNumber"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
