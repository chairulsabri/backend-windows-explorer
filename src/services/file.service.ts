import { pool } from '../config/database';
import { File, CreateFileDto, UpdateFileDto, PaginationQuery, PaginatedResponse } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class FileService {
  async getAllFiles(query: PaginationQuery): Promise<PaginatedResponse<File>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    const search = query.search || '';
    const sortBy = query.sortBy || 'created_at';
    const sortOrder = query.sortOrder || 'DESC';

    let whereClause = '';
    const params: any[] = [];

    if (search) {
      whereClause = 'WHERE name LIKE ? OR path LIKE ? OR extension LIKE ?';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [countResult] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM files ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM files ${whereClause} ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return {
      success: true,
      data: rows as File[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getFileById(id: number): Promise<File | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM files WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as File) : null;
  }

  async getFilesByFolder(folderId: number | null): Promise<File[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM files WHERE folder_id = ? ORDER BY name ASC',
      [folderId]
    );
    return rows as File[];
  }

  async getFilesByExtension(extension: string): Promise<File[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM files WHERE extension = ? ORDER BY name ASC',
      [extension]
    );
    return rows as File[];
  }

  async createFile(data: CreateFileDto): Promise<File> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO files (name, path, folder_id, extension, size, mime_type) VALUES (?, ?, ?, ?, ?, ?)',
      [
        data.name,
        data.path,
        data.folder_id || null,
        data.extension || null,
        data.size || 0,
        data.mime_type || null
      ]
    );

    const file = await this.getFileById(result.insertId);
    if (!file) throw new Error('Failed to create file');
    return file;
  }

  async updateFile(id: number, data: UpdateFileDto): Promise<File | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.path !== undefined) {
      updates.push('path = ?');
      values.push(data.path);
    }
    if (data.folder_id !== undefined) {
      updates.push('folder_id = ?');
      values.push(data.folder_id);
    }
    if (data.extension !== undefined) {
      updates.push('extension = ?');
      values.push(data.extension);
    }
    if (data.size !== undefined) {
      updates.push('size = ?');
      values.push(data.size);
    }
    if (data.mime_type !== undefined) {
      updates.push('mime_type = ?');
      values.push(data.mime_type);
    }

    if (updates.length === 0) {
      return this.getFileById(id);
    }

    values.push(id);
    await pool.query(
      `UPDATE files SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.getFileById(id);
  }

  async deleteFile(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM files WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  async moveFile(id: number, newFolderId: number | null): Promise<File | null> {
    const file = await this.getFileById(id);
    if (!file) return null;

    let newPath = file.name;
    if (newFolderId !== null) {
      const [folderRows] = await pool.query<RowDataPacket[]>(
        'SELECT path FROM folders WHERE id = ?',
        [newFolderId]
      );
      if (folderRows.length > 0) {
        newPath = `${folderRows[0].path}/${file.name}`;
      }
    }

    await pool.query(
      'UPDATE files SET folder_id = ?, path = ? WHERE id = ?',
      [newFolderId, newPath, id]
    );

    return this.getFileById(id);
  }

  async getStorageStats(): Promise<any> {
    const [totalSize] = await pool.query<RowDataPacket[]>(
      'SELECT SUM(size) as total_size, COUNT(*) as total_files FROM files'
    );

    const [byExtension] = await pool.query<RowDataPacket[]>(
      `SELECT 
        extension,
        COUNT(*) as count,
        SUM(size) as total_size
      FROM files
      WHERE extension IS NOT NULL
      GROUP BY extension
      ORDER BY total_size DESC
      LIMIT 10`
    );

    return {
      total_size: totalSize[0].total_size || 0,
      total_files: totalSize[0].total_files || 0,
      by_extension: byExtension
    };
  }
}
