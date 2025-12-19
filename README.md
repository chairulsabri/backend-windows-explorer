# Windows Explorer API

REST API untuk sistem manajemen file Windows Explorer yang dibangun dengan **Bun**, **Elysia**, **TypeScript**, dan **MySQL**.

## 🚀 Teknologi Stack

- **Runtime**: Bun
- **Framework**: Elysia
- **Language**: TypeScript
- **Database**: MySQL 8.0+
- **ORM**: MySQL2 (Native Driver)
- **API Documentation**: Swagger/OpenAPI

## 📋 Prerequisites

Sebelum memulai, pastikan Anda telah menginstall:

- [Bun](https://bun.sh/) v1.0.0 atau lebih tinggi
- MySQL 8.0 atau lebih tinggi
- Node.js v18+ (opsional, untuk kompatibilitas tools)

## 📦 Instalasi

### 1. Clone atau Copy Project

```bash
cd windows-explorer-api
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Setup Database

#### Buat Database MySQL

```sql
CREATE DATABASE windows_explorer CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Konfigurasi Environment

Copy file `.env.example` ke `.env` dan sesuaikan konfigurasi:

```bash
cp .env.example .env
```

Edit file `.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=windows_explorer

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Jalankan Migration

```bash
bun run db:migrate
```

Migration akan membuat:
- Tabel `folders` - Menyimpan struktur folder
- Tabel `files` - Menyimpan informasi file
- Tabel `file_versions` - Version control untuk file
- Tabel `favorites` - Menyimpan item favorit
- Sample data untuk testing

## 🎯 Menjalankan Aplikasi

### Development Mode (Hot Reload)

```bash
bun run dev
```

### Production Mode

```bash
bun start
```

Server akan berjalan di: `http://localhost:3000`

## 📚 API Documentation

Setelah server berjalan, akses dokumentasi interaktif Swagger di:

```
http://localhost:3000/docs
```

## 🔗 Endpoints

### Base URL

```
http://localhost:3000/api
```

### Folders API

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/folders` | Get all folders (dengan pagination) |
| GET | `/folders/:id` | Get folder by ID |
| GET | `/folders/:id/contents` | Get folder contents (folders & files) |
| GET | `/folders/tree/all` | Get folder tree structure |
| POST | `/folders` | Create new folder |
| PUT | `/folders/:id` | Update folder |
| DELETE | `/folders/:id` | Delete folder |

### Files API

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/files` | Get all files (dengan pagination) |
| GET | `/files/:id` | Get file by ID |
| GET | `/files/folder/:folderId` | Get files by folder |
| GET | `/files/extension/:extension` | Get files by extension |
| GET | `/files/stats/storage` | Get storage statistics |
| POST | `/files` | Create new file |
| PUT | `/files/:id` | Update file |
| POST | `/files/:id/move` | Move file to another folder |
| DELETE | `/files/:id` | Delete file |

### Favorites API

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/favorites` | Get all favorites |
| POST | `/favorites` | Add to favorites |
| DELETE | `/favorites/:id` | Remove from favorites |
| GET | `/favorites/check/:itemType/:itemId` | Check if item is favorited |

### Utility Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/` | API information |
| GET | `/health` | Health check |

## 📊 Database Schema

### Folders Table

```sql
CREATE TABLE folders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  path VARCHAR(1000) NOT NULL,
  parent_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE
);
```

### Files Table

```sql
CREATE TABLE files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  path VARCHAR(1000) NOT NULL,
  folder_id INT NULL,
  extension VARCHAR(50) NULL,
  size BIGINT DEFAULT 0,
  mime_type VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
);
```

### File Versions Table

```sql
CREATE TABLE file_versions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  file_id INT NOT NULL,
  version INT NOT NULL,
  size BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);
```

### Favorites Table

```sql
CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_type ENUM('file', 'folder') NOT NULL,
  item_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Testing dengan Postman

Import koleksi Postman yang disediakan: `postman_collection.json`

Atau buat request manual menggunakan contoh di bawah.

## 📝 Contoh Request

### 1. Get All Folders

```http
GET http://localhost:3000/api/folders?page=1&limit=10&search=Documents
```

### 2. Create Folder

```http
POST http://localhost:3000/api/folders
Content-Type: application/json

{
  "name": "Projects",
  "path": "/Documents/Projects",
  "parent_id": 2
}
```

### 3. Get Folder Contents

```http
GET http://localhost:3000/api/folders/2/contents
```

### 4. Create File

```http
POST http://localhost:3000/api/files
Content-Type: application/json

{
  "name": "document.pdf",
  "path": "/Documents/Work/document.pdf",
  "folder_id": 5,
  "extension": "pdf",
  "size": 1048576,
  "mime_type": "application/pdf"
}
```

### 5. Move File

```http
POST http://localhost:3000/api/files/1/move
Content-Type: application/json

{
  "folder_id": 6
}
```

### 6. Add to Favorites

```http
POST http://localhost:3000/api/favorites
Content-Type: application/json

{
  "item_type": "file",
  "item_id": 1
}
```

### 7. Get Storage Stats

```http
GET http://localhost:3000/api/files/stats/storage
```

## 🏗️ Struktur Project

```
windows-explorer-api/
├── src/
│   ├── config/
│   │   └── database.ts          # Database configuration
│   ├── database/
│   │   └── migrate.ts            # Database migration script
│   ├── routes/
│   │   ├── folder.routes.ts     # Folder endpoints
│   │   ├── file.routes.ts       # File endpoints
│   │   └── favorite.routes.ts   # Favorite endpoints
│   ├── services/
│   │   ├── folder.service.ts    # Folder business logic
│   │   ├── file.service.ts      # File business logic
│   │   └── favorite.service.ts  # Favorite business logic
│   ├── types/
│   │   └── index.ts             # TypeScript types & interfaces
│   └── index.ts                 # Application entry point
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Documentation
```

## 🔧 Features

- ✅ CRUD operations untuk Folders
- ✅ CRUD operations untuk Files
- ✅ Pagination dan Search
- ✅ Folder tree structure
- ✅ Move files between folders
- ✅ Favorites system
- ✅ Storage statistics
- ✅ Filter by extension
- ✅ Swagger/OpenAPI documentation
- ✅ CORS enabled
- ✅ TypeScript support
- ✅ Hot reload development

## 🚦 Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

## 🔐 Security Notes

- Gunakan environment variables untuk kredensial database
- Jangan commit file `.env` ke version control
- Implementasikan authentication untuk production
- Gunakan HTTPS di production
- Validasi semua input dari user

## 📈 Performance Tips

- Gunakan indexing pada kolom yang sering di-query
- Implementasikan caching untuk query yang sering diakses
- Gunakan connection pooling (sudah termasuk)
- Optimize query dengan LIMIT untuk large datasets

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Pastikan MySQL berjalan
sudo systemctl status mysql

# Test koneksi
mysql -u root -p
```

### Port Already in Use

```bash
# Cari process yang menggunakan port
lsof -i :3000

# Atau ubah PORT di .env
PORT=3001
```

## 📄 License

MIT Chairul Sabri

## 👥 Author

Chairul Sabri

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you!
