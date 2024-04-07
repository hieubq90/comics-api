import axios from 'axios'
import { load } from 'cheerio'

import { BaseScraper } from './iscraper'

class ScraperApiV1 extends BaseScraper {
  constructor() {
    super()
  }

  protected override async createRequest(path: string): Promise<any> {
    try {
      const url = `${this.domain}/${path}`.replace(/\?+/g, '?')
      const { data } = await axios.request({
        method: 'GET',
        url,
        headers: {
          'User-Agent': this.agent,
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'no-cache',
          pragma: 'no-cache',
          'sec-ch-ua': '"Microsoft Edge";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'none',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': '1',
        },
      })
      return load(data)
    } catch (err) {
      throw err
    }
  }
}

const ScaperV1 = new ScraperApiV1()

export { ScaperV1 }
