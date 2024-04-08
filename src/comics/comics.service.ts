import { getSourceSetting } from 'src/utils/iscraper'
import { ScaperV1 } from 'src/utils/scaper_v1'
import { ScaperV2 } from 'src/utils/scaper_v2'

import { Injectable } from '@nestjs/common'

@Injectable()
export class ComicsService {
  async getTrendingComics(page?: number) {
    try {
      const sourceSetting = await getSourceSetting()
      if (sourceSetting.mode === 1) {
        ScaperV1.setSource(sourceSetting.source)
        return await ScaperV1.getTrendingComics(page)
      } else if (sourceSetting.mode === 2) {
        ScaperV2.setSource(sourceSetting.source)
        return await ScaperV2.getTrendingComics(page)
      }
      return {}
    } catch (err) {
      throw err
    }
  }
}
