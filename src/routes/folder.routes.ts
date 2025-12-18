import { Elysia, t } from 'elysia';
import { FolderService } from '../services/folder.service';

const folderService = new FolderService();

export const folderRoutes = new Elysia({ prefix: '/folders' })
  .get('/', async ({ query }) => {
    try {
      const result = await folderService.getAllFolders(query);
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
      summary: 'Get all folders',
      description: 'Retrieve all folders with pagination and search',
      tags: ['Folders']
    }
  })

  .get('/:id', async ({ params: { id } }) => {
    try {
      const folder = await folderService.getFolderById(id);
      if (!folder) {
        return {
          success: false,
          error: 'Folder not found'
        };
      }
      return {
        success: true,
        data: folder
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
      summary: 'Get folder by ID',
      description: 'Retrieve a specific folder by its ID',
      tags: ['Folders']
    }
  })

  .get('/:id/contents', async ({ params: { id } }) => {
    try {
      const contents = await folderService.getFolderContents(id);
      return {
        success: true,
        data: contents
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
      summary: 'Get folder contents',
      description: 'Retrieve all folders and files inside a specific folder',
      tags: ['Folders']
    }
  })

  .get('/tree/all', async () => {
    try {
      const tree = await folderService.getFolderTree();
      return {
        success: true,
        data: tree
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }, {
    detail: {
      summary: 'Get folder tree',
      description: 'Retrieve the entire folder structure as a tree',
      tags: ['Folders']
    }
  })

  .post('/', async ({ body }) => {
    try {
      const folder = await folderService.createFolder(body);
      return {
        success: true,
        data: folder,
        message: 'Folder created successfully'
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
      parent_id: t.Optional(t.Nullable(t.Number()))
    }),
    detail: {
      summary: 'Create new folder',
      description: 'Create a new folder',
      tags: ['Folders']
    }
  })

  .put('/:id', async ({ params: { id }, body }) => {
    try {
      const folder = await folderService.updateFolder(id, body);
      if (!folder) {
        return {
          success: false,
          error: 'Folder not found'
        };
      }
      return {
        success: true,
        data: folder,
        message: 'Folder updated successfully'
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
      parent_id: t.Optional(t.Nullable(t.Number()))
    }),
    detail: {
      summary: 'Update folder',
      description: 'Update an existing folder',
      tags: ['Folders']
    }
  })

  .delete('/:id', async ({ params: { id } }) => {
    try {
      const deleted = await folderService.deleteFolder(id);
      if (!deleted) {
        return {
          success: false,
          error: 'Folder not found'
        };
      }
      return {
        success: true,
        message: 'Folder deleted successfully'
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
      summary: 'Delete folder',
      description: 'Delete a folder and all its contents',
      tags: ['Folders']
    }
  });
