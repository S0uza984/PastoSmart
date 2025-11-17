-- AlterTable
ALTER TABLE `notificacao` ADD COLUMN `respostaDeId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Notificacao` ADD CONSTRAINT `Notificacao_respostaDeId_fkey` FOREIGN KEY (`respostaDeId`) REFERENCES `Notificacao`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
