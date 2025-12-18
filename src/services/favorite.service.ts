import { pool } from '../config/database';
import { Favorite } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class FavoriteService {
  async getAllFavorites(): Promise<any[]> {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT 
        f.id,
        f.item_type,
        f.item_id,
        f.created_at,
        CASE 
          WHEN f.item_type = 'folder' THEN fo.name
          WHEN f.item_type = 'file' THEN fi.name
        END as name,
        CASE 
          WHEN f.item_type = 'folder' THEN fo.path
          WHEN f.item_type = 'file' THEN fi.path
        END as path
      FROM favorites f
      LEFT JOIN folders fo ON f.item_type = 'folder' AND f.item_id = fo.id
      LEFT JOIN files fi ON f.item_type = 'file' AND f.item_id = fi.id
      ORDER BY f.created_at DESC
    `);
    return rows;
  }

  async addFavorite(itemType: 'file' | 'folder', itemId: number): Promise<Favorite> {
    // Check if already exists
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM favorites WHERE item_type = ? AND item_id = ?',
      [itemType, itemId]
    );

    if (existing.length > 0) {
      return existing[0] as Favorite;
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO favorites (item_type, item_id) VALUES (?, ?)',
      [itemType, itemId]
    );

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM favorites WHERE id = ?',
      [result.insertId]
    );

    return rows[0] as Favorite;
  }

  async removeFavorite(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM favorites WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  async isFavorite(itemType: 'file' | 'folder', itemId: number): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM favorites WHERE item_type = ? AND item_id = ?',
      [itemType, itemId]
    );
    return rows[0].count > 0;
  }
}
