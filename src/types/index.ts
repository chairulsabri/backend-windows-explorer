export interface Folder {
  id: number;
  name: string;
  path: string;
  parent_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface File {
  id: number;
  name: string;
  path: string;
  folder_id: number | null;
  extension: string | null;
  size: number;
  mime_type: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface FileVersion {
  id: number;
  file_id: number;
  version: number;
  size: number;
  created_at: Date;
}

export interface Favorite {
  id: number;
  item_type: 'file' | 'folder';
  item_id: number;
  created_at: Date;
}

export interface CreateFolderDto {
  name: string;
  parent_id?: number | null;
  path: string;
}

export interface CreateFileDto {
  name: string;
  folder_id?: number | null;
  path: string;
  extension?: string | null;
  size?: number;
  mime_type?: string | null;
}

export interface UpdateFolderDto {
  name?: string;
  parent_id?: number | null;
  path?: string;
}

export interface UpdateFileDto {
  name?: string;
  folder_id?: number | null;
  path?: string;
  extension?: string | null;
  size?: number;
  mime_type?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
