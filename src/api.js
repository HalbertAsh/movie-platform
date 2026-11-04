import { getAnalyticsIdentity } from './analytics.js';
/**
 * Эхо — API client (FE integration layer).
 *
 * ВАЖНО: этот модуль должен импортироваться интерфейсом. Сам по себе файл не
 * переключает демо-данные на сервер. VITE_API_URL подставляет Vite при сборке.
 * Контракты payload/response для ряда методов требуют подтверждения BE.
 */

const ENV_API_URL = String(import.meta.env?.VITE_API_URL ?? (typeof window!=='undefined'?window.__ECHO_API_URL__:'') ?? '').trim();
const API_URL = ENV_API_URL.replace(/\/+$/, '');
const REQUEST_TIMEOUT_MS = 10_000;
const ACCESS_KEY = 'echo:accessToken';
const REFRESH_KEY = 'echo:refreshToken';
const ENDPOINTS = Object.freeze({
  login: '/v1/auth/login',
  register: '/v1/auth/register',
  refresh: '/v1/auth/refresh',
  logout: '/v1/auth/logout',
  me: '/v1/me',
  media: '/v1/media',
  movieDetails: id => `/v2/media/movie/${safeId(id)}/details`,
  reviews: '/v2/reviews',
  reviewLike: id => `/v2/reviews/${safeId(id)}/like`,
  myProfile: '/v1/me/profile',
  userProfile: id => `/v1/users/${safeId(id)}/profile`,
  rating: id => `/v2/me/ratings/movie/${safeId(id)}`,
  preference: (type, id) => `/v1/me/preferences/${type}/${safeId(id)}`,
});
const DEFAULT_POSTER = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">' +
  '<rect width="300" height="450" fill="#191724"/>' +
  '<text x="150" y="230" font-family="Arial,sans-serif" font-size="54" font-weight="700" fill="#c9baff" text-anchor="middle">Эхо</text>' +
  '</svg>'
);

export const isDemoMode = () => !API_URL;
export const apiBaseUrl = API_URL;

const ERROR_TEXT = {
  USERNAME_TAKEN: 'Этот логин уже занят.',
  INVALID_CREDENTIALS: 'Неверный логин или пароль.',
  WRONG_PASSWORD: 'Неверный пароль.',
  INVALID_PASSWORD: 'Неверный пароль.',
  PASSWORD_TOO_SHORT: 'Пароль должен содержать не менее 8 символов.',
  VALIDATION_ERROR: 'Проверьте правильность заполнения полей.',
  FORBIDDEN: 'Недостаточно прав для этого действия.',
  NOT_FOUND: 'Запрошенные данные не найдены.',
  UNAUTHORIZED: 'Необходимо войти в аккаунт.',
};

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'UNKNOWN', details = null, cause } = {}) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function readableError(status, code, message) {
  if (code && ERROR_TEXT[code]) return ERROR_TEXT[code];
  if (status === 401) return 'Неверный логин или пароль либо сессия истекла.';
  if (status === 403) return 'Недостаточно прав для этого действия.';
  if (status === 404) return 'Запрошенные данные не найдены.';
  if (status === 409) return 'Конфликт данных. Проверьте введённые значения.';
  if (status >= 500) return 'Сервер временно недоступен. Попробуйте позже.';
  return typeof message === 'string' && message.trim() ? message : 'Не удалось выполнить запрос.';
}

function asApiError(response, payload) {
  const error = payload?.error ?? {};
  const code = String(error.code ?? payload?.code ?? `HTTP_${response.status}`);
  return new ApiError(readableError(response.status, code, error.message ?? payload?.message), {
    status: response.status,
    code,
    details: error.details ?? null,
  });
}

function getStorage() {
  try { return typeof localStorage !== 'undefined' ? localStorage : null; }
  catch { return null; }
}
function readStorage(key) {
  try { return getStorage()?.getItem(key) ?? null; } catch { return null; }
}
function writeStorage(key, value) {
  try { if (value) getStorage()?.setItem(key, String(value)); } catch { /* storage unavailable */ }
}
function deleteStorage(key) {
  try { getStorage()?.removeItem(key); } catch { /* storage unavailable */ }
}
export function getTokens() {
  return { accessToken: readStorage(ACCESS_KEY), refreshToken: readStorage(REFRESH_KEY) };
}
export function clearTokens() {
  deleteStorage(ACCESS_KEY);
  deleteStorage(REFRESH_KEY);
}
export function saveTokens(payload) {
  const source = payload?.data?.tokens ?? payload?.tokens ?? payload?.data ?? payload ?? {};
  const accessToken = source.accessToken ?? source.access_token;
  const refreshToken = source.refreshToken ?? source.refresh_token;
  if (accessToken) writeStorage(ACCESS_KEY, accessToken);
  if (refreshToken) writeStorage(REFRESH_KEY, refreshToken);
  return getTokens();
}

