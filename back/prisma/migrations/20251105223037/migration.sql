-- DropForeignKey
ALTER TABLE `sala_auditoria` DROP FOREIGN KEY `Sala_Auditoria_sala_id_fkey`;

-- DropIndex
DROP INDEX `Sala_Auditoria_sala_id_fkey` ON `sala_auditoria`;

-- AlterTable
ALTER TABLE `sala_auditoria` MODIFY `sala_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Sala_Auditoria` ADD CONSTRAINT `Sala_Auditoria_sala_id_fkey` FOREIGN KEY (`sala_id`) REFERENCES `Sala`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
