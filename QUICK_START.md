# 🚀 Quick Start Guide

Panduan cepat untuk menjalankan Windows Explorer API.

## Prerequisites Checklist

- [ ] Bun installed (v1.0.0+)
- [ ] MySQL 8.0+ installed dan running
- [ ] Git installed
- [ ] Text editor (VS Code recommended)

## Installation (5 menit)

### 1. Navigate to Project
```bash
cd windows-explorer-api
```

### 2. Install Dependencies
```bash
bun install
```

### 3. Setup Database

#### A. Create Database
```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE windows_explorer CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

#### B. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env dengan credentials MySQL Anda
# DB_PASSWORD=your_mysql_password
```

#### C. Run Migration
```bash
bun run db:migrate
```

Output yang diharapkan:
```
🚀 Starting database migration...
✅ Table "folders" created
✅ Table "files" created
✅ Table "file_versions" created
✅ Table "favorites" created
✅ Sample folders inserted
✅ Sample files inserted
✅ Migration completed successfully!
```

### 4. Start Server
```bash
bun run dev
```

Output yang diharapkan:
```
╔════════════════════════════════════════════════╗
║   🚀 Windows Explorer API is running!         ║
╠════════════════════════════════════════════════╣
║   📡 Server: http://localhost:3000            ║
║   📚 API Docs: http://localhost:3000/docs     ║
║   ❤️  Health: http://localhost:3000/health    ║
╚════════════════════════════════════════════════╝

✅ Database connected successfully
```

## Testing (2 menit)

### 1. Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

### 2. Get All Folders
```bash
curl http://localhost:3000/api/folders
```

### 3. Open Swagger Documentation
Buka browser: http://localhost:3000/docs

### 4. Import Postman Collection
1. Buka Postman
2. Import → Upload Files
3. Pilih `postman_collection.json`
4. Test endpoints

## Common Issues & Solutions

### Issue: "Database connection failed"
**Solution:**
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL
sudo systemctl start mysql

# Verify credentials in .env
cat .env
```

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Option 1: Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Option 2: Change port in .env
echo "PORT=3001" >> .env
```

### Issue: "bun: command not found"
**Solution:**
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Reload shell
source ~/.bashrc  # or ~/.zshrc
```

### Issue: "Migration failed"
**Solution:**
```bash
# Drop and recreate database
mysql -u root -p -e "DROP DATABASE IF EXISTS windows_explorer; CREATE DATABASE windows_explorer CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run migration again
bun run db:migrate
```

## Next Steps

1. ✅ API is running
2. ✅ Database is configured
3. ✅ Sample data is loaded

**What to do next:**
- [ ] Explore Swagger docs: http://localhost:3000/docs
- [ ] Test API with Postman collection
- [ ] Read API_DOCUMENTATION.md for detailed endpoint info
- [ ] Check PROJECT_PHASES.md for next development steps
- [ ] Start frontend development (Fase 4)

## Development Commands

```bash
# Start development server (hot reload)
bun run dev

# Start production server
bun start

# Run database migration
bun run db:migrate

# Install new dependency
bun add package-name

# Install dev dependency
bun add -d package-name
```

## API Endpoints Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/health` | Health check |
| GET | `/docs` | Swagger documentation |
| GET | `/api/folders` | Get all folders |
| GET | `/api/folders/:id` | Get folder by ID |
| GET | `/api/folders/:id/contents` | Get folder contents |
| POST | `/api/folders` | Create folder |
| GET | `/api/files` | Get all files |
| POST | `/api/files` | Create file |
| POST | `/api/files/:id/move` | Move file |
| GET | `/api/favorites` | Get favorites |

## Database Quick Reference

```bash
# Connect to database
mysql -u root -p windows_explorer

# View all tables
SHOW TABLES;

# View folders
SELECT * FROM folders;

# View files
SELECT * FROM files;

# View favorites
SELECT * FROM favorites;

# Count records
SELECT COUNT(*) FROM files;
```

## Helpful Resources

- 📚 Full API Documentation: `API_DOCUMENTATION.md`
- 🗺️ Project Phases: `PROJECT_PHASES.md`
- 📝 Main README: `README.md`
- 📬 Postman Collection: `postman_collection.json`

## Support

Jika mengalami masalah:
1. Check error logs di terminal
2. Verify database connection
3. Check environment variables
4. Review documentation

---

**Selamat! API Anda sudah siap digunakan! 🎉**

Lanjutkan ke `PROJECT_PHASES.md` untuk tahapan development selanjutnya.
