-- database name = to_do_list

CREATE TABLE "to-do" (
	"id" SERIAL PRIMARY KEY,
	"taskName" VARCHAR(200) NOT NULL,
	"completed" BOOLEAN DEFAULT FALSE
);

INSERT INTO "to-do"
	("taskName", "completed")
VALUES
	('Make to-do list', 'false');