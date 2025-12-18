# Frontend Integration Examples

Contoh implementasi untuk mengintegrasikan API dengan berbagai frontend framework.

---

## React + TypeScript + TanStack Query

### 1. Setup Project
```bash
bun create vite frontend --template react-ts
cd frontend
bun install
bun add @tanstack/react-query axios
bun add -d @types/node
```

### 2. API Client Setup

**src/lib/api.ts**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
```

### 3. API Services

**src/services/folders.service.ts**
```typescript
import api from '../lib/api';
import { Folder, CreateFolderDto, UpdateFolderDto } from '../types';

export const foldersService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) => {
    return api.get<any, { success: boolean; data: Folder[]; pagination: any }>('/folders', { params });
  },

  getById: async (id: number) => {
    return api.get<any, { success: boolean; data: Folder }>(`/folders/${id}`);
  },

  getContents: async (id: number) => {
    return api.get<any, { success: boolean; data: { folders: Folder[]; files: any[] } }>(`/folders/${id}/contents`);
  },

  getTree: async () => {
    return api.get<any, { success: boolean; data: Folder[] }>('/folders/tree/all');
  },

  create: async (data: CreateFolderDto) => {
    return api.post<any, { success: boolean; data: Folder }>('/folders', data);
  },

  update: async (id: number, data: UpdateFolderDto) => {
    return api.put<any, { success: boolean; data: Folder }>(`/folders/${id}`, data);
  },

  delete: async (id: number) => {
    return api.delete<any, { success: boolean; message: string }>(`/folders/${id}`);
  },
};
```

**src/services/files.service.ts**
```typescript
import api from '../lib/api';
import { File, CreateFileDto, UpdateFileDto } from '../types';

export const filesService = {
  getAll: async (params?: any) => {
    return api.get<any, { success: boolean; data: File[]; pagination: any }>('/files', { params });
  },

  getById: async (id: number) => {
    return api.get<any, { success: boolean; data: File }>(`/files/${id}`);
  },

  getByFolder: async (folderId: number) => {
    return api.get<any, { success: boolean; data: File[] }>(`/files/folder/${folderId}`);
  },

  getByExtension: async (extension: string) => {
    return api.get<any, { success: boolean; data: File[] }>(`/files/extension/${extension}`);
  },

  getStats: async () => {
    return api.get<any, { success: boolean; data: any }>('/files/stats/storage');
  },

  create: async (data: CreateFileDto) => {
    return api.post<any, { success: boolean; data: File }>('/files', data);
  },

  update: async (id: number, data: UpdateFileDto) => {
    return api.put<any, { success: boolean; data: File }>(`/files/${id}`, data);
  },

  move: async (id: number, folderId: number | null) => {
    return api.post<any, { success: boolean; data: File }>(`/files/${id}/move`, { folder_id: folderId });
  },

  delete: async (id: number) => {
    return api.delete<any, { success: boolean; message: string }>(`/files/${id}`);
  },
};
```

### 4. React Query Hooks

**src/hooks/useFolders.ts**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { foldersService } from '../services/folders.service';
import { CreateFolderDto, UpdateFolderDto } from '../types';

export const useFolders = (params?: any) => {
  return useQuery({
    queryKey: ['folders', params],
    queryFn: () => foldersService.getAll(params),
  });
};

export const useFolder = (id: number) => {
  return useQuery({
    queryKey: ['folder', id],
    queryFn: () => foldersService.getById(id),
    enabled: !!id,
  });
};

export const useFolderContents = (id: number) => {
  return useQuery({
    queryKey: ['folder-contents', id],
    queryFn: () => foldersService.getContents(id),
    enabled: !!id,
  });
};

export const useFolderTree = () => {
  return useQuery({
    queryKey: ['folder-tree'],
    queryFn: () => foldersService.getTree(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateFolderDto) => foldersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['folder-tree'] });
    },
  });
};

export const useUpdateFolder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFolderDto }) => 
      foldersService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['folder', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['folder-tree'] });
    },
  });
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => foldersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['folder-tree'] });
    },
  });
};
```

**src/hooks/useFiles.ts**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { filesService } from '../services/files.service';
import { CreateFileDto, UpdateFileDto } from '../types';

export const useFiles = (params?: any) => {
  return useQuery({
    queryKey: ['files', params],
    queryFn: () => filesService.getAll(params),
  });
};

export const useFile = (id: number) => {
  return useQuery({
    queryKey: ['file', id],
    queryFn: () => filesService.getById(id),
    enabled: !!id,
  });
};

export const useFilesByFolder = (folderId: number) => {
  return useQuery({
    queryKey: ['files-folder', folderId],
    queryFn: () => filesService.getByFolder(folderId),
    enabled: !!folderId,
  });
};

export const useStorageStats = () => {
  return useQuery({
    queryKey: ['storage-stats'],
    queryFn: () => filesService.getStats(),
  });
};

export const useCreateFile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateFileDto) => filesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};

export const useMoveFile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, folderId }: { id: number; folderId: number | null }) => 
      filesService.move(id, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['folder-contents'] });
    },
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => filesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};
```

### 5. TypeScript Types

**src/types/index.ts**
```typescript
export interface Folder {
  id: number;
  name: string;
  path: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  children?: Folder[];
}

