-- CreateTable
CREATE TABLE `Tipo_Prioridade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(100) NOT NULL,
    `nivel_prioridade` SMALLINT NOT NULL,
    `ativo` BOOLEAN NULL,
    `criado_em` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Visitante` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `documento` VARCHAR(50) NOT NULL,
    `phone` INTEGER NOT NULL,
    `data_nascimento` DATETIME(3) NOT NULL,
    `tipo_prioridade_id` INTEGER NULL,
    `foto` VARCHAR(255) NULL,
    `ativo` BOOLEAN NULL,
    `criado_em` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Visitante_documento_key`(`documento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feriado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` DATETIME(3) NOT NULL,
    `descricao` VARCHAR(255) NOT NULL,
    `tipo` SMALLINT NULL,
    `ativo` BOOLEAN NULL,
    `criado_em` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sala` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `disponibilidade` JSON NOT NULL,
    `capacidade` INTEGER NOT NULL,
    `variacao_capacidade` SMALLINT NULL DEFAULT 2,
    `ativo` BOOLEAN NULL,
    `criado_em` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Sala_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sala_Responsavel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sala_id` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `documento` VARCHAR(50) NOT NULL,
    `valido_de` DATETIME(3) NOT NULL,
    `valido_ate` DATETIME(3) NULL,
    `ativo` BOOLEAN NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Sala_Responsavel_documento_key`(`documento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agendamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `visitante_id` INTEGER NOT NULL,
    `sala_id` INTEGER NOT NULL,
    `data_agendada` DATETIME(3) NOT NULL,
    `status` SMALLINT NOT NULL DEFAULT 1,
    `ativo` BOOLEAN NULL,
    `code` VARCHAR(255) NOT NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Acesso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `visitante_id` INTEGER NOT NULL,
    `sala_id` INTEGER NOT NULL,
    `entrada_em` DATETIME(3) NULL,
    `saida_em` DATETIME(3) NULL,
    `ativo` BOOLEAN NULL,
    `agendamento_id` INTEGER NOT NULL,

    UNIQUE INDEX `Acesso_agendamento_id_key`(`agendamento_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Visitante` ADD CONSTRAINT `Visitante_tipo_prioridade_id_fkey` FOREIGN KEY (`tipo_prioridade_id`) REFERENCES `Tipo_Prioridade`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sala_Responsavel` ADD CONSTRAINT `Sala_Responsavel_sala_id_fkey` FOREIGN KEY (`sala_id`) REFERENCES `Sala`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agendamento` ADD CONSTRAINT `Agendamento_visitante_id_fkey` FOREIGN KEY (`visitante_id`) REFERENCES `Visitante`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agendamento` ADD CONSTRAINT `Agendamento_sala_id_fkey` FOREIGN KEY (`sala_id`) REFERENCES `Sala`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Acesso` ADD CONSTRAINT `Acesso_visitante_id_fkey` FOREIGN KEY (`visitante_id`) REFERENCES `Visitante`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Acesso` ADD CONSTRAINT `Acesso_sala_id_fkey` FOREIGN KEY (`sala_id`) REFERENCES `Sala`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Acesso` ADD CONSTRAINT `Acesso_agendamento_id_fkey` FOREIGN KEY (`agendamento_id`) REFERENCES `Agendamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
