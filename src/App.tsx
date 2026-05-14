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
} from "lucide-react";

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

const movies = [
  { id: 1, title: "Белый лотос", year: 2024, type: "новый сериал", genre: "Драма", country: "США", rating: 4.5, poster: posters[0] },
  { id: 2, title: "Бригада", year: 2019, type: "сериал", genre: "Криминал", country: "Россия", rating: 4.8, poster: posters[1] },
  { id: 3, title: "Звезды в полдень", year: 2023, type: "фильм", genre: "Драма", country: "Франция", rating: 4.2, poster: posters[2] },
  { id: 4, title: "Сапожник", year: 2006, type: "фильм", genre: "Комедия", country: "США", rating: 4.1, poster: posters[3] },
  { id: 5, title: "Горничная", year: 2025, type: "фильм", genre: "Триллер", country: "США", rating: 4.5, poster: posters[4] },
  { id: 6, title: "Девушка не лёгкого поведения", year: 2020, type: "фильм", genre: "Комедия", country: "США", rating: 4.0, poster: posters[5] },
  { id: 7, title: "Внутри убийцы", year: 2024, type: "сериал", genre: "Детектив", country: "Россия", rating: 4.4, poster: posters[6] },
  { id: 8, title: "Эйфория", year: 2021, type: "сериал", genre: "Драма", country: "США", rating: 4.7, poster: posters[7] },
];

const heroSlides = [
  { id: 101, title: "Чёрная граница", poster: "https://image.tmdb.org/t/p/w780/9zcbqSxdsRMZWHYtyCd1nXPr2xq.jpg", tag: "новый сериал" },
  { id: 102, title: "Центурия", poster: "https://image.tmdb.org/t/p/w500/7gKI9hpEMcZUQpNgKrkDzJpbnNS.jpg", tag: "новый фильм" },
  { id: 103, title: "Остров", poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg", tag: "новинка" },
];

const people = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=500&q=80",
];

const filterGroups = [
  { label: "Жанры", key: "genre", values: ["Комедия", "Драма", "Триллер", "Криминал"] },
  { label: "Страны", key: "country", values: ["Россия", "США", "Франция"] },
  { label: "Год выхода", key: "year", values: ["2025", "2024", "2023", "2021", "2019"] },
  { label: "Рейтинг", key: "rating", values: ["4+", "4.5+"] },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function BackButton({ onClick, label = "назад" }) {
  return (
    <button
      onClick={onClick}
      className="mb-6 inline-flex items-center gap-2 rounded-md bg-[#242424] px-3 py-2 text-[13px] text-zinc-300 transition hover:bg-[#303030] hover:text-white"
    >
      <ChevronLeft className="h-4 w-4" />
      {label}
    </button>
  );
}

function Header({ page, setPage, search, setSearch, likedCount }) {
  return (
    <header className="mb-7 flex h-10 items-center justify-between">
      <div className="flex items-center gap-12">
        <button onClick={() => setPage("home")} className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[11px] text-black">
          лого
        </button>
        <div className="relative w-[230px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onFocus={() => setPage("search")}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage("search");
            }}
            placeholder="поиск фильма или сериала"
            className="h-8 w-full rounded-md border border-[#1e1e1e] bg-[#202020] pl-9 pr-8 text-[12px] text-zinc-200 outline-none placeholder:text-zinc-500"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <nav className="flex gap-11 text-[13px] text-zinc-300">
          <button onClick={() => setPage("home")} className={page === "home" ? "text-white" : "hover:text-white"}>главная</button>
          <button onClick={() => setPage("filters")} className={page.includes("filter") ? "text-white" : "hover:text-white"}>фильмы</button>
          <button onClick={() => setPage("series")} className={page === "series" ? "text-white" : "hover:text-white"}>сериалы</button>
          <button onClick={() => setPage("favorites")} className={page === "favorites" ? "text-white" : "hover:text-white"}>избранное {likedCount > 0 && <span className="text-violet-400">({likedCount})</span>}</button>
        </nav>
      </div>
      <div className="flex items-center gap-5">
        <button onClick={() => setPage("filters")} className="text-zinc-300 hover:text-white" title="Открыть фильтры"><SlidersHorizontal className="h-5 w-5" /></button>
        <button onClick={() => setPage("profile")} className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-500 text-zinc-300 hover:border-zinc-300 hover:text-white" title="Открыть профиль"><User className="h-4 w-4" /></button>
      </div>
    </header>
  );
}

