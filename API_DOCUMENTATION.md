# API Documentation - Windows Explorer API

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, no authentication is required. For production, implement JWT or OAuth2.

---

## 📁 FOLDERS API

### 1. Get All Folders
Retrieve all folders with pagination and search capabilities.

**Endpoint**: `GET /folders`

**Query Parameters**:
- `page` (optional, number): Page number (default: 1)
- `limit` (optional, number): Items per page (default: 10)
- `search` (optional, string): Search by name or path
- `sortBy` (optional, string): Column to sort by (default: 'created_at')
- `sortOrder` (optional, 'ASC' | 'DESC'): Sort direction (default: 'DESC')

**Example Request**:
```http
GET /api/folders?page=1&limit=10&search=Documents&sortBy=name&sortOrder=ASC
```

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "name": "Documents",
      "path": "/Documents",
      "parent_id": 1,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 6,
    "totalPages": 1
  }
}
```

---

### 2. Get Folder by ID
Retrieve a specific folder by its ID.

**Endpoint**: `GET /folders/:id`

**Path Parameters**:
- `id` (required, number): Folder ID

**Example Request**:
```http
GET /api/folders/2
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Documents",
    "path": "/Documents",
    "parent_id": 1,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response** (404):
```json
{
  "success": false,
  "error": "Folder not found"
}
```

---

### 3. Get Folder Contents
Get all folders and files inside a specific folder.

**Endpoint**: `GET /folders/:id/contents`

**Path Parameters**:
- `id` (required, number): Folder ID

**Example Request**:
```http
GET /api/folders/2/contents
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "folders": [
      {
        "id": 5,
        "name": "Work",
        "path": "/Documents/Work",
        "parent_id": 2,
        "created_at": "2024-01-15T10:30:00.000Z",
        "updated_at": "2024-01-15T10:30:00.000Z"
      },
      {
        "id": 6,
        "name": "Personal",
        "path": "/Documents/Personal",
        "parent_id": 2,
        "created_at": "2024-01-15T10:30:00.000Z",
        "updated_at": "2024-01-15T10:30:00.000Z"
      }
    ],
    "files": []
  }
}
```

---

### 4. Get Folder Tree
Retrieve the entire folder structure as a hierarchical tree.

**Endpoint**: `GET /folders/tree/all`

