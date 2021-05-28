CREATE TABLE "to-do" (
	"id" SERIAL PRIMARY KEY,
	"taskName" VARCHAR(200) NOT NULL,
	"isComplete" BOOLEAN DEFAULT FALSE
);

INSERT INTO "to-do"
	("taskName", "isComplete")
VALUES
	('Make to-do list', 'false');