function RatingBadge({ rating, compact = false }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-black/75 text-white shadow-lg backdrop-blur-sm",
        compact ? "px-2 py-1" : "px-2.5 py-1.5"
      )}
      title={`Общая оценка ${rating}`}
    >
      <span className={cn("relative flex shrink-0 items-center justify-center rounded-full bg-violet-500", compact ? "h-5 w-5" : "h-6 w-6")}>
        <svg viewBox="0 0 24 24" className={cn("text-white", compact ? "h-3.5 w-3.5" : "h-4 w-4")} fill="currentColor" aria-hidden="true">
          <path d="M20.8 3.2C14.4 4.2 8.6 7.7 5.2 13.1c-.7 1.1-1.2 2.2-1.6 3.4l4.7-4.7c1.7-1.7 3.7-3 5.9-3.8-2.6 1.7-4.9 3.8-6.8 6.3l-4.2 5.5c-.3.4-.2 1 .2 1.3.4.3 1 .2 1.3-.2l2.2-2.9c1.2.2 2.5 0 3.6-.5 2.8-1.3 4.6-4 5.8-6.6l1.7-.2-1.1-1.1c1.5-2.1 2.9-4.1 3.9-6.4Z" />
        </svg>
      </span>
      <span className={cn("font-semibold leading-none", compact ? "text-[12px]" : "text-[13px]")}>{rating}</span>
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
          <div className="absolute bottom-2 left-2">
            <RatingBadge rating={movie.rating} compact />
          </div>
        </div>
      </button>
      <div className="mt-2 flex items-start justify-between gap-2">
        <div>
          <button onClick={() => onOpen(movie)} className="text-left text-[13px] leading-4 text-zinc-200 hover:text-white">{movie.title}</button>
          <div className="mt-1 text-[11px] text-zinc-500">{movie.year} • {movie.genre}</div>
        </div>
        <button
          onClick={() => onToggleLike(movie.id)}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition",
            liked ? "bg-violet-500 text-white" : "bg-[#252525] text-zinc-400 hover:bg-[#333] hover:text-white"
          )}
          title={liked ? "Убрать из избранного" : "Добавить в избранное"}
        >
          <Heart className={cn("h-4 w-4", liked && "fill-current")} />
        </button>
      </div>
    </div>
  );
}

function MovieGrid({ items, onOpen, likedIds, onToggleLike }) {
  return (
    <div className="grid grid-cols-5 gap-x-6 gap-y-9">
      {items.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onOpen={onOpen} liked={likedIds.includes(movie.id)} onToggleLike={onToggleLike} />
      ))}
    </div>
  );
}