let onAuthExpired = null;
let refreshPromise = null;
export function setAuthExpiredHandler(handler) {
  onAuthExpired = typeof handler === 'function' ? handler : null;
}
function expireSession() {
  clearTokens();
  if (onAuthExpired) {
    try { onAuthExpired(); } catch (error) { console.error('Auth expired handler:', error); }
  }
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('echo:auth-expired'));
  }
  // Навигацию на экран входа должен выполнить UI через handler/event.
}

function queryString(query) {
  if (!query) return '';
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) value.forEach(item => params.append(key, String(item)));
    else params.set(key, String(value));
  }
  const result = params.toString();
  return result ? `?${result}` : '';
}
function urlFor(path, query) {
  if (!/^\/(?!\/)/.test(path)) throw new ApiError('Некорректный путь API.', { code: 'INVALID_PATH' });
  return `${API_URL}${path}${queryString(query)}`;
}

/** Все HTTP-вызовы, включая refresh, проходят только через request(). */
export async function request(path, options = {}) {
  if (isDemoMode()) return null; // UI продолжает использовать существующие демо-данные.
  const {
    method = 'GET', body, query, headers = {}, auth = true,
    skipRefresh = false, timeout = REQUEST_TIMEOUT_MS, signal,
  } = options;
  const requestHeaders = new Headers(headers);
  if (!requestHeaders.has('Accept')) requestHeaders.set('Accept', 'application/json');
  if (body !== undefined && body !== null && !(body instanceof FormData) && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }
  const token = getTokens().accessToken;
  if (auth && token) requestHeaders.set('Authorization', `Bearer ${token}`);

  const controller = new AbortController();
  let timedOut = false;
  let externallyAborted = false;
  const abortFromOutside = () => { externallyAborted = true; controller.abort(); };
  if (signal) {
    if (signal.aborted) abortFromOutside();
    else signal.addEventListener('abort', abortFromOutside, { once: true });
  }
  const timeoutId = setTimeout(() => { timedOut = true; controller.abort(); }, timeout);
  try {
    const response = await fetch(urlFor(path, query), {
      method,
      headers: requestHeaders,
      body: body === undefined || body === null ? undefined :
        body instanceof FormData || typeof body === 'string' ? body : JSON.stringify(body),
      signal: controller.signal,
    });
    const raw = response.status === 204 ? '' : await response.text();
    let payload = null;
    if (raw) {
      try { payload = JSON.parse(raw); }
      catch { payload = { message: raw.slice(0, 500) }; }
    }
    if (response.status === 401 && auth && !skipRefresh) {
      const updated = await refreshAccessToken();
      if (!updated) {
        expireSession();
        throw new ApiError('Сессия истекла. Войдите снова.', { status: 401, code: 'SESSION_EXPIRED' });
      }
      return request(path, { ...options, skipRefresh: true });
    }
    if (response.status === 401 && auth && skipRefresh) {
      expireSession();
      throw new ApiError('Сессия истекла. Войдите снова.', { status: 401, code: 'SESSION_EXPIRED' });
    }
    if (!response.ok) throw asApiError(response, payload);
    return payload;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (timedOut) throw new ApiError('Сервер не ответил за 10 секунд. Попробуйте ещё раз.', { code: 'TIMEOUT', cause: error });
    if (externallyAborted) throw new ApiError('Запрос отменён.', { code: 'ABORTED', cause: error });
    throw new ApiError('Нет соединения с сервером. Проверьте интернет.', { code: 'NETWORK_ERROR', cause: error });
  } finally {
    clearTimeout(timeoutId);
    if (signal) signal.removeEventListener('abort', abortFromOutside);
  }
}

async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;
  const refreshToken = getTokens().refreshToken;
  if (!refreshToken) return false;
  refreshPromise = (async () => {
    try {
      const result = await request(ENDPOINTS.refresh, {
        method: 'POST', body: { refreshToken }, auth: false, skipRefresh: true,
      });
      const tokenSource = result?.data?.tokens ?? result?.tokens ?? result?.data ?? result ?? {};
      const freshAccess = tokenSource.accessToken ?? tokenSource.access_token;
      if (!freshAccess) return false;
      saveTokens(result);
      return true;
    } catch { return false; }
    finally { refreshPromise = null; }
  })();
  return refreshPromise;
}

