/*
  Warnings:

  - A unique constraint covering the columns `[tipo_prioridade_id]` on the table `Visitante` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Visitante_tipo_prioridade_id_key` ON `Visitante`(`tipo_prioridade_id`);
