import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { testConnection } from './config/database';
import { folderRoutes } from './routes/folder.routes';
import { fileRoutes } from './routes/file.routes';
import { favoriteRoutes } from './routes/favorite.routes';

const PORT = process.env.PORT || 3000;

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Windows Explorer API',
          version: '1.0.0',
          description: 'REST API for Windows Explorer file management system built with Bun, Elysia, TypeScript, and MySQL'
        },
        tags: [
          { name: 'Folders', description: 'Folder management endpoints' },
          { name: 'Files', description: 'File management endpoints' },
          { name: 'Favorites', description: 'Favorites management endpoints' }
        ]
      },
      path: '/docs'
    })
  )
  .get('/', () => ({
    message: 'Windows Explorer API',
    version: '1.0.0',
    documentation: '/docs',
    endpoints: {
      folders: '/api/folders',
      files: '/api/files',
      favorites: '/api/favorites'
    }
  }))
  .get('/health', async () => {
    const dbConnected = await testConnection();
    return {
      status: 'ok',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    };
  })
  .group('/api', (app) =>
    app
      .use(folderRoutes)
      .use(fileRoutes)
      .use(favoriteRoutes)
  )
  .listen(PORT);

console.log(`
╔════════════════════════════════════════════════╗
║   🚀 Windows Explorer API is running!         ║
╠════════════════════════════════════════════════╣
║   📡 Server: http://localhost:${PORT}           ║
║   📚 API Docs: http://localhost:${PORT}/docs    ║
║   ❤️  Health: http://localhost:${PORT}/health   ║
╚════════════════════════════════════════════════╝
`);

testConnection();

export default app;
