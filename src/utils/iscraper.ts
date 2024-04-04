import axios from 'axios';
import { load } from 'cheerio';
import userAgent from 'random-useragent';

export interface IScraper {
  getComicId(link?: string): string | undefined;
  getGenreId(link?: string): string | undefined;
}

export class BaseScraper {
  protected domain: string;
  protected agent: string;

  constructor() {
    this.domain = 'https://nettruyenee.com';
    this.agent = userAgent.getRandom();
  }

  protected async createRequest(path: string): Promise<any> {
    try {
      const url = `${process.env.API_URL || this.domain}/${path}`.replace(
        /\?+/g,
        '?',
      );
      console.log('loading url', url);
      const { data } = await axios.request({
        method: 'GET',
        url,
        headers: {
          'User-Agent': this.agent,
        },
      });
      return load(data);
    } catch (err) {
      throw err;
    }
  }

  protected formatTotal(total: string): number | string {
    if (!total) return 0;
    return total === 'N/A' ? 'Updating' : Number(total?.replace(/\./g, ''));
  }

  protected trim(text: string): string | undefined {
    return text?.replace(/\n/g, '').trim();
  }
}
