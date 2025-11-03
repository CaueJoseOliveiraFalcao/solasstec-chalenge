/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `Sala` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Sala_nome_key` ON `Sala`(`nome`);