**Example Request**:
```http
GET /api/folders/tree/all
```

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Root",
      "path": "/",
      "parent_id": null,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z",
      "children": [
        {
          "id": 2,
          "name": "Documents",
          "path": "/Documents",
          "parent_id": 1,
          "created_at": "2024-01-15T10:30:00.000Z",
          "updated_at": "2024-01-15T10:30:00.000Z",
          "children": [
            {
              "id": 5,
              "name": "Work",
              "path": "/Documents/Work",
              "parent_id": 2,
              "created_at": "2024-01-15T10:30:00.000Z",
              "updated_at": "2024-01-15T10:30:00.000Z",
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

---

### 5. Create Folder
Create a new folder.

**Endpoint**: `POST /folders`

**Request Body**:
```json
{
  "name": "Projects",
  "path": "/Documents/Projects",
  "parent_id": 2
}
```

**Body Parameters**:
- `name` (required, string): Folder name
- `path` (required, string): Full folder path
- `parent_id` (optional, number|null): Parent folder ID

**Example Request**:
```http
POST /api/folders
Content-Type: application/json

{
  "name": "Projects",
  "path": "/Documents/Projects",
  "parent_id": 2
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 7,
    "name": "Projects",
    "path": "/Documents/Projects",
    "parent_id": 2,
    "created_at": "2024-01-15T11:00:00.000Z",
    "updated_at": "2024-01-15T11:00:00.000Z"
  },
  "message": "Folder created successfully"
}
```

---

### 6. Update Folder
Update an existing folder.

**Endpoint**: `PUT /folders/:id`

**Path Parameters**:
- `id` (required, number): Folder ID

**Request Body** (all fields optional):
```json
{
  "name": "Updated Projects",
  "path": "/Documents/UpdatedProjects",
  "parent_id": 2
}
```

**Example Request**:
```http
PUT /api/folders/7
Content-Type: application/json

{
  "name": "Updated Projects"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 7,
    "name": "Updated Projects",
    "path": "/Documents/Projects",
    "parent_id": 2,
    "created_at": "2024-01-15T11:00:00.000Z",
    "updated_at": "2024-01-15T11:05:00.000Z"
  },
  "message": "Folder updated successfully"
}
```

---

### 7. Delete Folder
Delete a folder and all its contents (CASCADE).

**Endpoint**: `DELETE /folders/:id`

**Path Parameters**:
- `id` (required, number): Folder ID

**Example Request**:
```http
DELETE /api/folders/7
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Folder deleted successfully"
}
```

---

## 📄 FILES API

### 1. Get All Files
Retrieve all files with pagination and search.

**Endpoint**: `GET /files`

**Query Parameters**:
- `page` (optional, number): Page number (default: 1)
- `limit` (optional, number): Items per page (default: 10)
- `search` (optional, string): Search by name, path, or extension
- `sortBy` (optional, string): Column to sort by (default: 'created_at')
- `sortOrder` (optional, 'ASC' | 'DESC'): Sort direction (default: 'DESC')

**Example Request**:
```http
GET /api/files?page=1&limit=10&search=report&sortBy=size&sortOrder=DESC
```

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "report.pdf",
      "path": "/Documents/Work/report.pdf",
      "folder_id": 5,
      "extension": "pdf",
      "size": 2048576,
      "mime_type": "application/pdf",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

---

### 2. Get File by ID
Retrieve a specific file by its ID.

**Endpoint**: `GET /files/:id`

**Path Parameters**:
- `id` (required, number): File ID

**Example Request**:
```http
GET /api/files/1
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "report.pdf",
    "path": "/Documents/Work/report.pdf",
    "folder_id": 5,
    "extension": "pdf",
    "size": 2048576,
    "mime_type": "application/pdf",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 3. Get Files by Folder
Get all files in a specific folder.

**Endpoint**: `GET /files/folder/:folderId`

**Path Parameters**:
- `folderId` (required, number): Folder ID

**Example Request**:
```http
GET /api/files/folder/5
```

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "report.pdf",
      "path": "/Documents/Work/report.pdf",
      "folder_id": 5,
      "extension": "pdf",
      "size": 2048576,
      "mime_type": "application/pdf",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "presentation.pptx",
      "path": "/Documents/Work/presentation.pptx",
      "folder_id": 5,
      "extension": "pptx",
      "size": 5242880,
      "mime_type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 4. Get Files by Extension
Get all files with a specific extension.

**Endpoint**: `GET /files/extension/:extension`

**Path Parameters**:
- `extension` (required, string): File extension (e.g., 'pdf', 'jpg', 'txt')

**Example Request**:
```http
GET /api/files/extension/pdf
```

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "report.pdf",
      "path": "/Documents/Work/report.pdf",
      "folder_id": 5,
      "extension": "pdf",
      "size": 2048576,
      "mime_type": "application/pdf",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 5. Get Storage Statistics
Get storage statistics including total size and breakdown by extension.

**Endpoint**: `GET /files/stats/storage`

**Example Request**:
```http
GET /api/files/stats/storage
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "total_size": 113246208,
    "total_files": 5,
    "by_extension": [
      {
        "extension": "mp4",
        "count": 1,
        "total_size": 104857600
      },
      {
        "extension": "pptx",
        "count": 1,
        "total_size": 5242880
      },
      {
        "extension": "pdf",
        "count": 1,
        "total_size": 2048576
      },
      {
        "extension": "jpg",
        "count": 1,
        "total_size": 1048576
      },
      {
        "extension": "txt",
        "count": 1,
        "total_size": 4096
      }
    ]
  }
}
```

---

### 6. Create File
Create a new file entry.

**Endpoint**: `POST /files`

**Request Body**:
```json
{
  "name": "document.pdf",
  "path": "/Documents/Work/document.pdf",
  "folder_id": 5,
  "extension": "pdf",
  "size": 1048576,
  "mime_type": "application/pdf"
}
```

**Body Parameters**:
- `name` (required, string): File name
- `path` (required, string): Full file path
- `folder_id` (optional, number|null): Parent folder ID
- `extension` (optional, string|null): File extension
- `size` (optional, number): File size in bytes (default: 0)
- `mime_type` (optional, string|null): MIME type

**Example Request**:
```http
POST /api/files
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

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 6,
    "name": "document.pdf",
    "path": "/Documents/Work/document.pdf",
    "folder_id": 5,
    "extension": "pdf",
    "size": 1048576,
    "mime_type": "application/pdf",
    "created_at": "2024-01-15T11:00:00.000Z",
    "updated_at": "2024-01-15T11:00:00.000Z"
  },
  "message": "File created successfully"
}
```

---

### 7. Update File
Update an existing file.

**Endpoint**: `PUT /files/:id`

**Path Parameters**:
- `id` (required, number): File ID

**Request Body** (all fields optional):
```json
{
  "name": "updated-document.pdf",
  "size": 2048576,
  "mime_type": "application/pdf"
}
```

**Example Request**:
```http
PUT /api/files/6
Content-Type: application/json

