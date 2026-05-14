import React, { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  User,
  ChevronLeft,
  Heart,
  Star,
  Eye,
  X,
} from "lucide-react";

type Page =
  | "login"
  | "home"
  | "filters"
  | "filters-selected"
  | "series"
  | "search"
  | "movie"
  | "profile"
  | "other-profile"
  | "preferences";

type Movie = {
  id: number;
  title: string;
  kind: "film" | "series";
  section: "films" | "series";
  rating: number;
  year: number;
  type: string;
  genre: string;
  country: string;
  image: string;
};

type Person = {
  name: string;
  image: string;
};

const movies: Movie[] = [
  {
    id: 1,
    title: "Белый лотос",
    kind: "series",
    section: "series",
    rating: 4.5,
    year: 2024,
    type: "новый сериал",
    genre: "Драма",
    country: "США",
    image: "https://image.tmdb.org/t/p/w500/gFj84LTFk0nx0qkdGXzLMwKh2Hw.jpg",
  },
  {
    id: 2,
    title: "Бригада",
    kind: "series",
    section: "series",
    rating: 4.8,
    year: 2019,
    type: "сериал",
    genre: "Криминал",
    country: "Россия",
    image: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
  },
  {
    id: 3,
    title: "Звезды в полдень",
    kind: "film",
    section: "films",
    rating: 4.2,
    year: 2023,
    type: "фильм",
    genre: "Драма",
    country: "Франция",
    image: "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg",
  },
  {
    id: 4,
    title: "Сапожник",
    kind: "film",
    section: "films",
    rating: 4.1,
    year: 2006,
    type: "фильм",
    genre: "Комедия",
    country: "США",
    image: "https://image.tmdb.org/t/p/w500/6EJGnU4o0j2sR7JQZLz2YdZ6o7U.jpg",
  },
  {
    id: 5,
    title: "Горничная",
    kind: "film",
    section: "films",
    rating: 4.5,
    year: 2025,
    type: "фильм",
    genre: "Триллер",
    country: "США",
    image: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
  },
  {
    id: 6,
    title: "Девушка не лёгкого поведения",
    kind: "film",
    section: "films",
    rating: 4.0,
    year: 2020,
    type: "фильм",
    genre: "Комедия",
    country: "США",
    image: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
  },
  {
    id: 7,
    title: "Внутри убийцы",
    kind: "series",
    section: "series",
    rating: 4.4,
    year: 2024,
    type: "сериал",
    genre: "Детектив",
    country: "Россия",
    image: "https://image.tmdb.org/t/p/w500/rTh4K5uw9HypmpGslcKd4QfHl93.jpg",
  },
  {
    id: 8,
    title: "Эйфория",
    kind: "series",
    section: "series",
    rating: 4.7,
    year: 2021,
    type: "сериал",
    genre: "Драма",
    country: "США",
    image: "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
  },
];

const people: Person[] = [
  {
    name: "Сидни Суини",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Сигурни Уивер",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Дэвид Харбор",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Мэтт Даффер",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Милли Бобби Браун",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Павел Лунгин",
    image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=500&q=80",
  },
];

const directors: Person[] = [
  people[3],
  people[5],
  {
    name: "Росс Даффер",
    image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Джеймс Кэмерон",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80",
  },
];

const heroSlides = [
  {
    title: "Остров",
    image: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
  },
  {
    title: "Чёрная граница",
    image: "https://image.tmdb.org/t/p/w780/9zcbqSxdsRMZWHYtyCd1nXPr2xq.jpg",
  },
  {
    title: "Центурия",
    image: "https://image.tmdb.org/t/p/w500/7gKI9hpEMcZUQpNgKrkDzJpbnNS.jpg",
  },
];

const filterGroups = [
  { label: "Жанры", values: ["Комедия", "Драма", "Триллер", "Криминал"] },
  { label: "Страны", values: ["Россия", "США", "Франция"] },
  { label: "Год выхода", values: ["2024", "2023", "2021", "2019"] },
  { label: "Рейтинг", values: ["4+", "4.5+"] },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md bg-[#262626] text-white hover:bg-[#333]"
    >
      <ChevronLeft className="h-4 w-4" />
    </button>
  );
}

function LogoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[11px] text-black"
    >
      лого
    </button>
  );
}

function Header({
  page,
  setPage,
  search,
  setSearch,
}: {
  page: Page;
  setPage: (page: Page) => void;
  search: string;
  setSearch: (value: string) => void;
}) {
  return (
    <header className="mb-7 flex h-10 items-center justify-between">
      <div className="flex items-center gap-12">
        <LogoButton onClick={() => setPage("home")} />

        <div className="relative w-[210px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onFocus={() => setPage("search")}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage("search");
            }}
            placeholder="поиск"
            className="h-8 w-full rounded-md border border-[#1e1e1e] bg-[#202020] pl-9 pr-3 text-[12px] text-zinc-200 outline-none placeholder:text-zinc-500"
          />
        </div>

        <nav className="flex gap-14 text-[13px] text-zinc-300">
          <button onClick={() => setPage("home")} className={page === "home" ? "text-white" : "hover:text-white"}>
            главная
          </button>
          <button
            onClick={() => setPage("filters")}
            className={page === "filters" || page === "filters-selected" || page === "movie" ? "text-white" : "hover:text-white"}
          >
            фильмы
          </button>
          <button onClick={() => setPage("series")} className={page === "series" ? "text-white" : "hover:text-white"}>
            сериалы
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-5">
        <button onClick={() => setPage("filters")} className="text-zinc-300 hover:text-white">
          <SlidersHorizontal className="h-5 w-5" />
        </button>
        <button
          onClick={() => setPage("other-profile")}
          className="rounded-lg border border-zinc-600 px-3 py-1.5 text-[12px] text-zinc-200 hover:border-zinc-300"
        >
          другой профиль
        </button>
        <button
          onClick={() => setPage("profile")}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-500 text-zinc-300 hover:border-zinc-300"
        >
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

function RatingDots() {
  return (
    <div className="flex gap-1.5">
      <span className="h-3 w-3 rounded-full bg-violet-400" />
      <span className="h-3 w-3 rounded-full bg-violet-300" />
      <span className="h-3 w-3 rounded-full bg-violet-300" />
    </div>
  );
}

function MovieCard({ movie, onOpen }: { movie: Movie; onOpen: (movie: Movie) => void }) {
  return (
    <button onClick={() => onOpen(movie)} className="group w-full text-left">
      <div className="relative overflow-hidden rounded-[6px] bg-[#202020]">
        <img
          src={movie.image}
          alt={movie.title}
          className="h-[300px] w-full object-cover transition duration-200 group-hover:scale-[1.02]"
        />
      </div>
      <div className="mt-2">
        <RatingDots />
      </div>
      <div className="mt-2 text-[13px] leading-4 text-zinc-200">{movie.title}</div>
      <div className="mt-1 text-[11px] text-zinc-500">{movie.year}</div>
    </button>
  );
}

function MovieGrid({ items, onOpen }: { items: Movie[]; onOpen: (movie: Movie) => void }) {
  return (
    <div className="grid grid-cols-4 gap-x-8 gap-y-9">
      {items.map((movie, index) => (
        <MovieCard key={`${movie.id}-${index}`} movie={movie} onOpen={onOpen} />
      ))}
    </div>
  );
}

function FilterButtons({
  selectedMode = false,
  onSelect,
}: {
  selectedMode?: boolean;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      {filterGroups.map((group) => (
        <button
          key={group.label}
          onClick={() => onSelect(group.values[0])}
          className="rounded-md bg-[#2d2d2d] px-4 py-2 text-[13px] text-zinc-300 hover:bg-[#3a3a3a]"
        >
          {group.label} ▾
        </button>
      ))}

      {selectedMode && (
        <div className="mt-1 flex w-full flex-wrap gap-2">
          {["комедия", "Россия", "2024", "Рейтинг больше"].map((tag) => (
            <button key={tag} className="rounded-md bg-[#315b84] px-3 py-1.5 text-[12px] text-white">
              {tag} <span className="ml-1 text-zinc-200">×</span>
            </button>
          ))}
          <button className="text-[12px] text-zinc-400">☐ сбросить всё</button>
        </div>
      )}
    </div>
  );
}

