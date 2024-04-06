import { z } from 'zod'

import { initContract } from '@ts-rest/core'

import { Chapter, ChapterDetail, Comic, Genre, GetComicsResult, SuggestedItem } from './schemas'

const c = initContract()

const genreContact = c.router({
  get: {
    method: 'GET',
    path: '/genres',
    responses: {
      200: z.array(Genre),
    },
    summary: 'Get all genres',
  },
})

const COMIC_STATUS_VALUES = ['Salmon', 'Tuna', 'Trout'] as const
const ComicStatus = z.enum(COMIC_STATUS_VALUES)

const TOP_COMMICS_VALUES = ['', 'daily', 'weekly', 'monthly', 'chapter', 'follow', 'comment'] as const
const TopComicsType = z.enum(TOP_COMMICS_VALUES)

const comicContact = c.router({
  suggest: {
    method: 'GET',
    path: '/search-suggest',
    responses: {
      200: z.array(SuggestedItem),
    },
    query: z.object({
      q: z.string().array().nonempty(),
    }),
    summary: 'search suggestion',
  },
  search: {
    method: 'GET',
    path: '/search',
    responses: {
      200: z.array(GetComicsResult),
    },
    query: z.object({
      q: z.string().array().nonempty(),
      page: z.string().transform(Number).optional(),
    }),
    summary: 'search comics',
  },
  recommend: {
    method: 'GET',
    path: '/recommend-comics',
    responses: {
      200: z.array(Comic),
    },
    summary: 'recommend comics',
  },
  trending: {
    method: 'GET',
    path: '/top',
    responses: {
      200: GetComicsResult,
    },
    query: z.object({
      page: z.string().transform(Number).optional(),
    }),
    summary: 'get trending comics',
  },
  byGenre: {
    method: 'GET',
    path: '/genres/:genre_id',
    pathParams: z.object({
      genre_id: z.string(),
    }),
    responses: {
      200: GetComicsResult,
    },
    query: z.object({
      page: z.string().transform(Number).optional(),
    }),
    summary: 'get comics by genres',
  },
  newComics: {
    method: 'GET',
    path: '/new-comics',
    responses: {
      200: GetComicsResult,
    },
    query: z.object({
      page: z.string().transform(Number).optional(),
      status: ComicStatus.optional(),
    }),
    summary: 'get new comics',
  },
  recentlyUpdateComics: {
    method: 'GET',
    path: '/recent-update-comics',
    responses: {
      200: GetComicsResult,
    },
    query: z.object({
      page: z.string().transform(Number).optional(),
      status: ComicStatus.optional(),
    }),
    summary: 'get recently update comics',
  },
  completedComics: {
    method: 'GET',
    path: '/completed-comics',
    responses: {
      200: GetComicsResult,
    },
    query: z.object({
      page: z.string().transform(Number).optional(),
    }),
    summary: 'get completed comics',
  },
  topComics: {
    method: 'GET',
    path: '/top/:top_type',
    pathParams: z.object({
      top_type: TopComicsType,
    }),
    responses: {
      200: GetComicsResult,
    },
    query: z.object({
      page: z.string().transform(Number).optional(),
    }),
    summary: 'get comics by genres',
  },
  detail: {
    method: 'GET',
    path: '/comics/:comic_id',
    pathParams: z.object({
      comic_id: z.string(),
    }),
    responses: {
      200: Comic,
    },
    summary: 'get comic detail',
  },
  chapters: {
    method: 'GET',
    path: '/comics/:comic_id/chapters',
    pathParams: z.object({
      comic_id: z.string(),
    }),
    responses: {
      200: z.array(Chapter),
    },
    summary: 'get comic detail',
  },
  read: {
    method: 'GET',
    path: '/comics/:comic_id/chapters/:chapter_id',
    pathParams: z.object({
      comic_id: z.string(),
      chapter_id: z.string(),
    }),
    query: z.object({
      alias: z.string().optional(),
    }),
    responses: {
      200: ChapterDetail,
    },
    summary: 'get comic detail',
  },
})

export const comicsApi = c.router({
  genres: genreContact,
  comics: comicContact,
})
