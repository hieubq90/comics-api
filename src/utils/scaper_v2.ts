import axios from 'axios'

import { BaseScraper } from './iscraper'

class ScraperApiV2 extends BaseScraper {
  constructor() {
    super()
  }

  protected async getComics(path: string, page = 1, statusKey = 'all'): Promise<any> {
    const keys: any = {
      'Thể loại': 'genres',
      'Tình trạng': 'status',
      'Lượt xem': 'total_views',
      'Bình luận': 'total_comments',
      'Theo dõi': 'followers',
      'Tên khác': 'other_names',
      'Ngày cập nhật': 'updated_at',
      'Tác giả': 'authors',
    }
    const status: any = {
      all: -1,
      updating: 1,
      completed: 2,
    }
    if (!status[statusKey]) throw Error('Invalid status')
    try {
      const [$, allGenres] = await Promise.all([
        this.createRequest(
          path.includes('tim-truyen')
            ? `${path}&status=${status[statusKey]}&page=${page}`
            : `${path + (path.includes('?') ? '&' : '?')}page=${page}`
        ),
        this.getGenres(),
      ])
      const lastPage = Array.from($('.pagination-outter li.page-item')).at(-2)
      // const lastPage =
      const total_pages =
        $('a[title="Trang cuối"]')?.attr('href')?.split('=').at(-1) ||
        $('.pagination-outter li.active a').text() ||
        $('a', lastPage).text() ||
        1
      if (page > Number(total_pages)) {
        return { status: 404, message: 'Page not found' }
      }
      const comics = Array.from($('#ctl00_divCenter .item')).map((item) => {
        const thumbnail = $('.image img', item).attr('data-original')
        const title = this.trim($('figcaption h3', item).text())
        const id = this.getComicId($('figcaption h3 a', item).attr('href'))
        const is_trending = !!$('.icon-hot', item).toString()
        const short_description = $('.box_text', item).text().replace(/-/g, '').replace(/\n/g, ' ')
        const cols = Array.from($('.message_main p', item)).map((col) => {
          const [_, label, detail]: any = this.trim($(col).text())?.match(/^(.*?):(.*)$/)
          const value = /, |;\s*| - /.test(detail) ? detail.split(/, |;\s*| - /) : detail
          const key = keys[label]
          if (key === 'genres') {
            const genresList = Array.isArray(value) ? value : [value]
            const genres = genresList.map((genre: string) => {
              const foundGenre = allGenres.find((g: any) => g.name === genre)
              return { id: foundGenre?.id, name: foundGenre?.name }
            })
            return { genres }
          }
          if (key === 'status') {
            return {
              status: value === 'Hoàn thành' ? 'Completed' : 'Ongoing',
            }
          }
          return {
            [key]: value,
          }
        })
        const lastest_chapters = Array.from($('.comic-item li', item)).map((chap) => {
          const id = Number($('a', chap).attr('data-id'))
          const name = $('a', chap).text()
          const updated_at = $('.time', chap).text()
          return {
            id,
            name,
            updated_at,
          }
        })
        return Object.assign(
          {},
          {
            thumbnail: thumbnail?.startsWith('//') ? `https:${thumbnail}` : thumbnail,
            title,
            id,
            is_trending,
            short_description,
            lastest_chapters,
            genres: [],
            other_names: [],
            status: 'Updating',
            total_views: 'Updating',
            total_comments: 'Updating',
            followers: 'Updating',
            updated_at: 'Updating',
            authors: 'Updating',
          },
          ...cols
        )
      })
      return { comics, total_pages: Number(total_pages), current_page: page }
    } catch (err) {
      throw err
    }
  }

  public async getChapters(comicId: string): Promise<any> {
    try {
      const $ = await this.createRequest(`truyen-tranh/${comicId}`)
      const id = $('.star').attr('data-id')

      const { data } = await axios.get(
        `${process.env.API_URL || this.domain}/Comic/Services/ComicService.asmx/ProcessChapterList?comicId=${id}`,
        {
          headers: {
            'User-Agent': this.agent,
          },
        }
      )
      const chapters = data.chapters?.map((chapter: any) => {
        return {
          id: chapter.chapterId,
          name: chapter.name,
          alias: chapter.url.split('/').at(-2),
        }
      })
      return chapters
    } catch (err) {
      throw err
    }
  }

  public async getComicDetail(comicId: string): Promise<any> {
    try {
      const [$, chapters] = await Promise.all([
        this.createRequest(`truyen-tranh/${comicId}`),
        this.getChapters(comicId),
      ])
      const title = $('.title-detail').text()
      const thumbnail = $('#item-detail .col-image img').attr('src')
      const description = $('.detail-content p').text().replace(/\n/g, ' ').replace(/-/g, '').trim()
      let authors = $('.author p:nth-child(2)').text()
      authors = /, |;\s*| - /.test(authors)
        ? authors.split(/, |;\s*| - /)
        : authors !== 'Đang cập nhật'
        ? $('.author p:nth-child(2)').text()
        : 'Updating'
      const status = $('.status p:nth-child(2)').text() === 'Hoàn thành' ? 'Finished' : 'Ongoing'
      const genres = Array.from($('.kind p:nth-child(2) a')).map((item) => {
        const id = this.getGenreId($(item).attr('href'))
        const name = $(item).text()
        return { id, name }
      })
      const is_adult = !!$('.alert-danger').toString()
      const other_names = $('.other-name')
        .text()
        .split(/, |;| - /)
        .map((x: string) => x.trim())
      const total_views = this.formatTotal($('.list-info .row:last-child p:nth-child(2)').text())
      const rating_count = Number($('span[itemprop="ratingCount"]').text())
      const average = Number($('span[itemprop="ratingValue"]').text())
      const followers = this.formatTotal($('.follow b').text())
      return {
        title,
        thumbnail: thumbnail?.startsWith('//') ? `https:${thumbnail}` : thumbnail,
        description,
        authors,
        status,
        genres,
        total_views,
        average,
        rating_count,
        followers,
        chapters,
        id: comicId,
        is_adult,
        other_names: other_names[0] !== '' ? other_names : [],
      }
    } catch (err) {
      throw err
    }
  }

  public async getChapter(comicId: string, chapterId: number, alias: string): Promise<any> {
    try {
      const url = alias
        ? `truyen-tranh/${comicId.split('-').slice(0, -1).join('-')}/${alias}/${chapterId}`
        : `truyen-tranh/${comicId}/chapter/${chapterId}`
      const [$, chapters] = await Promise.all([this.createRequest(url), this.getChapters(comicId)])
      const images = Array.from($('.page-chapter img')).map((img, idx) => {
        const page = idx + 1
        const attrs = $(img).attr()
        const src = `/images/get?mode=2&src=${attrs['data-src']}`
        const backup_url_1 = `/images/get?mode=2&src=${attrs['data-sv1']}`
        const backup_url_2 = `/images/get?mode=2&src=${attrs['data-sv2']}`
        return { page, src, backup_url_1, backup_url_2 }
      })
      const chapter_name = $('.breadcrumb li:last-child').first().text()
      const comic_name = $('.breadcrumb li:nth-last-child(2)').first().text()
      return { images, chapters, chapter_name, comic_name }
    } catch (err) {
      throw err
    }
  }
}

const ScaperV2 = new ScraperApiV2()

export { ScaperV2 }
