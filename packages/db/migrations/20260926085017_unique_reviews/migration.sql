/*
  Warnings:

  - A unique constraint covering the columns `[userId,variantId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_variantId_key" ON "Review"("userId", "variantId");
