import { Elysia, t } from 'elysia';
import { FavoriteService } from '../services/favorite.service';

const favoriteService = new FavoriteService();

export const favoriteRoutes = new Elysia({ prefix: '/favorites' })
  .get('/', async () => {
    try {
      const favorites = await favoriteService.getAllFavorites();
      return {
        success: true,
        data: favorites
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }, {
    detail: {
      summary: 'Get all favorites',
      description: 'Retrieve all favorite items (files and folders)',
      tags: ['Favorites']
    }
  })

  .post('/', async ({ body }) => {
    try {
      const favorite = await favoriteService.addFavorite(body.item_type, body.item_id);
      return {
        success: true,
        data: favorite,
        message: 'Added to favorites'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }, {
    body: t.Object({
      item_type: t.Union([t.Literal('file'), t.Literal('folder')]),
      item_id: t.Number()
    }),
    detail: {
      summary: 'Add to favorites',
      description: 'Add a file or folder to favorites',
      tags: ['Favorites']
    }
  })

  .delete('/:id', async ({ params: { id } }) => {
    try {
      const deleted = await favoriteService.removeFavorite(id);
      if (!deleted) {
        return {
          success: false,
          error: 'Favorite not found'
        };
      }
      return {
        success: true,
        message: 'Removed from favorites'
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
      summary: 'Remove from favorites',
      description: 'Remove a favorite item',
      tags: ['Favorites']
    }
  })

  .get('/check/:itemType/:itemId', async ({ params: { itemType, itemId } }) => {
    try {
      const isFav = await favoriteService.isFavorite(itemType as 'file' | 'folder', itemId);
      return {
        success: true,
        data: {
          is_favorite: isFav
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }, {
    params: t.Object({
      itemType: t.String(),
      itemId: t.Numeric()
    }),
    detail: {
      summary: 'Check if favorited',
      description: 'Check if an item is in favorites',
      tags: ['Favorites']
    }
  });