function HomePage({
  onOpen,
  setPage,
  setActiveFilter,
}: {
  onOpen: (movie: Movie) => void;
  setPage: (page: Page) => void;
  setActiveFilter: (value: string) => void;
}) {
  return (
    <main>
      <section className="mb-8 grid grid-cols-[220px_1fr_220px] gap-6">
        <div className="overflow-hidden rounded-[4px]">
          <img src={heroSlides[0].image} alt={heroSlides[0].title} className="h-[255px] w-full object-cover" />
        </div>
        <div className="relative overflow-hidden rounded-[4px] bg-[#151515]">
          <img src={heroSlides[1].image} alt={heroSlides[1].title} className="h-[255px] w-full object-cover opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-black/30" />
          <div className="absolute left-9 top-7 rounded bg-violet-500 px-3 py-1 text-[11px] text-white">новый сериал</div>
          <div className="absolute bottom-10 left-9">
            <h1 className="mb-1 text-2xl font-semibold uppercase tracking-wide">
              Чёрная
              <br />
              граница
            </h1>
            <p className="text-[12px] text-zinc-300">Триллер по подписке</p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[4px]">
          <img src={heroSlides[2].image} alt={heroSlides[2].title} className="h-[255px] w-full object-cover" />
          <div className="absolute bottom-7 left-6 text-xl font-semibold uppercase">Центурия</div>
        </div>
      </section>

      <FilterButtons
        onSelect={(value) => {
          setActiveFilter(value);
          setPage("filters-selected");
        }}
      />

      <h2 className="mb-5 text-xl font-medium">Популярно сейчас</h2>
      <MovieGrid items={[...movies, ...movies.slice(0, 4)]} onOpen={onOpen} />
    </main>
  );
}

function FiltersPage({
  onOpen,
  setPage,
  setActiveFilter,
  seriesOnly = false,
}: {
  onOpen: (movie: Movie) => void;
  setPage: (page: Page) => void;
  setActiveFilter: (value: string) => void;
  seriesOnly?: boolean;
}) {
  const source = seriesOnly ? movies.filter((movie) => movie.section === "series") : movies.filter((movie) => movie.section === "films");
  const items = [...source, ...source].slice(0, 8);

  return (
    <main>
      <h1 className="mb-6 text-xl font-medium">Фильтры</h1>
      <FilterButtons
        onSelect={(value) => {
          setActiveFilter(value);
          setPage("filters-selected");
        }}
      />
      <MovieGrid items={items} onOpen={onOpen} />
    </main>
  );
}

function FiltersSelectedPage({
  onOpen,
  activeFilter,
  setActiveFilter,
}: {
  onOpen: (movie: Movie) => void;
  activeFilter: string;
  setActiveFilter: (value: string) => void;
}) {
  const filtered = movies.filter((movie) => ["Белый лотос", "Бригада", "Звезды в полдень", "Сапожник"].includes(movie.title));

  return (
    <main>
      <h1 className="mb-6 text-xl font-medium">Фильтры</h1>
      <FilterButtons selectedMode onSelect={setActiveFilter} />
      {activeFilter && <div className="mb-4 text-[12px] text-zinc-500">Выбран фильтр: {activeFilter}</div>}
      <MovieGrid items={[...filtered, ...filtered]} onOpen={onOpen} />
    </main>
  );
}

