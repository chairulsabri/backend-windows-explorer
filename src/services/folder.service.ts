import { pool } from '../config/database';
import { Folder, CreateFolderDto, UpdateFolderDto, PaginationQuery, PaginatedResponse } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class FolderService {
  async getAllFolders(query: PaginationQuery): Promise<PaginatedResponse<Folder>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    const search = query.search || '';
    const sortBy = query.sortBy || 'created_at';
    const sortOrder = query.sortOrder || 'DESC';

    let whereClause = '';
    const params: any[] = [];

    if (search) {
      whereClause = 'WHERE name LIKE ? OR path LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM folders ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM folders ${whereClause} ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return {
      success: true,
      data: rows as Folder[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getFolderById(id: number): Promise<Folder | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM folders WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Folder) : null;
  }

  async getFolderContents(folderId: number | null): Promise<{ folders: Folder[], files: any[] }> {
    const [folders] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM folders WHERE parent_id = ? ORDER BY name ASC',
      [folderId]
    );

    const [files] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM files WHERE folder_id = ? ORDER BY name ASC',
      [folderId]
    );

    return {
      folders: folders as Folder[],
      files: files as any[]
    };
  }

  async createFolder(data: CreateFolderDto): Promise<Folder> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO folders (name, path, parent_id) VALUES (?, ?, ?)',
      [data.name, data.path, data.parent_id || null]
    );

    const folder = await this.getFolderById(result.insertId);
    if (!folder) throw new Error('Failed to create folder');
    return folder;
  }

  async updateFolder(id: number, data: UpdateFolderDto): Promise<Folder | null> {
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
    if (data.parent_id !== undefined) {
      updates.push('parent_id = ?');
      values.push(data.parent_id);
    }

    if (updates.length === 0) {
      return this.getFolderById(id);
    }

    values.push(id);
    await pool.query(
      `UPDATE folders SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.getFolderById(id);
  }

  async deleteFolder(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM folders WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  async getFolderTree(): Promise<any[]> {
    const [folders] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM folders ORDER BY path ASC'
    );

    const buildTree = (parentId: number | null): any[] => {
      return (folders as Folder[])
        .filter(folder => folder.parent_id === parentId)
        .map(folder => ({
          ...folder,
          children: buildTree(folder.id)
        }));
    };

    return buildTree(null);
  }
}
