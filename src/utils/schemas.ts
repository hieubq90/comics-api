import { z } from 'zod'

export const Genre = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
})

export const SuggestedItem = z.object({
  id: z.string(),
  title: z.string(),
  thumbnail: z.string(),
  lastest_chapter: z.string(),
  genres: z.array(z.string()),
  authors: z.union([z.array(z.string()), z.string()]),
})

export const RecommendComic = z.object({
  id: z.string(),
  title: z.string(),
  thumbnail: z.string(),
  updated_at: z.string(),
  lastest_chapter: z.object({
    id: z.number(),
    name: z.string(),
  }),
})

export const Chapter = z.object({
  id: z.number(),
  name: z.string(),
  alias: z.string(),
})

export const Comic = z.object({
  id: z.string(),
  title: z.string(),
  thumbnail: z.string(),
  is_trending: z.boolean(),
  description: z.string(),
  short_description: z.string(),
  lastest_chapters: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      updated_at: z.string(),
    })
  ),
  genres: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().optional(),
    })
  ),
  chapters: z.array(Chapter),
  other_names: z.union([z.array(z.string()), z.string()]),
  status: z.string(),
  total_views: z.string(),
  total_comments: z.string(),
  followers: z.string(),
  updated_at: z.string(),
  authors: z.union([z.array(z.string()), z.string()]),
})

export const GetComicsResult = z.object({
  comics: z.array(Comic),
  total_pages: z.number(),
  current_page: z.number(),
})

export const ChapterDetail = z.object({
  images: z.array(
    z.object({
      page: z.number(),
      src: z.string(),
      backup_url_1: z.string(),
      backup_url_2: z.string(),
    })
  ),
  chapters: z.array(Chapter),
  chapter_name: z.string(),
  comic_name: z.string(),
})