function SearchPage({
  search,
  setSearch,
  onOpen,
  setPage,
}: {
  search: string;
  setSearch: (value: string) => void;
  onOpen: (movie: Movie) => void;
  setPage: (page: Page) => void;
}) {
  const results = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return [movies[4], movies[5], movies[6], movies[7], movies[7]];
    return movies.filter((movie) => movie.title.toLowerCase().includes(q));
  }, [search]);

  return (
    <main className="min-h-[70vh]">
      <div className="mb-8 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            autoFocus
            placeholder="поиск"
            className="h-9 w-full rounded-md bg-[#202020] pl-10 pr-10 text-[13px] text-zinc-200 outline-none"
          />
          <button
            onClick={() => {
              setSearch("");
              setPage("home");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <h1 className="mb-6 text-xl font-medium">Сейчас ищут</h1>
      <div className="mb-8 grid grid-cols-5 gap-8">
        {results.map((movie, index) => (
          <MovieCard key={`${movie.id}-search-${index}`} movie={movie} onOpen={onOpen} />
        ))}
      </div>

      <div className="grid grid-cols-6 gap-5">
        {people.map((person) => (
          <img key={person.name} src={person.image} alt={person.name} className="h-[120px] w-full rounded-t-full object-cover" />
        ))}
      </div>
    </main>
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[150px_1fr] gap-4 text-[13px] leading-6">
      <span className="text-zinc-500">{label}</span>
      <span className="text-zinc-200">{value}</span>
    </div>
  );
}

function MoviePage({
  item,
  favorite,
  onToggleFavorite,
  onBack,
}: {
  item: Movie;
  favorite: boolean;
  onToggleFavorite: (id: number) => void;
  onBack: () => void;
}) {
  return (
    <main>
      <button onClick={onBack} className="mb-6 flex h-8 w-8 items-center justify-center rounded-md bg-[#262626]">
        <ChevronLeft className="h-4 w-4" />
      </button>

      <section className="mb-8 grid grid-cols-[360px_1fr] gap-10">
        <div className="relative">
          <img src={item.image} alt={item.title} className="h-[520px] w-full rounded-[8px] object-cover" />
          <button
            onClick={() => onToggleFavorite(item.id)}
            className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#a18c3a] text-black"
          >
            <Star className={cn("h-5 w-5", favorite && "fill-current")} />
          </button>
        </div>

        <div className="pt-3">
          <h1 className="mb-2 text-3xl font-semibold">{item.title}</h1>
          <div className="mb-6 text-[13px] text-zinc-400">Описание</div>
          <p className="mb-5 max-w-[680px] text-[14px] leading-6 text-zinc-300">
            Лёгкая история, которая пытается совместить тонкую драму, сатиру и напряжение. Сюжет держится на главной героине, её прошлом и странных отношениях с людьми вокруг. Фильм постепенно раскрывает конфликт и оставляет ощущение тревоги даже после финала.
          </p>

          <div className="mb-5 grid max-w-[620px] gap-1">
            <DetailStat label="Страна" value={item.country} />
            <DetailStat label="Жанр" value={item.genre} />
            <DetailStat label="Оригинальное название" value="The Housemaid" />
            <DetailStat label="Премьера в России" value="1 декабря 2025 г." />
            <DetailStat label="Длительность" value="2 ч 5 мин" />
          </div>

          <div className="mb-5 grid max-w-[620px] grid-cols-3 gap-3">
            {[
              ["Средняя оценка", item.rating.toFixed(1)],
              ["Средняя оценка без рецензий", "4.5"],
              ["Средняя оценка по рецензиям", "4.5"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-[#262626] px-4 py-3 text-center">
                <div className="text-[11px] text-zinc-400">{label}</div>
                <div className="mt-1 text-[13px] text-white">{value}</div>
              </div>
            ))}
          </div>

          <button className="rounded-md bg-[#376da8] px-5 py-2 text-[13px] text-white">Добавить в предпочтения</button>
        </div>
      </section>

      <section className="mb-8 rounded-[20px] bg-[#202020] p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {["в главных ролях", "режиссер", "оператор", "продюсер", "сценарист", "композитор"].map((text) => (
            <span key={text} className="rounded bg-[#4d4d4d] px-3 py-1.5 text-[11px] text-zinc-200">
              {text}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-6 gap-6">
          {people.map((person) => (
            <div key={person.name} className="text-center">
              <img src={person.image} alt={person.name} className="mx-auto h-24 w-24 rounded-full object-cover" />
              <div className="mt-3 text-[12px] text-zinc-300">{person.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8 rounded-[20px] bg-[#202020] p-6">
        <div className="mb-4 flex items-center gap-4">
          <span className="text-lg">Оцените фильм</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((number) => (
              <Star key={number} className="h-5 w-5 text-zinc-500" />
            ))}
          </div>
          <span className="ml-auto flex items-center gap-1 text-[12px] text-zinc-500">
            <Eye className="h-4 w-4" /> уже просмотрено
          </span>
        </div>
        <textarea
          placeholder="Поле для написания рецензии"
          className="mb-4 min-h-[170px] w-full rounded-lg bg-[#4c4c4c] p-4 text-[13px] text-zinc-200 outline-none placeholder:text-zinc-300"
        />
        <div className="flex justify-end">
          <button className="rounded-md bg-violet-600 px-8 py-2 text-[13px] text-white">Отправить</button>
        </div>
      </section>

      <h2 className="mb-5 text-lg">Написано 13 рецензий</h2>
      <ReviewBlock movie={item} />
    </main>
  );
}

function ReviewBlock({ movie }: { movie: Movie }) {
  return (
    <section className="rounded-[20px] bg-[#202020] p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black">***</div>
        <span className="text-[13px]">Никнейм</span>
      </div>
      <div className="rounded-lg bg-[#4c4c4c] p-4 text-[13px] leading-6 text-zinc-200">
        Лёгкая, но приятная рецензия. «{movie.title}» выглядит цельно, персонажи раскрываются постепенно, а финал оставляет после себя ощущение завершённости. Вердикт: хороший жанровый аттракцион, который приятно посмотреть вечером.
      </div>
      <div className="mt-4 flex justify-end gap-5 text-[12px] text-zinc-400">
        <span>15.03.2025</span>
        <span>оценка {movie.rating.toFixed(1)}</span>
        <Heart className="h-4 w-4" />
      </div>
    </section>
  );
}

function PersonCard({ person }: { person: Person }) {
  return (
    <div className="w-[180px] text-left">
      <div className="relative overflow-hidden rounded-2xl">
        <img src={person.image} alt={person.name} className="h-[220px] w-full object-cover" />
        <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-black">
          <Heart className="h-4 w-4 fill-black" />
        </div>
      </div>
      <div className="mt-3 text-sm font-medium text-zinc-100">{person.name}</div>
    </div>
  );
}

function LeftProfileColumn() {
  return (
    <aside className="w-[260px] shrink-0 rounded-3xl bg-zinc-900 p-4">
      <div className="mb-4 flex flex-col items-center">
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-xl border border-zinc-600">
          <User className="h-8 w-8 text-zinc-400" />
        </div>
        <div className="text-sm text-zinc-100">имя</div>
      </div>

      <div className="mb-4 rounded-2xl bg-zinc-700 p-3 text-sm text-zinc-200">Описание</div>

      <div className="mb-4 rounded-2xl bg-zinc-800 p-3">
        <div className="mb-2 text-xs text-zinc-400">Уровень</div>
        <div className="flex items-center gap-2">
          <div className="h-1 flex-1 rounded-full bg-zinc-600">
            <div className="h-1 w-3/4 rounded-full bg-zinc-200" />
          </div>
          <span className="text-xs text-zinc-300">22</span>
        </div>
      </div>

      <div className="rounded-2xl bg-zinc-800 p-3 text-xs leading-6 text-zinc-300">
        <div className="mb-1 text-sm">Статистика</div>
        <div className="flex justify-between"><span>Написано рецензий</span><span>12</span></div>
        <div className="flex justify-between"><span>Оценок без рецензий</span><span>20</span></div>
        <div className="flex justify-between"><span>Получено лайков</span><span>18</span></div>
        <div className="flex justify-between"><span>Поставлено лайков</span><span>35</span></div>
        <div className="flex justify-between"><span>Авторских лайков</span><span>8</span></div>
      </div>
    </aside>
  );
}

function ProfilePage({ setPage }: { setPage: (page: Page) => void }) {
  return (
    <div className="flex gap-8">
      <LeftProfileColumn />
      <div className="flex-1">
        <div className="mb-8 text-3xl font-semibold text-zinc-100">мой профиль</div>

        <div className="mb-4 grid grid-cols-[1fr_280px] gap-4">
          <div className="rounded-2xl bg-zinc-700 p-4 text-sm text-zinc-200">
            <div className="mb-1 text-zinc-400">мой номер</div>
            +7 (999) 999-99-99
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-zinc-700 p-4 text-sm text-zinc-200">
            <div>
              <div className="mb-1 text-zinc-400">изображение профиля</div>
              загрузите аватар
            </div>
            <User className="h-4 w-4" />
          </div>
        </div>

        <div className="mb-4 rounded-3xl bg-zinc-900 p-5">
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <div className="mb-2 text-sm text-zinc-400">имя пользователя</div>
              <div className="rounded-2xl bg-zinc-700 p-3 text-sm text-zinc-200">имя</div>
            </div>
            <div>
              <div className="mb-2 text-sm text-zinc-400">моя почта</div>
              <div className="rounded-2xl bg-zinc-700 p-3 text-sm text-zinc-200">почта</div>
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm text-zinc-400">моё описание</div>
            <div className="min-h-[140px] rounded-2xl bg-zinc-700 p-3 text-sm text-zinc-200">добавьте описание</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <button onClick={() => setPage("preferences")} className="rounded-2xl bg-zinc-900 p-4 text-left text-sm text-zinc-200">предпочтения</button>
          <button onClick={() => setPage("reviews")} className="rounded-2xl bg-zinc-900 p-4 text-left text-sm text-zinc-200">рецензии</button>
          <button onClick={() => setPage("other-profile")} className="rounded-2xl bg-zinc-900 p-4 text-left text-sm text-zinc-200">профиль другого пользователя</button>
        </div>
      </div>
    </div>
  );
}

function OtherProfilePage() {
  return (
    <div className="flex gap-8">
      <LeftProfileColumn />
      <div className="flex-1">
        <div className="mb-6 flex gap-8 text-lg text-zinc-300">
          <span className="text-violet-400">рецензии</span>
          <span>предпочтения</span>
        </div>
        <div className="space-y-6">
          <ReviewBlock movie={movies[4]} />
          <ReviewBlock movie={movies[3]} />
        </div>
      </div>
    </div>
  );
}

function PreferencesPage() {
  return (
    <div>
      <div className="mb-6 text-3xl font-semibold text-zinc-100">предпочтения</div>
      <div className="mb-8 flex gap-8 text-lg text-zinc-300">
        <span className="text-violet-400">фильмы</span>
        <span>сериалы</span>
        <span>актёры</span>
        <span>режиссёры</span>
      </div>
      <div className="mb-8 grid grid-cols-4 gap-8">
        {movies.filter((movie) => movie.section === "films").slice(0, 4).map((movie) => (
          <MovieCard key={movie.id} movie={movie} onOpen={() => undefined} />
        ))}
      </div>
      <div className="mb-5 text-2xl font-medium text-zinc-100">актёры</div>
      <div className="mb-8 grid grid-cols-4 gap-8">
        {people.slice(0, 4).map((person) => (
          <PersonCard key={person.name} person={person} />
        ))}
      </div>
      <div className="mb-5 text-2xl font-medium text-zinc-100">режиссёры</div>
      <div className="grid grid-cols-4 gap-8">
        {directors.map((person) => (
          <PersonCard key={person.name} person={person} />
        ))}
      </div>
    </div>
  );
}

function ReviewsPage({ onBack }: { onBack: () => void }) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <BackButton onClick={onBack} />
        <div className="text-3xl font-semibold text-zinc-100">ваши рецензии</div>
      </div>
      <div className="space-y-6">
        <ReviewBlock movie={movies[4]} />
        <ReviewBlock movie={movies[3]} />
      </div>
    </div>
  );
}

function LoginPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 bg-zinc-700/20" />
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="relative w-[320px] pt-8">
          <div className="absolute left-1/2 top-0 z-10 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-zinc-100 text-xs text-zinc-900">
            лого
          </div>
          <div className="rounded-3xl bg-zinc-900 px-6 pb-6 pt-10 text-center shadow-2xl">
            <div className="mb-4 text-lg font-medium text-zinc-100">Войдите с помощью электронной почты</div>
            <input placeholder="Введите почту" className="mb-2 h-10 w-full rounded-md border border-zinc-700 bg-zinc-700 px-3 text-sm text-white outline-none placeholder:text-zinc-300" />
            <button onClick={onEnter} className="mb-2 h-10 w-full rounded-md bg-zinc-600 text-sm text-zinc-100 hover:bg-zinc-500">продолжить</button>
            <button className="h-10 w-full rounded-md bg-zinc-600 text-sm text-zinc-100 hover:bg-zinc-500">зарегистрироваться</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("login");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [favorites, setFavorites] = useState<number[]>([1, 2, 4, 5, 7]);
  const [selectedMovie, setSelectedMovie] = useState<Movie>(movies[4]);

  const toggleFavorite = (id: number) => {
    setFavorites((previous) => (previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]));
  };

  const openMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setPage("movie");
  };

  if (page === "login") {
    return <LoginPage onEnter={() => setPage("home")} />;
  }

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <div className="mx-auto max-w-[1180px] px-8 py-7">
        <Header page={page} setPage={setPage} search={search} setSearch={setSearch} />

        {page === "home" && <HomePage onOpen={openMovie} setPage={setPage} setActiveFilter={setActiveFilter} />}

        {page === "filters" && <FiltersPage onOpen={openMovie} setPage={setPage} setActiveFilter={setActiveFilter} />}

        {page === "filters-selected" && (
          <FiltersSelectedPage onOpen={openMovie} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        )}

        {page === "series" && <FiltersPage onOpen={openMovie} setPage={setPage} setActiveFilter={setActiveFilter} seriesOnly />}

        {page === "search" && <SearchPage search={search} setSearch={setSearch} onOpen={openMovie} setPage={setPage} />}

        {page === "movie" && (
          <MoviePage
            item={selectedMovie}
            favorite={favorites.includes(selectedMovie.id)}
            onToggleFavorite={toggleFavorite}
            onBack={() => setPage("home")}
          />
        )}

        {page === "profile" && <ProfilePage setPage={setPage} />}
        {page === "other-profile" && <OtherProfilePage />}
        {page === "preferences" && <PreferencesPage />}
        {page === "reviews" && <ReviewsPage onBack={() => setPage("profile")} />}
      </div>
    </div>
  );
}









