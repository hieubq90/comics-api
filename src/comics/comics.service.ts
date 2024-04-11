import { getSourceSetting, Status } from 'src/utils/iscraper'
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

  async getRecommendComics(type: 'hot' | 'boy' | 'girl' = 'hot') {
    try {
      const sourceSetting = await getSourceSetting()
      if (sourceSetting.mode === 1) {
        ScaperV1.setSource(sourceSetting.source)
        return await ScaperV1.getRecommendComics(type)
      } else if (sourceSetting.mode === 2) {
        ScaperV2.setSource(sourceSetting.source)
        return await ScaperV2.getRecommendComics(type)
      }
      return {}
    } catch (err) {
      throw err
    }
  }

  async getNewComics(status?: Status, page?: number) {
    try {
      const sourceSetting = await getSourceSetting()
      if (sourceSetting.mode === 1) {
        ScaperV1.setSource(sourceSetting.source)
        return await ScaperV1.getNewComics(status, page)
      } else if (sourceSetting.mode === 2) {
        ScaperV2.setSource(sourceSetting.source)
        return await ScaperV2.getNewComics(status, page)
      }
      return {}
    } catch (err) {
      throw err
    }
  }

  async getCompletedComics(page?: number) {
    try {
      const sourceSetting = await getSourceSetting()
      if (sourceSetting.mode === 1) {
        ScaperV1.setSource(sourceSetting.source)
        return await ScaperV1.getCompletedComics(page)
      } else if (sourceSetting.mode === 2) {
        ScaperV2.setSource(sourceSetting.source)
        return await ScaperV2.getCompletedComics(page)
      }
      return {}
    } catch (err) {
      throw err
    }
  }

  async getTopComics(topType: string, status?: Status, page?: number) {
    try {
      const sourceSetting = await getSourceSetting()
      if (sourceSetting.mode === 1) {
        ScaperV1.setSource(sourceSetting.source)
        switch (topType) {
          case 'daily':
            return await ScaperV1.getTopDailyComics(status, page)
          case 'weekly':
            return await ScaperV1.getTopWeeklyComics(status, page)
          case 'monthly':
            return await ScaperV1.getTopMonthlyComics(status, page)
          default:
            return await ScaperV1.getTopAllComics(status, page)
        }
      } else if (sourceSetting.mode === 2) {
        ScaperV2.setSource(sourceSetting.source)
        switch (topType) {
          case 'daily':
            return await ScaperV2.getTopDailyComics(status, page)
          case 'weekly':
            return await ScaperV2.getTopWeeklyComics(status, page)
          case 'monthly':
            return await ScaperV2.getTopMonthlyComics(status, page)
          default:
            return await ScaperV2.getTopAllComics(status, page)
        }
      }
      return {}
    } catch (err) {
      throw err
    }
  }

  async getComicDetail(comic_id: string) {
    try {
      const sourceSetting = await getSourceSetting()
      if (sourceSetting.mode === 1) {
        ScaperV1.setSource(sourceSetting.source)
        return ScaperV1.getComicDetail(comic_id)
      } else if (sourceSetting.mode === 2) {
        ScaperV2.setSource(sourceSetting.source)
        return ScaperV2.getComicDetail(comic_id)
      }
      return {}
    } catch (err) {
      throw err
    }
  }

  async getChapters(comic_id: string) {
    try {
      const sourceSetting = await getSourceSetting()
      if (sourceSetting.mode === 1) {
        ScaperV1.setSource(sourceSetting.source)
        return ScaperV1.getChapters(comic_id)
      } else if (sourceSetting.mode === 2) {
        ScaperV2.setSource(sourceSetting.source)
        return ScaperV2.getChapters(comic_id)
      }
      return []
    } catch (err) {
      throw err
    }
  }

  async getChapterContent(comic_id: string, chapter_id: string, alias: string) {
    try {
      const sourceSetting = await getSourceSetting()
      if (sourceSetting.mode === 1) {
        ScaperV1.setSource(sourceSetting.source)
        return ScaperV1.getChapter(comic_id, chapter_id, alias)
      } else if (sourceSetting.mode === 2) {
        ScaperV2.setSource(sourceSetting.source)
        return ScaperV2.getChapter(comic_id, chapter_id, alias)
      }
      return []
    } catch (err) {
      throw err
    }
  }
}
