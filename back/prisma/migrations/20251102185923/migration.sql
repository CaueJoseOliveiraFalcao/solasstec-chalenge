-- CreateTable
CREATE TABLE `Sala_Autitoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sala_id` INTEGER NOT NULL,
    `responsavel_id` INTEGER NULL,
    `data_alterecao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `alteracao` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sala_Autitoria` ADD CONSTRAINT `Sala_Autitoria_sala_id_fkey` FOREIGN KEY (`sala_id`) REFERENCES `Sala`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
