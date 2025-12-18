import { Elysia, t } from 'elysia';
import { FileService } from '../services/file.service';

const fileService = new FileService();

export const fileRoutes = new Elysia({ prefix: '/files' })
  .get('/', async ({ query }) => {
    try {
      const result = await fileService.getAllFiles(query);
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }, {
    query: t.Object({
      page: t.Optional(t.Numeric()),
      limit: t.Optional(t.Numeric()),
      search: t.Optional(t.String()),
      sortBy: t.Optional(t.String()),
      sortOrder: t.Optional(t.Union([t.Literal('ASC'), t.Literal('DESC')]))
    }),
    detail: {
      summary: 'Get all files',
      description: 'Retrieve all files with pagination and search',
      tags: ['Files']
    }
  })

  .get('/:id', async ({ params: { id } }) => {
    try {
      const file = await fileService.getFileById(id);
      if (!file) {
        return {
          success: false,
          error: 'File not found'
        };
      }
      return {
        success: true,
        data: file
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }, {
    params: t.Object({
      id: t.Numeric()
    }),
    detail: {
      summary: 'Get file by ID',
      description: 'Retrieve a specific file by its ID',
      tags: ['Files']
    }
  })

  .get('/folder/:folderId', async ({ params: { folderId } }) => {
    try {
      const files = await fileService.getFilesByFolder(folderId);
      return {
        success: true,
        data: files
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }, {
    params: t.Object({
      folderId: t.Numeric()
    }),
    detail: {
      summary: 'Get files by folder',
      description: 'Retrieve all files in a specific folder',
      tags: ['Files']
    }
  })

  .get('/extension/:extension', async ({ params: { extension } }) => {
    try {
      const files = await fileService.getFilesByExtension(extension);
      return {
        success: true,
        data: files
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }, {
    params: t.Object({
      extension: t.String()
    }),
    detail: {
      summary: 'Get files by extension',
      description: 'Retrieve all files with a specific extension',
      tags: ['Files']
    }
  })

  .get('/stats/storage', async () => {
    try {
      const stats = await fileService.getStorageStats();
      return {
        success: true,
        data: stats
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }, {
    detail: {
      summary: 'Get storage statistics',
      description: 'Retrieve storage statistics including total size and breakdown by extension',
      tags: ['Files']
    }
  })

  .post('/', async ({ body }) => {
    try {
      const file = await fileService.createFile(body);
      return {
        success: true,
        data: file,
        message: 'File created successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }, {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      path: t.String({ minLength: 1 }),
      folder_id: t.Optional(t.Nullable(t.Number())),
      extension: t.Optional(t.Nullable(t.String())),
      size: t.Optional(t.Number()),
      mime_type: t.Optional(t.Nullable(t.String()))
    }),
    detail: {
      summary: 'Create new file',
      description: 'Create a new file entry',
      tags: ['Files']
    }
  })

  .put('/:id', async ({ params: { id }, body }) => {
    try {
      const file = await fileService.updateFile(id, body);
      if (!file) {
        return {
          success: false,
          error: 'File not found'
        };
      }
      return {
        success: true,
        data: file,
        message: 'File updated successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }, {
    params: t.Object({
      id: t.Numeric()
    }),
    body: t.Object({
      name: t.Optional(t.String()),
      path: t.Optional(t.String()),
      folder_id: t.Optional(t.Nullable(t.Number())),
      extension: t.Optional(t.Nullable(t.String())),
      size: t.Optional(t.Number()),
      mime_type: t.Optional(t.Nullable(t.String()))
    }),
    detail: {
      summary: 'Update file',
      description: 'Update an existing file',
      tags: ['Files']
    }
  })

  .post('/:id/move', async ({ params: { id }, body }) => {
    try {
      const file = await fileService.moveFile(id, body.folder_id);
      if (!file) {
        return {
          success: false,
          error: 'File not found'
        };
      }
      return {
        success: true,
        data: file,
        message: 'File moved successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }, {
    params: t.Object({
      id: t.Numeric()
    }),
    body: t.Object({
      folder_id: t.Nullable(t.Number())
    }),
    detail: {
      summary: 'Move file',
      description: 'Move a file to a different folder',
      tags: ['Files']
    }
  })

  .delete('/:id', async ({ params: { id } }) => {
    try {
      const deleted = await fileService.deleteFile(id);
      if (!deleted) {
        return {
          success: false,
          error: 'File not found'
        };
      }
      return {
        success: true,
        message: 'File deleted successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }, {
    params: t.Object({
      id: t.Numeric()
    }),
    detail: {
      summary: 'Delete file',
      description: 'Delete a file',
      tags: ['Files']
    }
  });
