/*
  Warnings:

  - Added the required column `image` to the `Meetup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meetup" ADD COLUMN     "image" TEXT NOT NULL;
