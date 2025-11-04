/*
  Warnings:

  - Added the required column `hora_fim` to the `Agendamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hora_inicio` to the `Agendamento` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `agendamento` DROP FOREIGN KEY `Agendamento_sala_id_fkey`;

-- DropForeignKey
ALTER TABLE `agendamento` DROP FOREIGN KEY `Agendamento_visitante_id_fkey`;

-- DropForeignKey
ALTER TABLE `sala_auditoria` DROP FOREIGN KEY `Sala_Auditoria_sala_id_fkey`;

-- DropIndex
DROP INDEX `Agendamento_sala_id_fkey` ON `agendamento`;

-- DropIndex
DROP INDEX `Agendamento_visitante_id_fkey` ON `agendamento`;

-- DropIndex
DROP INDEX `Sala_Auditoria_sala_id_fkey` ON `sala_auditoria`;

-- AlterTable
ALTER TABLE `agendamento` ADD COLUMN `hora_fim` VARCHAR(5) NOT NULL,
    ADD COLUMN `hora_inicio` VARCHAR(5) NOT NULL;

-- AddForeignKey
ALTER TABLE `Sala_Auditoria` ADD CONSTRAINT `Sala_Auditoria_sala_id_fkey` FOREIGN KEY (`sala_id`) REFERENCES `Sala`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agendamento` ADD CONSTRAINT `Agendamento_visitante_id_fkey` FOREIGN KEY (`visitante_id`) REFERENCES `Visitante`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agendamento` ADD CONSTRAINT `Agendamento_sala_id_fkey` FOREIGN KEY (`sala_id`) REFERENCES `Sala`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
