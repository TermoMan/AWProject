SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

USE `test`;

CREATE TABLE `collections` (
  `id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `name` text NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `privat` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `collection_items` (
  `id` int(11) NOT NULL,
  `collection_id` int(11) NOT NULL,
  `name` text NOT NULL,
  `description` text DEFAULT NULL,
  `privat` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `collection_item_images` (
  `id` int(11) NOT NULL,
  `collection_item_id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE `collections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `owner_id` (`owner_id`);

ALTER TABLE `collection_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `collection_id` (`collection_id`);

ALTER TABLE `collection_item_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `collection_item_id` (`collection_item_id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);


ALTER TABLE `collections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `collection_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `collection_item_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `collections`
  ADD CONSTRAINT `fk_owner_id` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`);

ALTER TABLE `collection_items`
  ADD CONSTRAINT `fk_collection_id` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `collection_item_images`
  ADD CONSTRAINT `fk_collection_item_id` FOREIGN KEY (`collection_item_id`) REFERENCES `collection_items` (`id`);

INSERT INTO `users` (`id`, `username`, `password`, `email`, `status`)
  VALUES (1, 'test', '$2b$12$4jQb.ZDHtEixGYzoLa24MujEPHEWDAZHQCBDmPtAdXcNTF56M/jca', 'test@test.tt', 1);

INSERT INTO `collections` (`id`, `owner_id`, `name`, `description`, `image`)
  VALUES (1, 1, 'test', NULL, NULL);

INSERT INTO `collection_items` (`id`, `collection_id`, `name`, `description`)
  VALUES (1, 1, 'test', NULL);
COMMIT;