{
  "name": "updated-document.pdf",
  "size": 2048576
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 6,
    "name": "updated-document.pdf",
    "path": "/Documents/Work/document.pdf",
    "folder_id": 5,
    "extension": "pdf",
    "size": 2048576,
    "mime_type": "application/pdf",
    "created_at": "2024-01-15T11:00:00.000Z",
    "updated_at": "2024-01-15T11:05:00.000Z"
  },
  "message": "File updated successfully"
}
```

---

### 8. Move File
Move a file to a different folder.

**Endpoint**: `POST /files/:id/move`

**Path Parameters**:
- `id` (required, number): File ID

**Request Body**:
```json
{
  "folder_id": 6
}
```

**Body Parameters**:
- `folder_id` (required, number|null): Target folder ID (null for root)

**Example Request**:
```http
POST /api/files/6/move
Content-Type: application/json

{
  "folder_id": 6
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 6,
    "name": "document.pdf",
    "path": "/Documents/Personal/document.pdf",
    "folder_id": 6,
    "extension": "pdf",
    "size": 1048576,
    "mime_type": "application/pdf",
    "created_at": "2024-01-15T11:00:00.000Z",
    "updated_at": "2024-01-15T11:10:00.000Z"
  },
  "message": "File moved successfully"
}
```

---

### 9. Delete File
Delete a file.

**Endpoint**: `DELETE /files/:id`

**Path Parameters**:
- `id` (required, number): File ID

**Example Request**:
```http
DELETE /api/files/6
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

## ⭐ FAVORITES API

### 1. Get All Favorites
Get all favorite items (files and folders).

**Endpoint**: `GET /favorites`

**Example Request**:
```http
GET /api/favorites
```

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "item_type": "file",
      "item_id": 1,
      "name": "report.pdf",
      "path": "/Documents/Work/report.pdf",
      "created_at": "2024-01-15T11:00:00.000Z"
    },
    {
      "id": 2,
      "item_type": "folder",
      "item_id": 2,
      "name": "Documents",
      "path": "/Documents",
      "created_at": "2024-01-15T11:05:00.000Z"
    }
  ]
}
```

---

### 2. Add to Favorites
Add a file or folder to favorites.

**Endpoint**: `POST /favorites`

**Request Body**:
```json
{
  "item_type": "file",
  "item_id": 1
}
```

**Body Parameters**:
- `item_type` (required, 'file' | 'folder'): Type of item
- `item_id` (required, number): ID of the item

**Example Request**:
```http
POST /api/favorites
Content-Type: application/json

{
  "item_type": "file",
  "item_id": 1
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "item_type": "file",
    "item_id": 1,
    "created_at": "2024-01-15T11:00:00.000Z"
  },
  "message": "Added to favorites"
}
```

---

### 3. Remove from Favorites
Remove an item from favorites.

**Endpoint**: `DELETE /favorites/:id`

**Path Parameters**:
- `id` (required, number): Favorite ID

**Example Request**:
```http
DELETE /api/favorites/1
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Removed from favorites"
}
```

---

### 4. Check if Favorited
Check if an item is in favorites.

**Endpoint**: `GET /favorites/check/:itemType/:itemId`

**Path Parameters**:
- `itemType` (required, 'file' | 'folder'): Type of item
- `itemId` (required, number): ID of the item

**Example Request**:
```http
GET /api/favorites/check/file/1
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "is_favorite": true
  }
}
```

---

## 🔧 Utility Endpoints

### 1. API Info
Get API information and available endpoints.

**Endpoint**: `GET /`

**Example Request**:
```http
GET /
```

**Success Response** (200):
```json
{
  "message": "Windows Explorer API",
  "version": "1.0.0",
  "documentation": "/docs",
  "endpoints": {
    "folders": "/api/folders",
    "files": "/api/files",
    "favorites": "/api/favorites"
  }
}
```

---

### 2. Health Check
Check API and database health status.

**Endpoint**: `GET /health`

**Example Request**:
```http
GET /health
```

**Success Response** (200):
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

---

## 📊 Error Responses

All endpoints may return the following error format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

Common HTTP Status Codes:
- `200` - Success
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

---

## 💡 Tips for Frontend Integration

1. **Pagination**: Always handle pagination for large datasets
2. **Error Handling**: Always check the `success` field in responses
3. **Search**: Use debouncing for search queries to reduce API calls
4. **File Sizes**: Display file sizes in human-readable format (KB, MB, GB)
5. **Loading States**: Show loading indicators during API calls
6. **Caching**: Consider caching folder tree and frequently accessed data
7. **Optimistic Updates**: Update UI immediately, then sync with server

---

## 🔗 WebSocket Support (Future Enhancement)

Consider implementing WebSocket for real-time updates when files/folders change.

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- File sizes are in bytes
- Deleting a folder will CASCADE delete all contents
- Parent-child relationships are maintained with foreign keys
- The API supports CORS for frontend integration
