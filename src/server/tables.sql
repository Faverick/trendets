PRAGMA user_version = 1;

BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS "Events" (
	`Id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`DateTime`	TEXT NOT NULL,
	`Country`	TEXT NOT NULL,
	`Currency`	TEXT NOT NULL,
	`Importance`	TEXT NOT NULL,
	`Description`	TEXT NOT NULL,
	`Actual`	TEXT,
	`Forecast`	TEXT,
	`Previous`	TEXT
);

COMMIT;
