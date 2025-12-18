import { pool } from '../config/database';

async function migrate() {
  try {
    console.log('🚀 Starting database migration...');

    // Create folders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS folders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        path VARCHAR(1000) NOT NULL,
        parent_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE,
        INDEX idx_parent_id (parent_id),
        INDEX idx_path (path(255))
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Table "folders" created');

    // Create files table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS files (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        path VARCHAR(1000) NOT NULL,
        folder_id INT NULL,
        extension VARCHAR(50) NULL,
        size BIGINT DEFAULT 0,
        mime_type VARCHAR(100) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE,
        INDEX idx_folder_id (folder_id),
        INDEX idx_extension (extension),
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Table "files" created');

    // Create file_versions table for version control
    await pool.query(`
      CREATE TABLE IF NOT EXISTS file_versions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        file_id INT NOT NULL,
        version INT NOT NULL,
        size BIGINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
        INDEX idx_file_id (file_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Table "file_versions" created');

    // Create favorites table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        item_type ENUM('file', 'folder') NOT NULL,
        item_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_item (item_type, item_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Table "favorites" created');

    // Insert sample data
    await pool.query(`
      INSERT IGNORE INTO folders (id, name, path, parent_id) VALUES
      (1, 'Root', '/', NULL),
      (2, 'Documents', '/Documents', 1),
      (3, 'Pictures', '/Pictures', 1),
      (4, 'Videos', '/Videos', 1),
      (5, 'Work', '/Documents/Work', 2),
      (6, 'Personal', '/Documents/Personal', 2);
    `);
    console.log('✅ Sample folders inserted');

    await pool.query(`
      INSERT IGNORE INTO files (id, name, path, folder_id, extension, size, mime_type) VALUES
      (1, 'report.pdf', '/Documents/Work/report.pdf', 5, 'pdf', 2048576, 'application/pdf'),
      (2, 'presentation.pptx', '/Documents/Work/presentation.pptx', 5, 'pptx', 5242880, 'application/vnd.openxmlformats-officedocument.presentationml.presentation'),
      (3, 'notes.txt', '/Documents/Personal/notes.txt', 6, 'txt', 4096, 'text/plain'),
      (4, 'photo.jpg', '/Pictures/photo.jpg', 3, 'jpg', 1048576, 'image/jpeg'),
      (5, 'vacation.mp4', '/Videos/vacation.mp4', 4, 'mp4', 104857600, 'video/mp4');
    `);
    console.log('✅ Sample files inserted');

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