export interface File {
  id: number;
  name: string;
  path: string;
  folder_id: number | null;
  extension: string | null;
  size: number;
  mime_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateFolderDto {
  name: string;
  path: string;
  parent_id?: number | null;
}

export interface UpdateFolderDto {
  name?: string;
  path?: string;
  parent_id?: number | null;
}

export interface CreateFileDto {
  name: string;
  path: string;
  folder_id?: number | null;
  extension?: string | null;
  size?: number;
  mime_type?: string | null;
}

export interface UpdateFileDto {
  name?: string;
  path?: string;
  folder_id?: number | null;
  extension?: string | null;
  size?: number;
  mime_type?: string | null;
}
```

### 6. Example Components

**src/components/FolderTree.tsx**
```typescript
import React from 'react';
import { useFolderTree } from '../hooks/useFolders';

export const FolderTree: React.FC = () => {
  const { data, isLoading, error } = useFolderTree();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading folders</div>;

  const renderFolder = (folder: any) => (
    <div key={folder.id} style={{ marginLeft: 20 }}>
      <div>📁 {folder.name}</div>
      {folder.children?.map(renderFolder)}
    </div>
  );

  return (
    <div>
      <h2>Folder Structure</h2>
      {data?.data.map(renderFolder)}
    </div>
  );
};
```

**src/components/FileList.tsx**
```typescript
import React from 'react';
import { useFiles } from '../hooks/useFiles';

export const FileList: React.FC = () => {
  const { data, isLoading, error } = useFiles({ page: 1, limit: 10 });

  if (isLoading) return <div>Loading files...</div>;
  if (error) return <div>Error loading files</div>;

  return (
    <div>
      <h2>Files</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Type</th>
            <th>Modified</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((file) => (
            <tr key={file.id}>
              <td>{file.name}</td>
              <td>{formatBytes(file.size)}</td>
              <td>{file.extension}</td>
              <td>{new Date(file.updated_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
```

**src/App.tsx**
```typescript
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FolderTree } from './components/FolderTree';
import { FileList } from './components/FileList';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        <div style={{ width: '300px' }}>
          <FolderTree />
        </div>
        <div style={{ flex: 1 }}>
          <FileList />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
```

### 7. Environment Variables

**.env**
```env
VITE_API_URL=http://localhost:3000/api
```

---

## Next.js 14 App Router

### 1. Setup
```bash
bunx create-next-app@latest frontend --typescript --tailwind --app
cd frontend
bun add @tanstack/react-query axios
```

### 2. API Client

**lib/api.ts** - Same as React example above

### 3. Server Component Example

**app/folders/page.tsx**
```typescript
import { foldersService } from '@/services/folders.service';

export default async function FoldersPage() {
  const folders = await foldersService.getAll();

  return (
    <div>
      <h1>Folders</h1>
      <ul>
        {folders.data.map((folder) => (
          <li key={folder.id}>{folder.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 4. Client Component with React Query

**app/files/page.tsx**
```typescript
'use client';

import { useFiles } from '@/hooks/useFiles';

export default function FilesPage() {
  const { data, isLoading } = useFiles();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Files</h1>
      <ul>
        {data?.data.map((file) => (
          <li key={file.id}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Vue 3 + TypeScript

### 1. Setup
```bash
bun create vite frontend --template vue-ts
cd frontend
bun install
bun add @tanstack/vue-query axios
```

### 2. API Client

**src/lib/api.ts** - Same as React example

### 3. Composables

**src/composables/useFolders.ts**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { foldersService } from '../services/folders.service';

export function useFolders(params?: any) {
  return useQuery({
    queryKey: ['folders', params],
    queryFn: () => foldersService.getAll(params),
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: foldersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
}
```

### 4. Component Example

**src/components/FolderList.vue**
```vue
<script setup lang="ts">
import { useFolders } from '@/composables/useFolders';

const { data, isLoading, error } = useFolders();
</script>

<template>
  <div>
    <h2>Folders</h2>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error loading folders</div>
    <ul v-else>
      <li v-for="folder in data?.data" :key="folder.id">
        {{ folder.name }}
      </li>
    </ul>
  </div>
</template>
```

---

## Utility Functions

### Format File Size
```typescript
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
```

### Format Date
```typescript
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
```

### Get File Icon
```typescript
export function getFileIcon(extension: string | null): string {
  const icons: Record<string, string> = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    xls: '📊',
    xlsx: '📊',
    ppt: '📊',
    pptx: '📊',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    mp4: '🎥',
    mp3: '🎵',
    zip: '📦',
    txt: '📃',
  };
  
  return icons[extension?.toLowerCase() || ''] || '📄';
}
```

---

## Best Practices

1. **Error Handling**: Always handle API errors gracefully
2. **Loading States**: Show loading indicators during API calls
3. **Caching**: Use React Query's caching to reduce API calls
4. **Optimistic Updates**: Update UI immediately for better UX
5. **Type Safety**: Use TypeScript interfaces consistently
6. **Environment Variables**: Never hardcode API URLs
7. **Authentication**: Add auth tokens to all requests
8. **Pagination**: Implement proper pagination for large datasets
9. **Search Debouncing**: Debounce search inputs to reduce API calls
10. **Error Boundaries**: Implement error boundaries in React

---

## Testing API Integration

**Example with Vitest**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { foldersService } from './folders.service';

describe('Folders Service', () => {
  it('should fetch all folders', async () => {
    const result = await foldersService.getAll();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });

  it('should create a folder', async () => {
    const newFolder = {
      name: 'Test Folder',
      path: '/Test Folder',
      parent_id: 1,
    };
    
    const result = await foldersService.create(newFolder);
    expect(result.success).toBe(true);
    expect(result.data.name).toBe('Test Folder');
  });
});
```

---

Gunakan contoh-contoh di atas sebagai template untuk mengintegrasikan API dengan frontend Anda!
