-- CreateEnum
CREATE TYPE "LabelLevel" AS ENUM ('NON_CERTIFIE', 'MEMBRE_FEG', 'CERTIFIE_FEG');

-- CreateEnum
CREATE TYPE "LabelStage" AS ENUM ('CANDIDATURE', 'AUTO_EVALUATION', 'AUDIT', 'CONTRAT_LICENCE', 'DELIVRE', 'SURVEILLANCE');

-- CreateEnum
CREATE TYPE "TenderModality" AS ENUM ('SOUS_TRAITANCE', 'COTRAITANCE');

-- CreateEnum
CREATE TYPE "GmeForm" AS ENUM ('SOLIDAIRE', 'CONJOINT', 'CONJOINT_MANDATAIRE_SOLIDAIRE');

-- CreateEnum
CREATE TYPE "TenderStatus" AS ENUM ('BROUILLON', 'PUBLIE', 'CLOTURE', 'ATTRIBUE', 'ANNULE');

-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('SOUMISE', 'RETENUE', 'REJETEE', 'RETIREE');

-- CreateEnum
CREATE TYPE "FlagStatus" AS ENUM ('OUVERT', 'EN_COURS', 'TRAITE', 'REJETE');

-- CreateTable
CREATE TABLE "Profile" (
    "userId" TEXT NOT NULL,
    "email" TEXT,
    "nom" TEXT,
    "prenom" TEXT,
    "entreprise" TEXT,
    "isDonneurOrdre" BOOLEAN NOT NULL DEFAULT false,
    "isPrestataire" BOOLEAN NOT NULL DEFAULT false,
    "membershipStatus" TEXT,
    "labelStatusCache" TEXT,
    "statusCheckedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "profileUserId" TEXT NOT NULL,
    "secteur" TEXT,
    "specialites" TEXT[],
    "labelLevel" "LabelLevel" NOT NULL DEFAULT 'NON_CERTIFIE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabelFile" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "stage" "LabelStage" NOT NULL DEFAULT 'CANDIDATURE',
    "scoreBlocA" DOUBLE PRECISION,
    "scoreBlocB" DOUBLE PRECISION,
    "scoreBlocC" DOUBLE PRECISION,
    "scoreBlocD" DOUBLE PRECISION,
    "pieces" JSONB,
    "decisions" JSONB,
    "audit" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabelFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tender" (
    "id" TEXT NOT NULL,
    "donneurOrdreId" TEXT NOT NULL,
    "modality" "TenderModality" NOT NULL,
    "gmeForm" "GmeForm",
    "titre" TEXT NOT NULL,
    "secteur" TEXT,
    "budget" INTEGER,
    "delai" TEXT,
    "minLabelLevel" "LabelLevel",
    "status" "TenderStatus" NOT NULL DEFAULT 'BROUILLON',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "tenderId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "montant" INTEGER,
    "delai" TEXT,
    "message" TEXT,
    "status" "BidStatus" NOT NULL DEFAULT 'SOUMISE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "tenderId" TEXT NOT NULL,
    "form" "GmeForm" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMember" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "isMandataire" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "tenderId" TEXT,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flag" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "motif" TEXT NOT NULL,
    "status" "FlagStatus" NOT NULL DEFAULT 'OUVERT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Flag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Provider_profileUserId_key" ON "Provider"("profileUserId");

-- CreateIndex
CREATE UNIQUE INDEX "LabelFile_providerId_key" ON "LabelFile"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Bid_tenderId_providerId_key" ON "Bid"("tenderId", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Group_tenderId_key" ON "Group"("tenderId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMember_groupId_providerId_key" ON "GroupMember"("groupId", "providerId");

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_profileUserId_fkey" FOREIGN KEY ("profileUserId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabelFile" ADD CONSTRAINT "LabelFile_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tender" ADD CONSTRAINT "Tender_donneurOrdreId_fkey" FOREIGN KEY ("donneurOrdreId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "Tender"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "Tender"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flag" ADD CONSTRAINT "Flag_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
