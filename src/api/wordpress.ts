import axios from 'axios'

// En desarrollo usa el proxy local, en producción usa la URL directa
const baseURL = import.meta.env.DEV
  ? '/api/wp'
  : 'https://planetaoutdoor.cl/wp-json/wp/v2'

const wpApi = axios.create({
  baseURL,
})

export interface WPPost {
  id: number
  date: string
  date_gmt: string
  modified: string
  slug: string
  status: string
  type: string
  link: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  author: number
  featured_media: number
  categories: number[]
  tags: number[]
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      id: number
      source_url: string
      alt_text: string
      media_details: {
        sizes: {
          thumbnail?: { source_url: string }
          medium?: { source_url: string }
          large?: { source_url: string }
          full?: { source_url: string }
        }
      }
    }>
    'wp:term'?: Array<Array<{
      id: number
      name: string
      slug: string
    }>>
    author?: Array<{
      id: number
      name: string
      avatar_urls: {
        '24': string
        '48': string
        '96': string
      }
    }>
  }
}

export interface WPCategory {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  parent: number
}

export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  imageUrl: string
  imageAlt: string
  categories: Array<{ id: number; name: string; slug: string }>
  author: {
    name: string
    avatar: string
  }
  readTime: number
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
}

// Extrae la primera imagen del contenido HTML
function extractFirstImage(html: string): { url: string; alt: string } | null {
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i)
  if (imgMatch) {
    const url = imgMatch[1]
    const altMatch = imgMatch[0].match(/alt=["']([^"']*)["']/i)
    return {
      url,
      alt: altMatch ? altMatch[1] : ''
    }
  }
  return null
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const text = stripHtml(content)
  const words = text.split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

function mapWPPostToBlogPost(post: WPPost): BlogPost {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]
  const categories = post._embedded?.['wp:term']?.[0] || []
  const author = post._embedded?.author?.[0]

  // Primero intenta la imagen destacada, luego busca en el contenido
  let imageUrl = featuredMedia?.source_url || featuredMedia?.media_details?.sizes?.large?.source_url || ''
  let imageAlt = featuredMedia?.alt_text || post.title.rendered

  // Si no hay imagen destacada, buscar la primera imagen en el contenido
  if (!imageUrl) {
    const contentImage = extractFirstImage(post.content.rendered)
    if (contentImage) {
      imageUrl = contentImage.url
      imageAlt = contentImage.alt || post.title.rendered
    }
  }

  return {
    id: post.id,
    slug: post.slug,
    title: post.title.rendered,
    excerpt: stripHtml(post.excerpt.rendered),
    content: post.content.rendered,
    date: post.date,
    imageUrl,
    imageAlt,
    categories: categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    })),
    author: {
      name: author?.name || 'Planeta Outdoor',
      avatar: author?.avatar_urls?.['96'] || '',
    },
    readTime: calculateReadTime(post.content.rendered),
  }
}

export const wordpressAPI = {
  async getPosts(params?: {
    page?: number
    per_page?: number
    categories?: number
    search?: string
  }): Promise<{ posts: BlogPost[]; totalPages: number; total: number }> {
    const response = await wpApi.get<WPPost[]>('/posts', {
      params: {
        _embed: true,
        per_page: params?.per_page || 10,
        page: params?.page || 1,
        categories: params?.categories,
        search: params?.search,
      },
    })

    return {
      posts: response.data.map(mapWPPostToBlogPost),
      totalPages: parseInt(response.headers['x-wp-totalpages'] || '1'),
      total: parseInt(response.headers['x-wp-total'] || '0'),
    }
  },

  async getPost(slug: string): Promise<BlogPost | null> {
    const response = await wpApi.get<WPPost[]>('/posts', {
      params: {
        slug,
        _embed: true,
      },
    })

    if (response.data.length === 0) return null
    return mapWPPostToBlogPost(response.data[0])
  },

  async getPostById(id: number): Promise<BlogPost | null> {
    try {
      const response = await wpApi.get<WPPost>(`/posts/${id}`, {
        params: { _embed: true },
      })
      return mapWPPostToBlogPost(response.data)
    } catch {
      return null
    }
  },

  async getCategories(): Promise<WPCategory[]> {
    const response = await wpApi.get<WPCategory[]>('/categories', {
      params: { per_page: 100 },
    })
    return response.data
  },

  async getRelatedPosts(postId: number, categoryIds: number[], limit = 3): Promise<BlogPost[]> {
    if (categoryIds.length === 0) return []

    const response = await wpApi.get<WPPost[]>('/posts', {
      params: {
        _embed: true,
        per_page: limit + 1,
        categories: categoryIds[0],
        exclude: postId,
      },
    })

    return response.data.slice(0, limit).map(mapWPPostToBlogPost)
  },
}

export default wordpressAPI
