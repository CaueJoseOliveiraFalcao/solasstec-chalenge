-- DropForeignKey
ALTER TABLE `agendamento` DROP FOREIGN KEY `Agendamento_sala_id_fkey`;

-- DropForeignKey
ALTER TABLE `agendamento` DROP FOREIGN KEY `Agendamento_visitante_id_fkey`;

-- DropIndex
DROP INDEX `Agendamento_sala_id_fkey` ON `agendamento`;

-- DropIndex
DROP INDEX `Agendamento_visitante_id_fkey` ON `agendamento`;

-- AddForeignKey
ALTER TABLE `Agendamento` ADD CONSTRAINT `Agendamento_visitante_id_fkey` FOREIGN KEY (`visitante_id`) REFERENCES `Visitante`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agendamento` ADD CONSTRAINT `Agendamento_sala_id_fkey` FOREIGN KEY (`sala_id`) REFERENCES `Sala`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
