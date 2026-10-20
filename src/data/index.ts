import raw from './content.json';
import type { AuthorProfile, Movie, Review } from './types';
export const FIREFLIES = raw.FIREFLIES;
export const avatars = raw.avatars;
const baseMovies = raw.MOVIES as unknown as Movie[];
const extraWorks = raw.AUTHOR_WORKS.filter(w => !baseMovies.some(m => m.title === w.title));
export const MOVIES: Movie[] = [
  ...baseMovies,
  ...extraWorks.map((w, i) => ({
    id: baseMovies.length + i,
    title: w.title,
    year: w.year,
    genre: w.genre,
    director: w.director,
    country: '—',
    poster: w.poster,
    desc: 'Фильм из фильмографии Дени Вильнёва.',
    reviews: w.reviews,
    ratings: w.ratings,
    preferred: w.popularity,
    total: w.scores.reviews,
    parts: [],
    authorComment: null,
    scoreSets: {
      reviews: { total: w.scores.reviews, parts: [] },
      ratings: { total: w.scores.ratings, parts: [] },
      critics: { total: w.scores.critics, parts: [] }
    }
  }))
];
export const INITIAL_REVIEWS = raw.REVIEWS as unknown as Review[];
export const PARAM_INFO = raw.PARAM_INFO;
export const PARAM_NAMES = ['Драматургия и структура','Персонажи и исполнение','Визуальный язык','Звук и музыка','Впечатление'];
export const PEOPLE = raw.PEOPLE as {directors: string[][];actors: string[][]};
export const CREW = raw.CREW as {actors: string[][];team: string[][]};
export const AUTHOR_PROFILES = raw.AUTHOR_PROFILES as unknown as Record<string,AuthorProfile>;
export const STATUS_ACTIONS = raw.STATUS_ACTIONS;
export const fmt = (n: number) => Number(n).toLocaleString('ru-RU');
export const calcReviewTotal = (parts: number[]) => Math.round(((parts[0]+parts[1]+parts[2]+parts[3])/4)*10*(.4+.6*(parts[4]-1)/9));
