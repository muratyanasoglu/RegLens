-- RegLens / MySQL Workbench: Veritabanını oluşturmak için bu dosyayı çalıştırın.
-- MySQL Workbench: File > Open SQL Script > bu dosyayı seçin > ⚡ Execute (veya Ctrl+Shift+Enter)

-- RegLens için ayrı veritabanı (Türkçe ve emoji için utf8mb4)
CREATE DATABASE IF NOT EXISTS reglens
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE reglens;

-- Tabloları proje kökünde şu komutla oluşturun:
-- npm run db:migrate
-- veya: npx prisma db push
