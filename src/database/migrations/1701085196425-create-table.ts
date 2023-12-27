import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateTable1701085196425 implements MigrationInterface {
  name = 'CreateTable1701085196425';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "grade" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
      "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
      "student_id" uuid NOT NULL, "assignment_id" uuid NOT NULL, 
      "score" integer NOT NULL, "feedback" text NOT NULL, 
      "submission_date" TIMESTAMP NOT NULL, CONSTRAINT "REL_9bffea35c23fe4b3467e6f7260" UNIQUE ("student_id"),
       CONSTRAINT "REL_dbd4050d5a481585a9fd995038" UNIQUE ("assignment_id"), 
      CONSTRAINT "PK_58c2176c3ae96bf57daebdbcb5e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"." assignment_submission_format_enum" AS ENUM('DOCUMENT', 'ONLINE_FORM')`,
    );
    await queryRunner.query(
      `CREATE TABLE " assignment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
      "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
      "course_id" uuid NOT NULL, "title" character varying NOT NULL, "content" text NOT NULL, "due_date" TIMESTAMP NOT NULL, 
      "max_score" integer NOT NULL, "submission_format" "public"." assignment_submission_format_enum" NOT NULL DEFAULT 'DOCUMENT', 
      CONSTRAINT "REL_a527cbb5b58f8de8a8817d7d2b" UNIQUE ("course_id"), CONSTRAINT "PK_6651b0229b9d809b394b20c7c23" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."course_status_enum" AS ENUM('ACTIVE', 'COMPLETED', 'UPCOMING')`,
    );
    await queryRunner.query(
      `CREATE TABLE "course" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
      "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
      "teacher_id" uuid NOT NULL, "title" character varying NOT NULL, "description" text, "start_date" TIMESTAMP NOT NULL, 
      "credits" integer NOT NULL, "enrollment_limit" integer NOT NULL, 
      "status" "public"."course_status_enum" NOT NULL DEFAULT 'UPCOMING', CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('STUDENT', 'TEACHER', 'ADMIN')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
      "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
      "first_name" character varying, "last_name" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'STUDENT', 
      "email" character varying NOT NULL, "password" character varying NOT NULL, 
      "avatar_url" character varying, "last_login" TIMESTAMP NOT NULL, 
      "bio" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), 
      CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "grade" ADD CONSTRAINT "FK_9bffea35c23fe4b3467e6f72604" FOREIGN KEY ("student_id") REFERENCES
       "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "grade" ADD CONSTRAINT "FK_dbd4050d5a481585a9fd995038e" FOREIGN KEY ("assignment_id")
       REFERENCES " assignment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE " assignment" ADD CONSTRAINT "FK_a527cbb5b58f8de8a8817d7d2bd" FOREIGN KEY ("course_id") 
      REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "course" ADD CONSTRAINT "FK_f4acb7f54962af04a558b1a5ed9" FOREIGN KEY ("teacher_id") 
      REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "course" DROP CONSTRAINT "FK_f4acb7f54962af04a558b1a5ed9"`,
    );
    await queryRunner.query(
      `ALTER TABLE " assignment" DROP CONSTRAINT "FK_a527cbb5b58f8de8a8817d7d2bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "grade" DROP CONSTRAINT "FK_dbd4050d5a481585a9fd995038e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "grade" DROP CONSTRAINT "FK_9bffea35c23fe4b3467e6f72604"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "course"`);
    await queryRunner.query(`DROP TYPE "public"."course_status_enum"`);
    await queryRunner.query(`DROP TABLE " assignment"`);
    await queryRunner.query(
      `DROP TYPE "public"." assignment_submission_format_enum"`,
    );
    await queryRunner.query(`DROP TABLE "grade"`);
  }
}