function FilterPanel({ selectedFilters, setSelectedFilters, onApply, onReset }) {
  const toggleFilter = (key, value) => {
    setSelectedFilters((prev) => {
      const exists = prev[key] === value;
      return exists ? { ...prev, [key]: "" } : { ...prev, [key]: value };
    });
  };

  return (
    <div className="mb-6 rounded-xl bg-[#171717] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-medium">Фильтры</h2>
        <button onClick={onReset} className="text-sm text-zinc-400 hover:text-white">сбросить всё</button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {filterGroups.map((group) => (
          <div key={group.key}>
            <div className="mb-2 text-sm text-zinc-500">{group.label}</div>
            <div className="flex flex-wrap gap-2">
              {group.values.map((value) => {
                const active = selectedFilters[group.key] === value;
                return (
                  <button
                    key={value}
                    onClick={() => toggleFilter(group.key, value)}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-sm transition",
                      active ? "bg-[#376da8] text-white" : "bg-[#2d2d2d] text-zinc-300 hover:bg-[#3a3a3a]"
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-end">
        <button onClick={onApply} className="rounded-md bg-violet-600 px-5 py-1.5 text-[12px] text-white hover:bg-violet-500">Показать результаты</button>
      </div>
    </div>
  );
}

function SelectedTags({ selectedFilters, onRemove, onReset }) {
  const tags = Object.entries(selectedFilters).filter(([, value]) => value);
  if (!tags.length) return null;
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {tags.map(([key, value]) => (
        <button key={key} onClick={() => onRemove(key)} className="rounded-md bg-[#315b84] px-3 py-1.5 text-[12px] text-white">
          {value} <span className="ml-1 text-zinc-200">×</span>
        </button>
      ))}
      <button onClick={onReset} className="text-[12px] text-zinc-400 hover:text-white">сбросить всё</button>
    </div>
  );
}

function getFilteredMovies(selectedFilters) {
  return movies.filter((movie) => {
    if (selectedFilters.genre && movie.genre !== selectedFilters.genre) return false;
    if (selectedFilters.country && movie.country !== selectedFilters.country) return false;
    if (selectedFilters.year && String(movie.year) !== selectedFilters.year) return false;
    if (selectedFilters.rating === "4+" && movie.rating < 4) return false;
    if (selectedFilters.rating === "4.5+" && movie.rating < 4.5) return false;
    return true;
  });
}

function HomePage({ onOpen, setPage, likedIds, onToggleLike }) {
  return (
    <main>
      <section className="mb-8 grid grid-cols-[220px_1fr_220px] gap-6">
        <button onClick={() => onOpen(movies[2])} className="overflow-hidden rounded-[4px]"><img src={heroSlides[2].poster} alt="poster" className="h-[255px] w-full object-cover" /></button>
        <button onClick={() => onOpen(movies[4])} className="relative overflow-hidden rounded-[4px] bg-[#151515] text-left">
          <img src={heroSlides[0].poster} alt="hero" className="h-[255px] w-full object-cover opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-black/30" />
          <div className="absolute left-9 top-7 rounded bg-violet-500 px-3 py-1 text-[11px] text-white">новый сериал</div>
          <div className="absolute bottom-10 left-9">
            <h1 className="mb-1 text-2xl font-semibold uppercase tracking-wide">Чёрная<br />граница</h1>
            <p className="text-[12px] text-zinc-300">Триллер по подписке</p>
          </div>
        </button>
        <button onClick={() => onOpen(movies[0])} className="relative overflow-hidden rounded-[4px]"><img src={heroSlides[1].poster} alt="poster" className="h-[255px] w-full object-cover" /><div className="absolute bottom-7 left-6 text-xl font-semibold uppercase">Центурия</div></button>
      </section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-medium">Популярно сейчас</h2>
        <button onClick={() => setPage("filters")} className="rounded-md bg-[#242424] px-4 py-2 text-[13px] text-zinc-300 hover:bg-[#303030] hover:text-white">Открыть фильтры</button>
      </div>
      <MovieGrid items={[...movies, ...movies.slice(0, 4)]} onOpen={onOpen} likedIds={likedIds} onToggleLike={onToggleLike} />
    </main>
  );
}

function FiltersPage({ onOpen, setPage, selectedFilters, setSelectedFilters, likedIds, onToggleLike, resetFilters }) {
  return (
    <main>
      <BackButton onClick={() => setPage("home")} />
      <FilterPanel
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        onApply={() => setPage("filters-selected")}
        onReset={resetFilters}
      />
      <h1 className="mb-5 text-xl font-medium">Все фильмы</h1>
      <MovieGrid items={movies} onOpen={onOpen} likedIds={likedIds} onToggleLike={onToggleLike} />
    </main>
  );
}

function FiltersSelectedPage({ onOpen, setPage, selectedFilters, setSelectedFilters, likedIds, onToggleLike, resetFilters }) {
  const filtered = getFilteredMovies(selectedFilters);
  const removeFilter = (key) => setSelectedFilters((prev) => ({ ...prev, [key]: "" }));
  return (
    <main>
      <BackButton onClick={() => setPage("filters")} label="изменить фильтры" />
      <h1 className="mb-4 text-xl font-medium">Результаты фильтрации</h1>
      <SelectedTags selectedFilters={selectedFilters} onRemove={removeFilter} onReset={resetFilters} />
      {filtered.length ? (
        <MovieGrid items={filtered} onOpen={onOpen} likedIds={likedIds} onToggleLike={onToggleLike} />
      ) : (
        <div className="rounded-2xl bg-[#171717] p-10 text-center text-zinc-400">
          Ничего не найдено. Попробуйте убрать часть фильтров.
        </div>
      )}
    </main>
  );
}

function SearchPage({ search, setSearch, onOpen, setPage, likedIds, onToggleLike }) {
  const results = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return [movies[4], movies[5], movies[6], movies[7], movies[0]];
    return movies.filter((movie) => movie.title.toLowerCase().includes(q) || movie.genre.toLowerCase().includes(q));
  }, [search]);

  return (
    <main className="min-h-[70vh]">
      <BackButton onClick={() => { setSearch(""); setPage("home"); }} />
      <div className="mb-8 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} autoFocus placeholder="поиск фильма, сериала или жанра" className="h-10 w-full rounded-md bg-[#202020] pl-10 pr-10 text-[13px] text-zinc-200 outline-none" />
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"><X className="h-4 w-4" /></button>
        </div>
      </div>
      <h1 className="mb-6 text-xl font-medium">{search ? "Результаты поиска" : "Сейчас ищут"}</h1>
      {results.length ? (
        <div className="mb-8 grid grid-cols-5 gap-6">
          {results.map((movie) => <MovieCard key={movie.id} movie={movie} onOpen={onOpen} liked={likedIds.includes(movie.id)} onToggleLike={onToggleLike} />)}
        </div>
      ) : (
        <div className="rounded-2xl bg-[#171717] p-10 text-center text-zinc-400">По вашему запросу ничего не найдено.</div>
      )}
      <h2 className="mb-4 text-lg font-medium">Популярные актёры</h2>
      <div className="grid grid-cols-6 gap-5">
        {people.map((src, index) => <img key={index} src={src} alt="person" className="h-[120px] w-full rounded-t-full object-cover" />)}
      </div>
    </main>
  );
}

function FavoritesPage({ likedIds, onOpen, onToggleLike, setPage }) {
  const likedMovies = movies.filter((movie) => likedIds.includes(movie.id));
  return (
    <main>
      <BackButton onClick={() => setPage("home")} />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium">Избранное</h1>
          <p className="mt-2 text-[13px] text-zinc-400">Здесь сохраняются фильмы, на которые вы нажали лайк.</p>
        </div>
        {likedMovies.length > 0 && <span className="rounded-md bg-[#242424] px-3 py-2 text-[13px] text-zinc-300">{likedMovies.length} выбрано</span>}
      </div>
      {likedMovies.length ? (
        <MovieGrid items={likedMovies} onOpen={onOpen} likedIds={likedIds} onToggleLike={onToggleLike} />
      ) : (
        <div className="rounded-2xl bg-[#171717] p-12 text-center text-zinc-400">
          Вы пока ничего не добавили в избранное. Нажмите сердечко на карточке фильма.
        </div>
      )}
    </main>
  );
}

function ProfileReviewCard({ movie, text, date, userRating, onOpen }) {
  const handleClick = () => {
    if (typeof onOpen === "function") {
      onOpen(movie);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="grid w-full grid-cols-[86px_1fr] gap-4 rounded-2xl bg-[#171717] p-4 text-left transition hover:bg-[#1f1f1f] cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500"
    >
      <img
        src={movie.poster}
        alt={movie.title}
        className="h-[120px] w-[86px] rounded-lg object-cover"
      />

      <div>
        <div className="mb-2 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[15px] font-medium text-zinc-100">
              {movie.title}
            </h3>
            <p className="mt-1 text-[12px] text-zinc-500">
              {movie.year} • {movie.genre}
            </p>
          </div>

          <div className="shrink-0 rounded-full bg-[#242424] px-3 py-1 text-[12px] text-violet-300">
            оценка {userRating}
          </div>
        </div>

        <p className="text-[13px] leading-5 text-zinc-300">
          {text}
        </p>

        <div className="mt-3 flex items-center justify-between text-[12px] text-zinc-500">
          <span>{date}</span>
          <span>рецензия</span>
        </div>
      </div>
    </button>
  );
}

function ProfilePage({ setPage, likedIds, onOpen }) {
  const profileReviews = [
    {
      movie: movies[4],
      userRating: "4.5",
      date: "15.03.2025",
      text: "Фильм получился напряжённым и атмосферным. История держится на главной героине и её прошлом, а финал оставляет приятное ощущение завершённости.",
    },
    {
      movie: movies[0],
      userRating: "4.8",
      date: "02.04.2025",
      text: "Очень стильный сериал с красивой картинкой и живыми персонажами. Особенно понравилось, как постепенно раскрываются конфликты между героями.",
    },
    {
      movie: movies[2],
      userRating: "4.2",
      date: "18.04.2025",
      text: "Не самый простой фильм, но в нём есть настроение. Хорошая визуальная часть, спокойный темп и интересная драматическая линия.",
    },
  ];

  return (
    <main>
      <BackButton onClick={() => setPage("home")} />

      <section className="grid grid-cols-[260px_1fr] gap-8">
        <aside className="rounded-2xl bg-[#171717] p-5">
          <div className="mb-5 flex flex-col items-center">
            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-[#2a2a2a] text-zinc-300">
              <User className="h-8 w-8" />
            </div>

            <div className="text-lg font-medium">мой профиль</div>
            <div className="mt-1 text-[12px] text-zinc-500">@nickname</div>
          </div>

          <div className="rounded-xl bg-[#242424] p-4 text-[13px] leading-5 text-zinc-300">
            Здесь будет описание пользователя, любимые жанры и краткая информация о профиле.
          </div>
        </aside>

        <section>
          <h1 className="mb-5 text-2xl font-semibold">Профиль</h1>

          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-[#171717] p-4">
              <div className="text-[12px] text-zinc-500">Избранное</div>
              <div className="mt-2 text-2xl font-semibold">{likedIds.length}</div>
            </div>

            <div className="rounded-xl bg-[#171717] p-4">
              <div className="text-[12px] text-zinc-500">Рецензии</div>
              <div className="mt-2 text-2xl font-semibold">{profileReviews.length}</div>
            </div>

            <div className="rounded-xl bg-[#171717] p-4">
              <div className="text-[12px] text-zinc-500">Все оценки</div>
              <div className="mt-2 text-2xl font-semibold">27</div>
            </div>
          </div>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-medium">Мои рецензии</h2>
                <p className="mt-1 text-[13px] text-zinc-500">
                  Все рецензии, которые вы оставили к фильмам и сериалам.
                </p>
              </div>

              <span className="rounded-md bg-[#242424] px-3 py-2 text-[12px] text-zinc-400">
                {profileReviews.length} рецензии
              </span>
            </div>

            <div className="space-y-4">
              {profileReviews.map((review) => (
                <ProfileReviewCard
                  key={`${review.movie.id}-${review.date}`}
                  movie={review.movie}
                  text={review.text}
                  date={review.date}
                  userRating={review.userRating}
                  onOpen={onOpen}
                />
              ))}
            </div>
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
  const selected = movie || movies[4];
  const [reviewRating, setReviewRating] = useState(Math.round(selected.rating));

  useEffect(() => {
    setReviewRating(Math.round(selected.rating));
  }, [selected.id, selected.rating]);

  return (
    <main>
      <BackButton onClick={onBack} />
      <section className="mb-8 grid grid-cols-[360px_1fr] gap-10">
        <div className="relative">
          <img src={selected.poster} alt={selected.title} className="h-[520px] w-full rounded-[8px] object-cover" />
          <button
            onClick={() => onToggleLike(selected.id)}
            className={cn(
              "absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full text-black transition",
              liked ? "bg-violet-500 text-white" : "bg-white/80 hover:bg-white"
            )}
          >
            <Heart className={cn("h-5 w-5", liked && "fill-current")} />
          </button>
        </div>
        <div className="pt-3">
          <div className="mb-3 flex items-center gap-2 text-[12px] text-zinc-500"><Home className="h-3.5 w-3.5" /> Главная / Фильм</div>
          <h1 className="mb-2 text-3xl font-semibold">{selected.title}</h1>
          <div className="mb-4 flex items-center gap-4"><RatingBadge rating={selected.rating} /><span className="text-[13px] text-zinc-400">{selected.year}</span></div>
          <div className="mb-6 text-[13px] text-zinc-400">Описание</div>
          <p className="mb-5 max-w-[680px] text-[14px] leading-6 text-zinc-300">
            Лёгкая история, которая пытается совместить тонкую драму, сатиру и напряжение. Сюжет держится на главной героине, её прошлом и странных отношениях с людьми вокруг. Фильм постепенно раскрывает конфликт и оставляет ощущение тревоги даже после финала.
          </p>
          <div className="mb-5 grid max-w-[620px] gap-1">
            <DetailStat label="Страна" value={selected.country} />
            <DetailStat label="Жанр" value={selected.genre} />
            <DetailStat label="Оригинальное название" value="The Housemaid" />
            <DetailStat label="Премьера в России" value="1 декабря 2025 г." />
            <DetailStat label="Длительность" value="2 ч 5 мин" />
          </div>
          <div className="mb-5 grid grid-cols-3 gap-3 max-w-[620px]">
            {[
              ["Средняя оценка", String(selected.rating)],
              ["Средняя оценка без рецензий", "4.5"],
              ["Средняя оценка по рецензиям", "4.5"],
            ].map(([label, value]) => <div key={label} className="rounded-lg bg-[#262626] px-4 py-3 text-center"><div className="text-[11px] text-zinc-400">{label}</div><div className="mt-1 text-[13px] text-white">{value}</div></div>)}
          </div>
          <div className="flex gap-3">
            <button onClick={() => onToggleLike(selected.id)} className="rounded-md bg-[#376da8] px-5 py-2 text-[13px] text-white hover:bg-[#437dbf]">{liked ? "Убрать из избранного" : "Добавить в избранное"}</button>
            <button className="rounded-md bg-[#242424] px-5 py-2 text-[13px] text-zinc-300 hover:bg-[#303030]">Хочу посмотреть</button>
          </div>
        </div>
      </section>
      <section className="mb-8 rounded-[20px] bg-[#202020] p-6">
        <div className="mb-4 flex gap-2">{["в главных ролях", "режиссер", "оператор", "продюсер", "сценарист", "композитор"].map((t) => <span key={t} className="rounded bg-[#4d4d4d] px-3 py-1.5 text-[11px] text-zinc-200">{t}</span>)}</div>
        <div className="grid grid-cols-6 gap-6">{people.map((src, i) => <div key={i} className="text-center"><img src={src} alt="actor" className="mx-auto h-24 w-24 rounded-full object-cover" /><div className="mt-3 text-[12px] text-zinc-300">имя<br />фамилия</div></div>)}</div>
      </section>
      <section className="mb-8 rounded-[20px] bg-[#202020] p-6">
        <div className="mb-4 flex items-center gap-4">
          <span className="text-lg">Оцените фильм</span>
          <div className="flex gap-1">
            {[1,2,3,4,5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setReviewRating(n)}
                className="rounded-full p-1 transition hover:bg-white/10"
                aria-label={`Поставить ${n} звёзд`}
              >
                <Star className={cn("h-5 w-5", n <= reviewRating ? "text-yellow-400" : "text-zinc-500")} />
              </button>
            ))}
          </div>
        </div>
        <textarea placeholder="Поле для написания рецензии" className="mb-4 min-h-[170px] w-full rounded-lg bg-[#4c4c4c] p-4 text-[13px] text-zinc-200 outline-none placeholder:text-zinc-300" />
        <div className="flex justify-end"><button className="rounded-md bg-violet-600 px-8 py-2 text-[13px] text-white hover:bg-violet-500">Отправить</button></div>
      </section>
      <h2 className="mb-5 text-lg">Написано 13 рецензий</h2>
      <section className="rounded-[20px] bg-[#202020] p-6">
        <div className="mb-4 flex items-center gap-3"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black">***</div><span className="text-[13px]">Никнейм</span></div>
        <div className="rounded-lg bg-[#4c4c4c] p-4 text-[13px] leading-6 text-zinc-200">Лёгкая, но приятная рецензия. История выглядит цельно, персонажи раскрываются постепенно, а финал оставляет после себя ощущение завершённости. Вердикт: хороший жанровый аттракцион, который приятно посмотреть вечером.</div>
        <div className="mt-4 flex justify-end gap-5 text-[12px] text-zinc-400"><span>15.03.2025</span><span>оценка 4.5</span><Heart className="h-4 w-4" /></div>
      </section>
    </main>
  );
}

export default function MoviePlatformUI() {
  const [page, setPage] = useState("home");
  const [previousPage, setPreviousPage] = useState("home");
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({ genre: "", country: "", year: "", rating: "" });
  const [selectedMovie, setSelectedMovie] = useState(movies[4]);
  const [likedIds, setLikedIds] = useState([5]);

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
    setPage(previousPage || "home");
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <div className="mx-auto max-w-[1180px] px-8 py-7">
        <Header page={page} setPage={setPage} search={search} setSearch={setSearch} likedCount={likedIds.length} />
        {page === "home" && <HomePage onOpen={openMovie} setPage={setPage} likedIds={likedIds} onToggleLike={toggleLike} />}
        {page === "filters" && <FiltersPage onOpen={openMovie} setPage={setPage} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} likedIds={likedIds} onToggleLike={toggleLike} resetFilters={resetFilters} />}
        {page === "filters-selected" && <FiltersSelectedPage onOpen={openMovie} setPage={setPage} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} likedIds={likedIds} onToggleLike={toggleLike} resetFilters={resetFilters} />}
        {page === "series" && <FiltersPage onOpen={openMovie} setPage={setPage} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} likedIds={likedIds} onToggleLike={toggleLike} resetFilters={resetFilters} />}
        {page === "search" && <SearchPage search={search} setSearch={setSearch} onOpen={openMovie} setPage={setPage} likedIds={likedIds} onToggleLike={toggleLike} />}
        {page === "favorites" && <FavoritesPage likedIds={likedIds} onOpen={openMovie} onToggleLike={toggleLike} setPage={setPage} />}
        {page === "profile" && <ProfilePage setPage={setPage} likedIds={likedIds} onOpen={openMovie} />}
        {page === "movie" && <MovieDetailPage movie={selectedMovie} onBack={goBackFromMovie} liked={likedIds.includes(selectedMovie.id)} onToggleLike={toggleLike} />}
      </div>
    </div>
  );
}
