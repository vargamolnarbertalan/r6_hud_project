-- Run after deploying the code changes that remove logo from queries.
-- Logos are resolved at runtime from public/img/logos/{shorthandle}.png|.jpg

ALTER TABLE `teams` DROP COLUMN `logo`;
ALTER TABLE `live_teams` DROP COLUMN `logo`;
