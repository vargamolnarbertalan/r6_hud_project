-- Run after deploying the code changes that remove avatar from queries.
-- Avatars are resolved at runtime from public/img/avatars/{nickname}.png|.jpg

ALTER TABLE `players` DROP COLUMN `avatar`;
ALTER TABLE `live_players` DROP COLUMN `avatar`;
