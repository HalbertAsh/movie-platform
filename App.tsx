// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  User,
  X,
  Star,
  Heart,
  ChevronLeft,
  Home,
  LogOut,
  Eye,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const posters = [
  "https://image.tmdb.org/t/p/w500/gFj84LTFk0nx0qkdGXzLMwKh2Hw.jpg",
  "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
  "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg",
  "https://image.tmdb.org/t/p/w500/6EJGnU4o0j2sR7JQZLz2YdZ6o7U.jpg",
  "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
  "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
  "https://image.tmdb.org/t/p/w500/rTh4K5uw9HypmpGslcKd4QfHl93.jpg",
  "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
];

const fallbackMovies = [
  { id: 1, title: "Белый лотос", year: 2024, type: "сериал", genre: "Драма", country: "США", rating: 4.5, poster: posters[0], description: "Сатирическая драма о людях, которые пытаются спрятаться от собственных проблем за роскошью и красивыми видами." },
  { id: 2, title: "Бригада", year: 2019, type: "сериал", genre: "Криминал", country: "Россия", rating: 4.8, poster: posters[1], description: "Криминальная история о дружбе, выборе и цене власти." },
  { id: 3, title: "Звезды в полдень", year: 2023, type: "фильм", genre: "Драма", country: "Франция", rating: 4.2, poster: posters[2], description: "Медленная драматическая история о людях, которые пытаются найти опору в нестабильном мире." },
  { id: 4, title: "Сапожник", year: 2006, type: "фильм", genre: "Комедия", country: "США", rating: 4.1, poster: posters[3], description: "Лёгкая комедия с фантастическим элементом и уютным настроением." },
  { id: 5, title: "Горничная", year: 2025, type: "фильм", genre: "Триллер", country: "США", rating: 4.5, poster: posters[4], description: "Психологический триллер о девушке с прошлым, которая попадает в дом богатой семьи и постепенно раскрывает их тайны." },
  { id: 6, title: "Девушка не лёгкого поведения", year: 2020, type: "фильм", genre: "Комедия", country: "США", rating: 4.0, poster: posters[5], description: "Комедийная история о попытке изменить свою жизнь и не потерять себя." },
  { id: 7, title: "Внутри убийцы", year: 2024, type: "сериал", genre: "Детектив", country: "Россия", rating: 4.4, poster: posters[6], description: "Детективный сериал с мрачной атмосферой и расследованием серии преступлений." },
  { id: 8, title: "Эйфория", year: 2021, type: "сериал", genre: "Драма", country: "США", rating: 4.7, poster: posters[7], description: "Драматический сериал о подростках, отношениях, зависимости и поиске себя." },
  { id: 9, title: "Паразиты", year: 2019, type: "фильм", genre: "Триллер", country: "Корея", rating: 4.9, poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", description: "Социальный триллер о двух семьях из разных миров." },
  { id: 10, title: "Бэтмен", year: 2022, type: "фильм", genre: "Детектив", country: "США", rating: 4.6, poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg", description: "Мрачный детектив о становлении героя и борьбе с преступностью." },
];

const people = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=500&q=80",
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function normalizeMovie(item, index = 0) {
  return {
    id: item.id ?? item.movie_id ?? index + 1,
    title: item.title ?? item.name ?? item.original_title ?? "Без названия",
    year: Number(item.year ?? String(item.release_date ?? item.first_air_date ?? "").slice(0, 4)) || "—",
    type: item.type ?? item.media_type ?? (item.first_air_date ? "сериал" : "фильм"),
    genre: item.genre ?? item.genres?.[0]?.name ?? "Жанр",
    country: item.country ?? item.production_countries?.[0]?.name ?? "—",
    rating: Number((item.rating ?? item.vote_average ?? 0).toFixed ? (item.rating ?? item.vote_average ?? 0).toFixed(1) : item.rating ?? item.vote_average ?? 0),
    poster: item.poster ?? item.poster_url ?? (item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "https://placehold.co/500x750/202020/FFFFFF?text=No+Poster"),
    description: item.description ?? item.overview ?? "Описание пока недоступно.",
  };
}

function BackButton({ onClick, label = "назад" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-6 inline-flex items-center gap-2 rounded-md bg-[#242424] px-3 py-2 text-[13px] text-zinc-300 transition hover:bg-[#303030] hover:text-white"
    >
      <ChevronLeft className="h-4 w-4" />
      {label}
    </button>
  );
}

function Header({ page, setPage, search, setSearch, likedCount, onLogout }) {
  return (
    <header className="mb-7 flex h-10 items-center justify-between">
      <div className="flex items-center gap-12">
        <button type="button" onClick={() => setPage("catalog")} className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[11px] text-black">
          лого
        </button>

        <div className="relative w-[260px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="поиск по каталогу"
            className="h-8 w-full rounded-md border border-[#1e1e1e] bg-[#202020] pl-9 pr-8 text-[12px] text-zinc-200 outline-none placeholder:text-zinc-500"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <nav className="flex gap-11 text-[13px] text-zinc-300">
          <button type="button" onClick={() => setPage("catalog")} className={page === "catalog" ? "text-white" : "hover:text-white"}>каталог</button>
          <button type="button" onClick={() => setPage("favorites")} className={page === "favorites" ? "text-white" : "hover:text-white"}>избранное {likedCount > 0 && <span className="text-violet-400">({likedCount})</span>}</button>
        </nav>
      </div>

      <div className="flex items-center gap-5">
        <button type="button" onClick={() => setPage("profile")} className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-500 text-zinc-300 hover:border-zinc-300 hover:text-white" title="Открыть профиль">
          <User className="h-4 w-4" />
        </button>
        <button type="button" onClick={onLogout} className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 text-zinc-400 hover:border-zinc-300 hover:text-white" title="Выйти">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

function AuthPage({ onEnter }) {
  const [mode, setMode] = useState("login");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!login.trim() || !password.trim()) {
      setError("Введите логин и пароль");
      return;
    }
    if (mode === "register" && password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    setError("");
    onEnter({ login });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 opacity-55">
        <div className="absolute left-[48%] top-[-18%] grid w-[760px] rotate-[18deg] grid-cols-3 gap-4">
          {[...fallbackMovies, ...fallbackMovies].slice(0, 12).map((movie, index) => (
            <img
              key={`${movie.id}-${index}`}
              src={movie.poster}
              alt=""
              className="h-[230px] w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/55" />
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative flex min-h-screen items-center justify-center px-4">
        <form onSubmit={submit} className="relative w-[360px] rounded-3xl bg-[#1b1b1b]/95 px-7 pb-7 pt-12 shadow-2xl">
          <div className="absolute left-1/2 top-0 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[12px] text-black">
            лого
          </div>

          <div className="mb-5 text-center">
            <h1 className="text-xl font-semibold">
              {mode === "login" ? "Войдите с помощью логина" : "Регистрация"}
            </h1>
            <p className="mt-2 text-[12px] leading-5 text-zinc-500">
              Введите логин и пароль, чтобы перейти в каталог фильмов.
            </p>
          </div>

          <label className="mb-3 block">
            <span className="mb-1 block text-[12px] text-zinc-400">Логин</span>
            <input
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="h-10 w-full rounded-md bg-[#303030] px-3 text-[14px] outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Введите логин"
            />
          </label>

          <label className="mb-3 block">
            <span className="mb-1 block text-[12px] text-zinc-400">Пароль</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="h-10 w-full rounded-md bg-[#303030] px-3 text-[14px] outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Введите пароль"
            />
          </label>

          {mode === "register" && (
            <label className="mb-3 block">
              <span className="mb-1 block text-[12px] text-zinc-400">Повторите пароль</span>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                className="h-10 w-full rounded-md bg-[#303030] px-3 text-[14px] outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Повторите пароль"
              />
            </label>
          )}

          {error && <div className="mb-3 rounded-md bg-red-500/15 px-3 py-2 text-[12px] text-red-300">{error}</div>}

          <button type="submit" className="mb-3 h-10 w-full rounded-md bg-[#555] text-[14px] font-medium text-white hover:bg-[#666]">
            {mode === "login" ? "продолжить" : "зарегистрироваться"}
          </button>

          <button
            type="button"
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="h-10 w-full rounded-md bg-[#444] text-[13px] text-zinc-200 hover:bg-[#555]"
          >
            {mode === "login" ? "зарегистрироваться" : "уже есть аккаунт"}
          </button>
        </form>
      </div>
    </div>
  );
}

function RatingBadge({ rating, compact = false }) {
  return (
    <div className={cn("inline-flex items-center gap-1.5 rounded-full bg-black/75 text-white shadow-lg backdrop-blur-sm", compact ? "px-2 py-1" : "px-2.5 py-1.5")} title={`Общая оценка ${rating}`}>
      <span className={cn("relative flex shrink-0 items-center justify-center rounded-full bg-violet-500", compact ? "h-5 w-5" : "h-6 w-6")}>
        <svg viewBox="0 0 24 24" className={cn("text-white", compact ? "h-3.5 w-3.5" : "h-4 w-4")} fill="currentColor" aria-hidden="true">
          <path d="M20.8 3.2C14.4 4.2 8.6 7.7 5.2 13.1c-.7 1.1-1.2 2.2-1.6 3.4l4.7-4.7c1.7-1.7 3.7-3 5.9-3.8-2.6 1.7-4.9 3.8-6.8 6.3l-4.2 5.5c-.3.4-.2 1 .2 1.3.4.3 1 .2 1.3-.2l2.2-2.9c1.2.2 2.5 0 3.6-.5 2.8-1.3 4.6-4 5.8-6.6l1.7-.2-1.1-1.1c1.5-2.1 2.9-4.1 3.9-6.4Z" />
        </svg>
      </span>
      <span className={cn("font-semibold leading-none", compact ? "text-[12px]" : "text-[13px]")}>{rating || "—"}</span>
    </div>
  );
}

function RatingStars({ value, onChange, size = "md" }) {
  const starClass = size === "lg" ? "h-7 w-7" : "h-5 w-5";
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} className="rounded-full p-1 transition hover:bg-white/10" aria-label={`Поставить ${n} звёзд`}>
          <Star className={cn(starClass, n <= value ? "fill-yellow-400 text-yellow-400 stroke-yellow-400" : "fill-transparent text-zinc-500 stroke-zinc-500")} />
        </button>
      ))}
    </div>
  );
}

function MovieCard({ movie, onOpen, liked, onToggleLike }) {
  return (
    <div className="group w-full text-left">
      <button type="button" onClick={() => onOpen(movie)} className="w-full text-left">
        <div className="relative overflow-hidden rounded-[8px] bg-[#202020]">
          <img src={movie.poster} alt={movie.title} className="h-[255px] w-full object-cover transition duration-200 group-hover:scale-[1.02]" />
          <div className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-[10px] text-zinc-200">{movie.type}</div>
          <div className="absolute bottom-2 left-2"><RatingBadge rating={movie.rating} compact /></div>
        </div>
      </button>
      <div className="mt-2 flex items-start justify-between gap-2">
        <div>
          <button type="button" onClick={() => onOpen(movie)} className="text-left text-[13px] leading-4 text-zinc-200 hover:text-white">{movie.title}</button>
          <div className="mt-1 text-[11px] text-zinc-500">{movie.year} • {movie.genre}</div>
        </div>
        <button type="button" onClick={() => onToggleLike(movie.id)} className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition", liked ? "bg-violet-500 text-white" : "bg-[#252525] text-zinc-400 hover:bg-[#333] hover:text-white")} title={liked ? "Убрать из избранного" : "Добавить в избранное"}>
          <Heart className={cn("h-4 w-4", liked && "fill-current")} />
        </button>
      </div>
    </div>
  );
}

function MovieGrid({ items, onOpen, likedIds, onToggleLike }) {
  return (
    <div className="grid grid-cols-5 gap-x-6 gap-y-9">
      {items.map((movie) => <MovieCard key={movie.id} movie={movie} onOpen={onOpen} liked={likedIds.includes(movie.id)} onToggleLike={onToggleLike} />)}
    </div>
  );
}

function CatalogPage({ items, allItems, onOpen, likedIds, onToggleLike, filtersOpen, setFiltersOpen, selectedFilters, setSelectedFilters, resetFilters, loading, error }) {
  const genres = [...new Set(allItems.map((movie) => movie.genre).filter(Boolean))];
  const countries = [...new Set(allItems.map((movie) => movie.country).filter(Boolean))];
  const years = [...new Set(allItems.map((movie) => String(movie.year)).filter(Boolean))].sort((a, b) => Number(b) - Number(a));

  const filterConfig = [
    { label: "Жанр", key: "genre", values: genres },
    { label: "Страна", key: "country", values: countries },
    { label: "Год", key: "year", values: years },
    { label: "Рейтинг", key: "rating", values: ["4+", "4.5+"] },
  ];

  const toggleFilter = (key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: prev[key] === value ? "" : value }));
  };

  return (
    <main>
      <section className="mb-6 rounded-3xl bg-[#141414] p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold">Каталог фильмов</h1>
            <p className="mt-2 max-w-[640px] text-[14px] leading-6 text-zinc-400">
              Главная страница теперь работает как каталог: здесь показываются все фильмы из базы, поиск фильтрует их сразу на этой странице.
            </p>
          </div>
          <button type="button" onClick={() => setFiltersOpen(!filtersOpen)} className="inline-flex items-center gap-2 rounded-md bg-[#242424] px-4 py-2 text-[13px] text-zinc-200 hover:bg-[#303030]">
            <SlidersHorizontal className="h-4 w-4" />
            {filtersOpen ? "Скрыть фильтры" : "Фильтры"}
          </button>
        </div>
      </section>

      {filtersOpen && (
        <section className="mb-6 rounded-xl bg-[#171717] p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-medium">Фильтры по базе</h2>
            <button type="button" onClick={resetFilters} className="text-[12px] text-zinc-400 hover:text-white">сбросить всё</button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {filterConfig.map((group) => (
              <div key={group.key}>
                <div className="mb-2 text-sm text-zinc-500">{group.label}</div>
                <div className="flex flex-wrap gap-2">
                  {group.values.map((value) => {
                    const active = selectedFilters[group.key] === value;
                    return (
                      <button key={value} type="button" onClick={() => toggleFilter(group.key, value)} className={cn("rounded-md px-2.5 py-1 text-sm transition", active ? "bg-[#376da8] text-white" : "bg-[#2d2d2d] text-zinc-300 hover:bg-[#3a3a3a]")}>{value}</button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-medium">Все фильмы</h2>
        <span className="rounded-md bg-[#242424] px-3 py-2 text-[12px] text-zinc-400">{items.length} найдено</span>
      </div>

      {loading && <div className="rounded-2xl bg-[#171717] p-10 text-center text-zinc-400">Загрузка фильмов из базы...</div>}
      {!loading && error && <div className="mb-5 rounded-2xl bg-red-500/10 p-4 text-[13px] text-red-300">{error}. Показаны локальные данные.</div>}
      {!loading && items.length > 0 && <MovieGrid items={items} onOpen={onOpen} likedIds={likedIds} onToggleLike={onToggleLike} />}
      {!loading && !items.length && <div className="rounded-2xl bg-[#171717] p-10 text-center text-zinc-400">Ничего не найдено. Попробуйте изменить поиск или фильтры.</div>}
    </main>
  );
}

function FavoritesPage({ likedIds, items, onOpen, onToggleLike, setPage }) {
  const likedMovies = items.filter((movie) => likedIds.includes(movie.id));
  return (
    <main>
      <BackButton onClick={() => setPage("catalog")} />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium">Избранное</h1>
          <p className="mt-2 text-[13px] text-zinc-400">Здесь сохраняются фильмы, на которые вы нажали лайк.</p>
        </div>
        {likedMovies.length > 0 && <span className="rounded-md bg-[#242424] px-3 py-2 text-[13px] text-zinc-300">{likedMovies.length} выбрано</span>}
      </div>
      {likedMovies.length ? <MovieGrid items={likedMovies} onOpen={onOpen} likedIds={likedIds} onToggleLike={onToggleLike} /> : <div className="rounded-2xl bg-[#171717] p-12 text-center text-zinc-400">Вы пока ничего не добавили в избранное.</div>}
    </main>
  );
}

function ProfileReviewCard({ movie, text, date, userRating, onOpen }) {
  return (
    <button type="button" onClick={() => onOpen(movie)} className="grid w-full grid-cols-[86px_1fr] gap-4 rounded-2xl bg-[#171717] p-4 text-left transition hover:bg-[#1f1f1f]">
      <img src={movie.poster} alt={movie.title} className="h-[120px] w-[86px] rounded-lg object-cover" />
      <div>
        <div className="mb-2 flex items-start justify-between gap-4">
          <div><h3 className="text-[15px] font-medium text-zinc-100">{movie.title}</h3><p className="mt-1 text-[12px] text-zinc-500">{movie.year} • {movie.genre}</p></div>
          <div className="shrink-0 rounded-full bg-[#242424] px-3 py-1 text-[12px] text-violet-300">оценка {userRating}</div>
        </div>
        <p className="text-[13px] leading-5 text-zinc-300">{text}</p>
        <div className="mt-3 flex items-center justify-between text-[12px] text-zinc-500"><span>{date}</span><span>рецензия</span></div>
      </div>
    </button>
  );
}

function ProfilePage({ setPage, likedIds, onOpen, items }) {
  const profileReviews = [
    { movie: items[4] || fallbackMovies[4], userRating: "4.5", date: "15.03.2025", text: "Фильм получился напряжённым и атмосферным. История держится на главной героине и её прошлом, а финал оставляет приятное ощущение завершённости." },
    { movie: items[0] || fallbackMovies[0], userRating: "4.8", date: "02.04.2025", text: "Очень стильный сериал с красивой картинкой и живыми персонажами. Особенно понравилось, как постепенно раскрываются конфликты между героями." },
    { movie: items[2] || fallbackMovies[2], userRating: "4.2", date: "18.04.2025", text: "Не самый простой фильм, но в нём есть настроение. Хорошая визуальная часть, спокойный темп и интересная драматическая линия." },
  ];

  return (
    <main>
      <BackButton onClick={() => setPage("catalog")} />
      <section className="grid grid-cols-[260px_1fr] items-start gap-8">
        <aside className="rounded-2xl bg-[#171717] p-5">
          <div className="mb-5 flex flex-col items-center"><div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-[#2a2a2a] text-zinc-300"><User className="h-8 w-8" /></div><div className="text-lg font-medium">мой профиль</div><div className="mt-1 text-[12px] text-zinc-500">@nickname</div></div>
          <div className="inline-flex w-fit max-w-[220px] rounded-xl bg-[#242424] p-4 text-[13px] leading-5 text-zinc-300">Здесь будет описание пользователя, любимые жанры и краткая информация о профиле.</div>
        </aside>
        <section>
          <h1 className="mb-5 text-2xl font-semibold">Профиль</h1>
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-[#171717] p-4"><div className="text-[12px] text-zinc-500">Избранное</div><div className="mt-2 text-2xl font-semibold">{likedIds.length}</div></div>
            <div className="rounded-xl bg-[#171717] p-4"><div className="text-[12px] text-zinc-500">Рецензии</div><div className="mt-2 text-2xl font-semibold">{profileReviews.length}</div></div>
            <div className="rounded-xl bg-[#171717] p-4"><div className="text-[12px] text-zinc-500">Все оценки</div><div className="mt-2 text-2xl font-semibold">27</div></div>
          </div>
          <section>
            <div className="mb-4 flex items-center justify-between"><div><h2 className="text-xl font-medium">Мои рецензии</h2><p className="mt-1 text-[13px] text-zinc-500">Все рецензии, которые вы оставили к фильмам и сериалам.</p></div><span className="rounded-md bg-[#242424] px-3 py-2 text-[12px] text-zinc-400">{profileReviews.length} рецензии</span></div>
            <div className="space-y-4">{profileReviews.map((review) => <ProfileReviewCard key={`${review.movie.id}-${review.date}`} movie={review.movie} text={review.text} date={review.date} userRating={review.userRating} onOpen={onOpen} />)}</div>
          </section>
        </section>
      </section>
    </main>
  );
}

function DetailStat({ label, value }) {
  return <div className="grid grid-cols-[150px_1fr] gap-4 text-[13px] leading-6"><span className="text-zinc-500">{label}</span><span className="text-zinc-200">{value}</span></div>;
}

function MovieDetailPage({ movie, onBack, liked, onToggleLike }) {
  const selected = movie || fallbackMovies[4];
  const [quickRating, setQuickRating] = useState(0);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    setQuickRating(0);
    setReviewRating(0);
    setReviewText("");
  }, [selected.id]);

  return (
    <main>
      <BackButton onClick={onBack} />
      <section className="mb-8 grid grid-cols-[360px_1fr] gap-10">
        <div className="relative">
          <img src={selected.poster} alt={selected.title} className="h-[520px] w-full rounded-[8px] object-cover" />
          <button type="button" onClick={() => onToggleLike(selected.id)} className={cn("absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full text-black transition", liked ? "bg-violet-500 text-white" : "bg-white/80 hover:bg-white")}><Heart className={cn("h-5 w-5", liked && "fill-current")} /></button>
        </div>
        <div className="pt-3">
          <div className="mb-3 flex items-center gap-2 text-[12px] text-zinc-500"><Home className="h-3.5 w-3.5" /> Каталог / Фильм</div>
          <h1 className="mb-2 text-3xl font-semibold">{selected.title}</h1>
          <div className="mb-4 flex items-center gap-4"><RatingBadge rating={selected.rating} /><span className="text-[13px] text-zinc-400">{selected.year}</span></div>
          <div className="mb-6 text-[13px] text-zinc-400">Описание</div>
          <p className="mb-5 max-w-[680px] text-[14px] leading-6 text-zinc-300">{selected.description}</p>
          <div className="mb-5 grid max-w-[620px] gap-1"><DetailStat label="Страна" value={selected.country} /><DetailStat label="Жанр" value={selected.genre} /><DetailStat label="Тип" value={selected.type} /><DetailStat label="Год" value={selected.year} /></div>
          <div className="mb-5 grid grid-cols-3 gap-3 max-w-[620px]">{[["Общая оценка", String(selected.rating)], ["Оценок без рецензий", "18"], ["Оценок с рецензиями", "13"]].map(([label, value]) => <div key={label} className="rounded-lg bg-[#262626] px-4 py-3 text-center"><div className="text-[11px] text-zinc-400">{label}</div><div className="mt-1 text-[13px] text-white">{value}</div></div>)}</div>
          <div className="flex gap-3">
            <button type="button" onClick={() => onToggleLike(selected.id)} className="rounded-md bg-violet-600 px-5 py-2 text-[13px] text-white hover:bg-violet-500">{liked ? "Убрать из избранного" : "Добавить в избранное"}</button>
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-[20px] bg-[#202020] p-6">
        <div className="mb-4 flex gap-2">{["в главных ролях", "режиссер", "оператор", "продюсер", "сценарист", "композитор"].map((t) => <span key={t} className="rounded bg-[#4d4d4d] px-3 py-1.5 text-[11px] text-zinc-200">{t}</span>)}</div>
        <div className="grid grid-cols-6 gap-6">{people.map((src, i) => <div key={i} className="text-center"><img src={src} alt="actor" className="mx-auto h-24 w-24 rounded-full object-cover" /><div className="mt-3 text-[12px] text-zinc-300">имя<br />фамилия</div></div>)}</div>
      </section>

      <section className="mb-8 grid grid-cols-[300px_1fr] gap-6">
        <div className="rounded-[20px] bg-[#202020] p-6">
          <h2 className="mb-2 text-lg">Оценка без рецензии</h2>
          <p className="mb-4 text-[13px] leading-5 text-zinc-500">Можно просто поставить оценку фильму, не заполняя текст рецензии.</p>
          <RatingStars value={quickRating} onChange={setQuickRating} size="lg" />
          <button type="button" disabled={!quickRating} className="mt-5 rounded-md bg-violet-600 px-5 py-2 text-[13px] text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40">Сохранить оценку</button>
        </div>

        <div className="rounded-[20px] bg-[#202020] p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div><h2 className="text-lg">Рецензия</h2><p className="mt-1 text-[13px] text-zinc-500">Оценка здесь относится именно к вашей рецензии.</p></div>
            <RatingStars value={reviewRating} onChange={setReviewRating} />
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value.slice(0, 600))}
            placeholder="Поле для написания рецензии"
            rows={5}
            className="mb-2 max-h-[170px] min-h-[120px] w-full resize-none rounded-lg bg-[#4c4c4c] p-4 text-[13px] text-zinc-200 outline-none placeholder:text-zinc-300"
          />
          <div className="mb-4 text-right text-[11px] text-zinc-500">{reviewText.length}/600</div>
          <div className="flex justify-end"><button type="button" disabled={!reviewRating || !reviewText.trim()} className="rounded-md bg-violet-600 px-8 py-2 text-[13px] text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40">Отправить</button></div>
        </div>
      </section>

      <h2 className="mb-5 text-lg">Написано 13 рецензий</h2>
      <section className="rounded-[20px] bg-[#202020] p-6"><div className="mb-4 flex items-center gap-3"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black">***</div><span className="text-[13px]">Никнейм</span></div><div className="rounded-lg bg-[#4c4c4c] p-4 text-[13px] leading-6 text-zinc-200">Лёгкая, но приятная рецензия. История выглядит цельно, персонажи раскрываются постепенно, а финал оставляет после себя ощущение завершённости. Вердикт: хороший жанровый аттракцион, который приятно посмотреть вечером.</div><div className="mt-4 flex justify-end gap-5 text-[12px] text-zinc-400"><span>15.03.2025</span><span>оценка 4.5</span><Heart className="h-4 w-4" /></div></section>
    </main>
  );
}

export default function MoviePlatformUI({ forceAuth = false }) {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("catalog");
  const [previousPage, setPreviousPage] = useState("catalog");
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({ genre: "", country: "", year: "", rating: "" });
  const [selectedMovie, setSelectedMovie] = useState(fallbackMovies[4]);
  const [likedIds, setLikedIds] = useState([5]);
  const [moviesFromDb, setMoviesFromDb] = useState(fallbackMovies);
  const [loading, setLoading] = useState(false);
  const [dbError, setDbError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  

  useEffect(() => {
    async function loadMoviesFromDb() {
      if (!API_BASE_URL) return;
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/movies`);
        if (!response.ok) throw new Error("Ошибка базы");
        const data = await response.json();
        const list = Array.isArray(data) ? data : data.movies || data.results || [];
        setMoviesFromDb(list.map(normalizeMovie));
      } catch (error) {
        setDbError("Не удалось загрузить фильмы из базы");
        setMoviesFromDb(fallbackMovies);
      } finally {
        setLoading(false);
      }
    }
    loadMoviesFromDb();
  }, []);

  const catalogMovies = useMemo(() => {
    const q = search.toLowerCase().trim();
    return moviesFromDb.filter((movie) => {
      if (q && !`${movie.title} ${movie.genre} ${movie.country} ${movie.year}`.toLowerCase().includes(q)) return false;
      if (selectedFilters.genre && movie.genre !== selectedFilters.genre) return false;
      if (selectedFilters.country && movie.country !== selectedFilters.country) return false;
      if (selectedFilters.year && String(movie.year) !== selectedFilters.year) return false;
      if (selectedFilters.rating === "4+" && movie.rating < 4) return false;
      if (selectedFilters.rating === "4.5+" && movie.rating < 4.5) return false;
      return true;
    });
  }, [moviesFromDb, search, selectedFilters]);

  const toggleLike = (id) => {
    setLikedIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };

  const resetFilters = () => {
    setSelectedFilters({ genre: "", country: "", year: "", rating: "" });
  };

  const openMovie = (movie) => {
    setPreviousPage(page);
    setSelectedMovie(movie);
    setPage("movie");
  };

  const goBackFromMovie = () => {
    setPage(previousPage || "catalog");
  };

  const handleLogout = () => {
    setIsAuth(false);
    setUser(null);
    setPage("catalog");
  };

  if (!isAuth) {
    return <AuthPage onEnter={(nextUser) => { setUser(nextUser); setIsAuth(true); setPage("catalog"); }} />;
  }

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <div className="mx-auto max-w-[1180px] px-8 py-7">
        <Header page={page} setPage={setPage} search={search} setSearch={setSearch} likedCount={likedIds.length} onLogout={handleLogout} />
        {page === "catalog" && <CatalogPage items={catalogMovies} allItems={moviesFromDb} onOpen={openMovie} likedIds={likedIds} onToggleLike={toggleLike} filtersOpen={filtersOpen} setFiltersOpen={setFiltersOpen} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} resetFilters={resetFilters} loading={loading} error={dbError} />}
        {page === "favorites" && <FavoritesPage likedIds={likedIds} items={moviesFromDb} onOpen={openMovie} onToggleLike={toggleLike} setPage={setPage} />}
        {page === "profile" && <ProfilePage setPage={setPage} likedIds={likedIds} onOpen={openMovie} items={moviesFromDb} />}
        {page === "movie" && <MovieDetailPage movie={selectedMovie} onBack={goBackFromMovie} liked={likedIds.includes(selectedMovie.id)} onToggleLike={toggleLike} />}
      </div>
    </div>
  );
}
