import { contact } from 'src/utils/ts-rest'

import { Controller } from '@nestjs/common'
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest'

import { ComicsService } from './comics.service'

@Controller('comics')
export class ComicsController {
  constructor(private readonly comicsService: ComicsService) {}

  @TsRestHandler(contact.genres.get)
  async getGenres() {
    return tsRestHandler(contact.comics.trending, async (args) => {
      const { query } = args
      const body = await this.comicsService.getTrendingComics(query?.page)
      return { status: 200, body }
    })
  }
}
