import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    products: defineCollection({
      type: 'page',
      source: 'products/*.yml',
      schema: z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string(),
        category: z.string(),
        price: z.number(),
        bulk_pricing: z.array(z.object({
          min_quantity: z.number(),
          unit_price: z.number(),
        })).optional(),
        size: z.object({
          width: z.string().optional(),
          height: z.string().optional(),
          depth: z.string().optional(),
        }).optional(),
        images: z.array(z.string()).optional(), // Rutas relativas o URLs
        videos: z.array(z.string()).optional(), // Rutas relativas o URLs
        tags: z.array(z.string()).optional(),
        featured: z.boolean().optional(),
        custom_options: z.array(z.string()).optional(),
        customizable_options: z.array(z.string()).optional(), // opciones de personalización
        print_time: z.string().optional(),
        related_products: z.array(z.string()).optional(), // slugs de productos relacionados
        combina_bien_con: z.array(z.string()).optional(), // productos que combinan bien (selección manual)
      })
    })
  }
})


