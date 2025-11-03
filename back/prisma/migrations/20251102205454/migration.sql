/*
  Warnings:

  - You are about to drop the column `sala_id` on the `sala_responsavel` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `sala_responsavel` DROP FOREIGN KEY `Sala_Responsavel_sala_id_fkey`;

-- DropIndex
DROP INDEX `Sala_Responsavel_sala_id_fkey` ON `sala_responsavel`;

-- AlterTable
ALTER TABLE `sala` ADD COLUMN `responsavel_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `sala_responsavel` DROP COLUMN `sala_id`;

-- AddForeignKey
ALTER TABLE `Sala` ADD CONSTRAINT `Sala_responsavel_id_fkey` FOREIGN KEY (`responsavel_id`) REFERENCES `Sala_Responsavel`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
