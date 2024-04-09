import { contact } from 'src/utils/ts-rest'

import { Controller } from '@nestjs/common'
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest'

import { ComicsService } from './comics.service'

@Controller('')
export class ComicsController {
  constructor(private readonly comicsService: ComicsService) {}

  @TsRestHandler(contact.comics.trending)
  async getTrendingComics() {
    return tsRestHandler(contact.comics.trending, async (args) => {
      const { query } = args
      const body = await this.comicsService.getTrendingComics(query?.page)
      return { status: 200, body }
    })
  }

  @TsRestHandler(contact.comics.new)
  async getNewComics() {
    return tsRestHandler(contact.comics.new, async (args) => {
      const { query } = args
      const body = await this.comicsService.getNewComics(query.status, query?.page)
      return { status: 200, body }
    })
  }

  @TsRestHandler(contact.comics.completed)
  async getCompletedComics() {
    return tsRestHandler(contact.comics.completed, async (args) => {
      const { query } = args
      const body = await this.comicsService.getCompletedComics(query?.page)
      return { status: 200, body }
    })
  }

  @TsRestHandler(contact.comics.top)
  async getTopComics() {
    return tsRestHandler(contact.comics.top, async (args) => {
      const { params, query } = args
      const body = await this.comicsService.getTopComics(params.top_type, query.status, query?.page)
      return { status: 200, body }
    })
  }

  @TsRestHandler(contact.comics.detail)
  async getComicDetail() {
    return tsRestHandler(contact.comics.detail, async (args) => {
      const { params } = args
      const body = await this.comicsService.getComicDetail(params.comic_id)
      return { status: 200, body }
    })
  }

  @TsRestHandler(contact.comics.chapters)
  async getChapters() {
    return tsRestHandler(contact.comics.chapters, async (args) => {
      const { params } = args
      const body = await this.comicsService.getChapters(params.comic_id)
      return { status: 200, body }
    })
  }

  @TsRestHandler(contact.comics.read)
  async read() {
    return tsRestHandler(contact.comics.read, async (args) => {
      const { params, query } = args
      const body = await this.comicsService.getChapterContent(params.comic_id, params.chapter_id, query.alias)
      return { status: 200, body }
    })
  }
}