// @ts-nocheck
import React, { useMemo, useState } from "react";
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
        <button className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-500 text-zinc-300"><User className="h-4 w-4" /></button>
      </div>
    </header>
  );
}

function RatingDots({ rating }) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((dot) => (
        <span key={dot} className={cn("h-2.5 w-2.5 rounded-full", dot <= filled ? "bg-violet-400" : "bg-zinc-700")} />
      ))}
      <span className="ml-1 text-[11px] text-zinc-400">{rating}</span>
    </div>
  );
}

function MovieCard({ movie, onOpen, liked, onToggleLike }) {
  return (
    <div className="group w-full text-left">
      <button onClick={() => onOpen(movie)} className="w-full text-left">
        <div className="relative overflow-hidden rounded-[8px] bg-[#202020]">
          <img src={movie.poster} alt={movie.title} className="h-[300px] w-full object-cover transition duration-200 group-hover:scale-[1.02]" />
          <div className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-[10px] text-zinc-200">{movie.type}</div>
        </div>
      </button>
      <div className="mt-2 flex items-start justify-between gap-2">
        <div>
          <RatingDots rating={movie.rating} />
          <button onClick={() => onOpen(movie)} className="mt-2 text-left text-[13px] leading-4 text-zinc-200 hover:text-white">{movie.title}</button>
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
    <div className="grid grid-cols-4 gap-x-8 gap-y-9">
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
    <div className="mb-7 rounded-2xl bg-[#171717] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Фильтры</h2>
        <button onClick={onReset} className="text-[12px] text-zinc-400 hover:text-white">сбросить всё</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {filterGroups.map((group) => (
          <div key={group.key}>
            <div className="mb-2 text-[12px] text-zinc-500">{group.label}</div>
            <div className="flex flex-wrap gap-2">
              {group.values.map((value) => {
                const active = selectedFilters[group.key] === value;
                return (
                  <button
                    key={value}
                    onClick={() => toggleFilter(group.key, value)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-[12px] transition",
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
        <button onClick={onApply} className="rounded-md bg-violet-600 px-6 py-2 text-[13px] text-white hover:bg-violet-500">Показать результаты</button>
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
        <div className="mb-8 grid grid-cols-4 gap-8">
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

function DetailStat({ label, value }) {
  return <div className="grid grid-cols-[150px_1fr] gap-4 text-[13px] leading-6"><span className="text-zinc-500">{label}</span><span className="text-zinc-200">{value}</span></div>;
}

function MovieDetailPage({ movie, onBack, liked, onToggleLike }) {
  const selected = movie || movies[4];
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
          <div className="mb-4 flex items-center gap-4"><RatingDots rating={selected.rating} /><span className="text-[13px] text-zinc-400">{selected.year}</span></div>
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
        <div className="mb-4 flex items-center gap-4"><span className="text-lg">Оцените фильм</span><div className="flex gap-1">{[1,2,3,4,5].map((n)=><Star key={n} className="h-5 w-5 text-zinc-500" />)}</div></div>
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
        {page === "movie" && <MovieDetailPage movie={selectedMovie} onBack={goBackFromMovie} liked={likedIds.includes(selectedMovie.id)} onToggleLike={toggleLike} />}
      </div>
    </div>
  );
}






































// @ts-nocheck
import React, { useMemo, useState } from "react";
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

function RatingDots({ rating }) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((dot) => (
        <span key={dot} className={cn("h-2.5 w-2.5 rounded-full", dot <= filled ? "bg-violet-400" : "bg-zinc-700")} />
      ))}
      <span className="ml-1 text-[11px] text-zinc-400">{rating}</span>
    </div>
  );
}

function MovieCard({ movie, onOpen, liked, onToggleLike }) {
  return (
    <div className="group w-full text-left">
      <button onClick={() => onOpen(movie)} className="w-full text-left">
        <div className="relative overflow-hidden rounded-[8px] bg-[#202020]">
          <img src={movie.poster} alt={movie.title} className="h-[300px] w-full object-cover transition duration-200 group-hover:scale-[1.02]" />
          <div className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-[10px] text-zinc-200">{movie.type}</div>
        </div>
      </button>
      <div className="mt-2 flex items-start justify-between gap-2">
        <div>
          <RatingDots rating={movie.rating} />
          <button onClick={() => onOpen(movie)} className="mt-2 text-left text-[13px] leading-4 text-zinc-200 hover:text-white">{movie.title}</button>
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
    <div className="grid grid-cols-5 gap-x-8 gap-y-9">
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
        <button onClick={onReset} className="text-[12px] text-zinc-400 hover:text-white">сбросить всё</button>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {filterGroups.map((group) => (
          <div key={group.key}>
            <div className="mb-2 text-[12px] text-zinc-500">{group.label}</div>
            <div className="flex flex-wrap gap-2">
              {group.values.map((value) => {
                const active = selectedFilters[group.key] === value;
                return (
                  <button
                    key={value}
                    onClick={() => toggleFilter(group.key, value)}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-[11px] transition",
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
        <div className="mb-8 grid grid-cols-5 gap-8">
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

function ProfilePage({ setPage, likedIds }) {
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
              <div className="mt-2 text-2xl font-semibold">13</div>
            </div>
            <div className="rounded-xl bg-[#171717] p-4">
              <div className="text-[12px] text-zinc-500">Средняя оценка</div>
              <div className="mt-2 text-2xl font-semibold">4.5</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setPage("favorites")} className="rounded-xl bg-[#242424] p-4 text-left text-[14px] text-zinc-200 hover:bg-[#303030]">
              Перейти в избранное
            </button>
            <button onClick={() => setPage("filters")} className="rounded-xl bg-[#242424] p-4 text-left text-[14px] text-zinc-200 hover:bg-[#303030]">
              Подобрать фильм
            </button>
          </div>
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
          <div className="mb-4 flex items-center gap-4"><RatingDots rating={selected.rating} /><span className="text-[13px] text-zinc-400">{selected.year}</span></div>
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
        <div className="mb-4 flex items-center gap-4"><span className="text-lg">Оцените фильм</span><div className="flex gap-1">{[1,2,3,4,5].map((n)=><Star key={n} className="h-5 w-5 text-zinc-500" />)}</div></div>
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
        {page === "profile" && <ProfilePage setPage={setPage} likedIds={likedIds} />}
        {page === "movie" && <MovieDetailPage movie={selectedMovie} onBack={goBackFromMovie} liked={likedIds.includes(selectedMovie.id)} onToggleLike={toggleLike} />}
      </div>
    </div>
  );
}