const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const array = value => Array.isArray(value) ? value : [];
const text = value => typeof value === 'string' ? value : '';
const number = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const unwrap = value => value?.data ?? value ?? {};
const safeId = id => encodeURIComponent(String(id));
const first = (...values) => values.find(v => v !== null && v !== undefined && v !== '');

function asImage(value, fallback = DEFAULT_POSTER) {
  const url = text(value);
  if (/^https?:\/\//i.test(url) || /^data:image\//i.test(url) || url.startsWith('/')) return url.replace(/[\"<>]/g, c => encodeURIComponent(c));
  return fallback;
}
function asPersonName(value) {
  if (typeof value === 'string') return value;
  const person = object(value);
  return text(first(person.name, person.fullName, person.nickname));
}
function asNames(value) {
  return array(value).map(asPersonName).filter(Boolean);
}
function asGenres(value) {
  if (typeof value === 'string') return value;
  return array(value).map(item => text(typeof item === 'string' ? item : item?.name)).filter(Boolean).join(', ');
}
function normalizeScore(value) {
  const source = object(value);
  const scores = object(first(source.parameters, source.parameterAverages, source.scores));
  return {
    score: number(first(source.score, source.average, source.value, typeof value === 'number' ? value : null)),
    parameters: {
      dramaturgy: number(first(scores.dramaturgy, scores.story)),
      characters: number(first(scores.characters, scores.acting)),
      visual: number(first(scores.visual, scores.visualLanguage)),
      sound: number(first(scores.sound, scores.music)),
      impression: number(first(scores.impression, scores.personalImpression)),
    },
  };
}

/** Нормализация приблизительная: окончательные имена полей согласовать с BE. */
export function normalizeMovie(raw, details = null) {
  const item = object(unwrap(raw));
  const extra = object(unwrap(details));
  const source = { ...item, ...extra };
  const averages = object(first(source.averageRatings, source.averages, source.ratingsSummary));
  const crew = array(first(source.crew, source.credits?.crew));
  const directors = asNames(first(source.directors, crew.filter(p => p?.job === 'Director')));
  return {
    id: number(first(source.tmdbId, source.tmdb_id, source.id)),
    tmdbId: number(first(source.tmdbId, source.tmdb_id, source.id)),
    title: text(first(source.title, source.name, source.originalTitle)),
    year: number(first(source.year, String(first(source.releaseDate, source.release_date, '')).slice(0, 4))),
    genre: asGenres(first(source.genres, source.genre)),
    country: asGenres(first(source.countries, source.productionCountries, source.country)),
    director: asPersonName(first(source.director, directors.join(', '))),
    cast: asNames(first(source.cast, source.credits?.cast)),
    crew,
    poster: asImage(first(source.poster, source.posterUrl, source.poster_url, source.posterPath)),
    desc: text(first(source.description, source.overview, source.synopsis)),
    reviewsCount: number(first(source.reviewsCount,source.reviewCount,source.stats?.reviews)),
    ratingsCount: number(first(source.ratingsCount,source.ratingCount,source.stats?.ratings)),
    preferredCount: number(first(source.preferredCount,source.preferencesCount,source.stats?.preferences)),
    averages: {
      reviews: normalizeScore(first(averages.reviews, averages.withReviews, source.reviewAverage)),
      ratings: normalizeScore(first(averages.ratings, averages.withoutReviews, source.ratingAverage)),
      media: normalizeScore(first(averages.media, averages.critics, source.mediaAverage)),
    },
  };
}

export function normalizeReview(raw) {
  const value = object(unwrap(raw));
  return {
    id: first(value.id, value.reviewId, 0),
    movieId: number(first(value.tmdbId, value.movie?.tmdbId, value.mediaId)),
    authorId: first(value.authorId, value.user?.id, null),
    author: text(first(value.author?.nickname, value.user?.nickname, value.authorName)),
    avatar: asImage(first(value.author?.avatar, value.user?.avatar), DEFAULT_POSTER),
    title: text(first(value.title, value.headline)),
    text: text(first(value.text, value.content, value.body)),
    rating: number(first(value.rating?.total, value.score, value.rating)),
    likes: number(first(value.likesCount, value.likeCount, value.likes)),
    liked: Boolean(first(value.likedByMe, value.isLiked, false)),
    status: text(first(value.status, '')),
    spoilers: Boolean(first(value.spoilers,value.spoiler,false)),
    parts: Array.isArray(value.rating?.parts) ? value.rating.parts : Array.isArray(value.parts) ? value.parts : (value.rating?.parameters ? [value.rating.parameters.dramaturgy,value.rating.parameters.characters,value.rating.parameters.visual,value.rating.parameters.sound,value.rating.parameters.impression].map(number) : []),
    createdAt: text(first(value.createdAt, value.date)),
  };
}

export function normalizeProfile(raw) {
  const source = object(unwrap(raw));
  const preferences = object(source.preferences);
  return {
    id: first(source.id, source.userId, null),
    nickname: text(first(source.nickname, source.username, source.login)),
    bio: text(source.bio),
    avatar: asImage(first(source.avatar, source.avatarUrl), DEFAULT_POSTER),
    stats: {
      reviews: number(first(source.stats?.reviews, source.stats?.reviewsCount)),
      ratings: number(first(source.stats?.ratings, source.stats?.ratingsCount)),
      likesReceived: number(first(source.stats?.likesReceived, source.stats?.receivedLikes)),
      likesGiven: number(first(source.stats?.likesGiven, source.stats?.givenLikes)),
      mediaLikes: number(source.stats?.mediaLikes),
    },
    preferences: {
      movies: array(first(preferences.movies, preferences.movie)),
      directors: array(first(preferences.directors, preferences.director)),
      actors: array(first(preferences.actors, preferences.actor)),
    },
  };
}

export async function login(loginName, password) {
  if (isDemoMode()) return null;
  if (!loginName?.trim()) throw new ApiError('Введите логин.', { code: 'LOGIN_REQUIRED' });
  if (!password) throw new ApiError('Введите пароль.', { code: 'PASSWORD_REQUIRED' });
  const result = await request(ENDPOINTS.login, {
    method: 'POST', auth: false, skipRefresh: true,
    body: { login: loginName.trim(), password, ...getAnalyticsIdentity() },
  });
  saveTokens(result);
  return result;
}
export async function register(loginName, password) {
  if (isDemoMode()) return null;
  if (!loginName?.trim()) throw new ApiError('Введите логин.', { code: 'LOGIN_REQUIRED' });
  if (!password || password.length < 8) {
    throw new ApiError('Пароль должен содержать не менее 8 символов.', { code: 'PASSWORD_TOO_SHORT' });
  }
  const result = await request(ENDPOINTS.register, {
    method: 'POST', auth: false, skipRefresh: true,
    body: { login: loginName.trim(), password, ...getAnalyticsIdentity() },
  });
  saveTokens(result);
  return result;
}
export const getMe = () => request(ENDPOINTS.me);
export async function restoreSession() {
  if (isDemoMode() || (!getTokens().accessToken && !getTokens().refreshToken)) return null;
  try { return await getMe(); }
  catch (error) {
    if (error.status === 401) return null;
    throw error;
  }
}
export async function logout() {
  try {
    if (!isDemoMode() && getTokens().accessToken) {
      await request(ENDPOINTS.logout, { method: 'POST', skipRefresh: true });
    }
  } finally { clearTokens(); }
}

export async function getMovies({ limit = 20, offset = 0, withDetails = true } = {}) {
  if (isDemoMode()) return null;
  const result = await request(ENDPOINTS.media, { query: { limit, offset } });
  const source = unwrap(result);
  const items = array(first(source.items, source.content, source.results, source.media, Array.isArray(source) ? source : null));
  const movies = withDetails ? await Promise.all(items.map(async movie => {
    const tmdbId = first(movie.tmdbId, movie.tmdb_id, movie.id);
    if (tmdbId === undefined || tmdbId === null) return normalizeMovie(movie);
    try { return normalizeMovie(movie, await getMovieDetails(tmdbId, { raw: true })); }
    catch { return normalizeMovie(movie); }
  })) : items.map(movie => normalizeMovie(movie));
  return { items: movies, total: number(first(source.total, source.totalElements, items.length)), limit, offset };
}
export async function getMovieDetails(tmdbId, { raw = false } = {}) {
  if (isDemoMode()) return null;
  const result = await request(ENDPOINTS.movieDetails(tmdbId));
  return raw ? result : normalizeMovie(result);
}
export async function getReviews({ tmdbId, limit = 20, offset = 0, mine, status } = {}) {
  if (isDemoMode()) return null;
  const result = await request(ENDPOINTS.reviews, { query: { limit, offset, tmdbId, mine, status } });
  const source = unwrap(result);
  const items = array(first(source.items, source.content, source.results, source.reviews, Array.isArray(source) ? source : null));
  return { items: items.map(normalizeReview), total: number(first(source.total, source.totalElements, items.length)), limit, offset };
}
export async function getMyProfile() {
  const result = await request(ENDPOINTS.myProfile);
  return result === null ? null : normalizeProfile(result);
}
export async function getUserProfile(id) {
  const result = await request(ENDPOINTS.userProfile(id));
  return result === null ? null : normalizeProfile(result);
}

const RATING_FIELDS = ['dramaturgy', 'characters', 'visual', 'sound', 'impression'];
function validateRating(rating) {
  const values = object(rating);
  const result = {};
  for (const key of RATING_FIELDS) {
    const value = Number(values[key]);
    if (!Number.isInteger(value) || value < 1 || value > 10) {
      throw new ApiError(`Оценка «${key}» должна быть от 1 до 10.`, { code: 'INVALID_RATING' });
    }
    result[key] = value;
  }
  return result;
}
export async function putRating(tmdbId, rating) {
  if (isDemoMode()) return null;
  return request(ENDPOINTS.rating(tmdbId), {
    method: 'PUT', body: validateRating(rating),
  });
}
export async function submitReview({ tmdbId, rating, title, text: content, spoilers = false, formInstanceId = null }) {
  if (isDemoMode()) return null;
  await putRating(tmdbId, rating);
  const result = await request(ENDPOINTS.reviews, {
    method: 'POST',
    body: { tmdbId, title, text: content, spoilers, ...(formInstanceId ? { form_instance_id: formInstanceId } : {}) },
  });
  return { result, notice: 'Рецензия отправлена на модерацию.' };
}
export const likeReview = id => request(ENDPOINTS.reviewLike(id), { method: 'PUT' });
export const unlikeReview = id => request(ENDPOINTS.reviewLike(id), { method: 'DELETE' });

/** UI сам задаёт мгновенное изменение и откат; запрос выполняется здесь. */
export async function optimisticAction({ apply, rollback, task, notify }) {
  if (typeof apply === 'function') apply();
  try { return await task(); }
  catch (error) {
    if (typeof rollback === 'function') rollback();
    if (typeof notify === 'function') notify(error.message);
    throw error;
  }
}
export function toggleReviewLike(id, liked, ui = {}) {
  if (isDemoMode()) return null;
  return optimisticAction({ ...ui, task: () => liked ? unlikeReview(id) : likeReview(id) });
}

const PREF_TYPES = new Set(['movie', 'director', 'actor']);
function preferenceType(type) {
  if (!PREF_TYPES.has(type)) throw new ApiError('Неизвестная категория предпочтений.', { code: 'INVALID_PREFERENCE_TYPE' });
  return type;
}
export async function addPreference(type, tmdbId, currentIds = null, ui = {}) {
  if (isDemoMode()) return null;
  type = preferenceType(type);
  const profile = currentIds === null ? await getMyProfile() : null;
  const items = currentIds ?? profile?.preferences?.[`${type}s`] ?? [];
  if (items.length >= 5 && !items.some(item => String(item?.tmdbId ?? item?.id ?? item) === String(tmdbId))) {
    throw new ApiError('Можно выбрать не более пяти предпочтений в категории.', { code: 'PREFERENCES_LIMIT' });
  }
  return optimisticAction({ ...ui, task: () => request(ENDPOINTS.preference(type, tmdbId), { method: 'PUT' }) });
}
export function removePreference(type, tmdbId, ui = {}) {
  if (isDemoMode()) return null;
  type = preferenceType(type);
  return optimisticAction({ ...ui, task: () => request(ENDPOINTS.preference(type, tmdbId), { method: 'DELETE' }) });
}

/** Маршрут редактирования профиля в ТЗ не указан: не выдумываем его. */
export async function updateProfile() {
  if (isDemoMode()) return null;
  throw new ApiError('Маршрут изменения профиля ожидает подтверждения бэкенда.', { code: 'WAITING_FOR_BE' });
}
/** Маршруты действий автора не указаны: не делаем фиктивные запросы. */
export const author = {
  login: async () => ({ demo: true, reason: 'Ждёт BE: вход автора' }),
  like: async () => ({ demo: true, reason: 'Ждёт BE: лайк автора' }),
  comment: async () => ({ demo: true, reason: 'Ждёт BE: авторский комментарий' }),
};

export const api = {
  isDemoMode, request, login, register, getMe, restoreSession, logout,
  getMovies, getMovieDetails, getReviews, getMyProfile, getUserProfile,
  putRating, submitReview, likeReview, unlikeReview, toggleReviewLike,
  addPreference, removePreference, updateProfile, author,
  setAuthExpiredHandler, getTokens, clearTokens, optimisticAction,
};
export default api;
