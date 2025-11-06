/*
  Warnings:

  - Added the required column `code` to the `Acesso` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `acesso` ADD COLUMN `code` INTEGER NOT NULL;
