CREATE TABLE "toDo" (
	"id" SERIAL PRIMARY KEY,
	"taskName" VARCHAR(200) NOT NULL,
	"isComplete" BOOLEAN DEFAULT FALSE,
	"priority" VARCHAR(20)
);

INSERT INTO "toDo"
	("taskName", "isComplete", "priority")
VALUES
	('Make to-do list', 'true', 'NOW'),
	('Practice Whiteboard Challenges', 'false', 'Soon-ish'),
	('Prime Feedback Due Everyday!!!', 'false', 'NOW'),
	('Laundry', 'false', 'Later'),
	('Revamp Resume', 'false', 'Soon-ish');