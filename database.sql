CREATE TABLE "toDo" (
	"id" SERIAL PRIMARY KEY,
	"taskName" VARCHAR(200) NOT NULL,
	"isComplete" BOOLEAN DEFAULT FALSE
);

INSERT INTO "toDo"
	("taskName", "isComplete")
VALUES
	('Make to-do list', 'false');