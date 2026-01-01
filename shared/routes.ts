import { z } from 'zod';
import { 
  insertProfileSchema, 
  insertPublicationSchema, 
  insertProjectSchema, 
  insertNewsSchema,
  profile,
  publications,
  projects,
  news
} from './schema';

// === SHARED ERROR SCHEMAS ===
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// === API CONTRACT ===
export const api = {
  profile: {
    get: {
      method: 'GET' as const,
      path: '/api/profile',
      responses: {
        200: z.custom<typeof profile.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: 'POST' as const, // Using POST for upsert-like behavior for single profile
      path: '/api/profile',
      input: insertProfileSchema,
      responses: {
        200: z.custom<typeof profile.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  publications: {
    list: {
      method: 'GET' as const,
      path: '/api/publications',
      responses: {
        200: z.array(z.custom<typeof publications.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/publications',
      input: insertPublicationSchema,
      responses: {
        201: z.custom<typeof publications.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/publications/:id',
      input: insertPublicationSchema.partial(),
      responses: {
        200: z.custom<typeof publications.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/publications/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  projects: {
    list: {
      method: 'GET' as const,
      path: '/api/projects',
      responses: {
        200: z.array(z.custom<typeof projects.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/projects',
      input: insertProjectSchema,
      responses: {
        201: z.custom<typeof projects.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/projects/:id',
      input: insertProjectSchema.partial(),
      responses: {
        200: z.custom<typeof projects.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/projects/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  news: {
    list: {
      method: 'GET' as const,
      path: '/api/news',
      responses: {
        200: z.array(z.custom<typeof news.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/news',
      input: insertNewsSchema,
      responses: {
        201: z.custom<typeof news.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/news/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  }
};

// === BUILD URL HELPER ===
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
