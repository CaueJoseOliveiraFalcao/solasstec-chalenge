/*
  Warnings:

  - You are about to drop the `sala_autitoria` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `sala_autitoria` DROP FOREIGN KEY `Sala_Autitoria_sala_id_fkey`;

-- DropTable
DROP TABLE `sala_autitoria`;

-- CreateTable
CREATE TABLE `Sala_Auditoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sala_id` INTEGER NOT NULL,
    `responsavel_id` INTEGER NULL,
    `data_alterecao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `alteracao` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sala_Auditoria` ADD CONSTRAINT `Sala_Auditoria_sala_id_fkey` FOREIGN KEY (`sala_id`) REFERENCES `Sala`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
