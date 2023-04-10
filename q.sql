
CREATE DATABASE IF NOT EXISTS `app_db`;

USE `app_db`;

CREATE TABLE branches (
                         `id` INT NOT NULL AUTO_INCREMENT,
                         `parent_id` INT,
                         `name` VARCHAR(255),
                         PRIMARY KEY (id),
                         INDEX `name_indx` (`name`)
);