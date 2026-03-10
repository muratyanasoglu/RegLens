-- CreateTable OrganizationMember (user can belong to multiple orgs with role per org)
CREATE TABLE `OrganizationMember` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MANAGER', 'AUDITOR', 'USER', 'VIEWER') NOT NULL,

    UNIQUE INDEX `OrganizationMember_userId_organizationId_key`(`userId`, `organizationId`),
    INDEX `OrganizationMember_userId_idx`(`userId`),
    INDEX `OrganizationMember_organizationId_idx`(`organizationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add lastSelectedOrganizationId to User
ALTER TABLE `User` ADD COLUMN `lastSelectedOrganizationId` VARCHAR(191) NULL;
CREATE INDEX `User_lastSelectedOrganizationId_idx` ON `User`(`lastSelectedOrganizationId`);

-- Migrate existing User.organizationId + role into OrganizationMember (use UUID() for id)
INSERT INTO `OrganizationMember` (`id`, `userId`, `organizationId`, `role`)
SELECT UUID(), `id`, `organizationId`, `role` FROM `User` WHERE `organizationId` IS NOT NULL;

-- Set lastSelectedOrganizationId from current org
UPDATE `User` SET `lastSelectedOrganizationId` = `organizationId` WHERE `organizationId` IS NOT NULL;

-- Drop FK and columns from User
ALTER TABLE `User` DROP FOREIGN KEY `User_organizationId_fkey`;
ALTER TABLE `User` DROP COLUMN `organizationId`;
ALTER TABLE `User` DROP COLUMN `role`;

-- Add FK for OrganizationMember
ALTER TABLE `OrganizationMember` ADD CONSTRAINT `OrganizationMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `OrganizationMember` ADD CONSTRAINT `OrganizationMember_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
