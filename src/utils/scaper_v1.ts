import { BaseScraper, IScraper } from './iscraper';

class ScraperApiV1 extends BaseScraper implements IScraper {
  getComicId(link?: string): string {
    if (!link) return '';
    return link?.match(/\/([^/]+)-\d+$/)?.[0].replace('/', '');
  }
  getGenreId(link?: string): string {
    if (!link) return '';
    return link?.match(/[^/]+$/)?.[0];
  }
}

const ScaperV1 = new ScraperApiV1();

export { ScaperV1 };
