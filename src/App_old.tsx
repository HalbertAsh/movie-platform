import React, { useMemo, useState } from "react";
import { Search, SlidersHorizontal, User, ChevronLeft, Heart, Star, Eye } from "lucide-react";

function Button({
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={className} {...props} />;
}

const media = [
  {
    id: 1,
    title: "Горничная",
    kind: "film",
    section: "films",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "Сапожник",
    kind: "film",
    section: "films",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Девушка не лёгкого поведения",
    kind: "film",
    section: "films",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    title: "Звезды в полдень",
    kind: "film",
    section: "films",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    title: "Внутри убийцы",
    kind: "series",
    section: "series",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    title: "Бригада",
    kind: "series",
    section: "series",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 7,
    title: "Белый лотос",
    kind: "series",
    section: "series",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 8,
    title: "Эйфория",
    kind: "series",
    section: "series",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=900&q=80",
  },
];

const actors = [
  {
    name: "Сидни Суини",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Дэвид Харбор",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Милли Бобби Браун",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Сигурни Уивер",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
  },
];

const directors = [
  {
    name: "Мэтт Даффер",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Павел Лунгин",
    image: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Росс Даффер",
    image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Джеймс Кэмерон",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
  },
];

const filters = ["по популярности", "жанры", "зарубежные", "российские", "высокий рейтинг"];

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-700 text-white">
      <ChevronLeft className="h-4 w-4" />
    </button>
  );
}

function Header({
  search,
  setSearch,
  currentPage,
  setCurrentPage,
}: {
  search: string;
  setSearch: (value: string) => void;
  currentPage: string;
  setCurrentPage: (value: string) => void;
}) {
  return (
    <header className="mb-8 flex items-center justify-between gap-6">
      <div className="flex items-center gap-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-xs text-zinc-900">
          лого
        </div>

        <div className="relative w-52">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="поиск"
            className="h-9 w-full rounded-md border border-zinc-700 bg-zinc-900 pl-9 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none"
          />
        </div>

        <nav className="flex items-center gap-8 text-base font-medium text-zinc-300">
          <button onClick={() => setCurrentPage("home")} className={currentPage === "home" ? "text-white" : "text-zinc-400"}>
            главная
          </button>
          <button onClick={() => setCurrentPage("filters")} className={currentPage === "filters" ? "text-white" : "text-zinc-400"}>
            фильмы
          </button>
          <button onClick={() => setCurrentPage("series")} className={currentPage === "series" ? "text-white" : "text-zinc-400"}>
            сериалы
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => setCurrentPage("filters")} className="text-zinc-300">
          <SlidersHorizontal className="h-5 w-5" />
        </button>
        <button onClick={() => setCurrentPage("other-profile")} className="rounded-lg border border-zinc-600 px-3 py-1.5 text-sm text-zinc-200">
          другой профиль
        </button>
        <button onClick={() => setCurrentPage("profile")} className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-600 text-zinc-200">
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

function AppShell({
  children,
  search,
  setSearch,
  currentPage,
  setCurrentPage,
}: {
  children: React.ReactNode;
  search: string;
  setSearch: (value: string) => void;
  currentPage: string;
  setCurrentPage: (value: string) => void;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-7xl px-6 py-5">
        <Header search={search} setSearch={setSearch} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        {children}
      </div>
    </div>
  );
}

function PosterCard({
  item,
  favorite,
  onToggleFavorite,
  onOpen,
}: {
  item: (typeof media)[0];
  favorite?: boolean;
  onToggleFavorite?: (id: number) => void;
  onOpen?: (item: (typeof media)[0]) => void;
}) {
  return (
    <button onClick={() => onOpen?.(item)} className="text-left">
      <div className="relative w-[180px]">
        <img src={item.image} alt={item.title} className="h-[260px] w-full rounded-2xl object-cover" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(item.id);
          }}
          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-black"
        >
          <Heart className={cn("h-4 w-4", favorite ? "fill-black" : "")} />
        </button>
      </div>
      <div className="mt-3 text-sm font-medium text-zinc-100">{item.title}</div>
    </button>
  );
}

function PersonCard({ person }: { person: (typeof actors)[0] | (typeof directors)[0] }) {
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

function ReviewCard({ item }: { item: (typeof media)[0] }) {
  return (
    <div className="flex gap-4 rounded-3xl bg-zinc-900 p-5">
      <div className="w-[130px] shrink-0">
        <img src={item.image} alt={item.title} className="h-[190px] w-full rounded-2xl object-cover" />
        <div className="mt-2 text-sm text-zinc-200">{item.title}</div>
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="rounded-2xl bg-zinc-700 p-4 text-sm leading-6 text-zinc-100">
          Пол Фиг, известный комедиями, неожиданно точно снял психологический триллер о девушке с прошлым, которая устраивается в дом богатой семьи. За идеальным фасадом скрываются манипуляции, тайны и тревожное ощущение, что за улыбками — расчёт.
          <br /><br />
          Главное достоинство фильма — актёрский дуэт и хорошо работающая атмосфера.
          <br /><br />
          Вердикт: крепкий жанровый аттракцион.
        </div>
        <div className="mt-3 flex items-center justify-end gap-4 text-sm text-zinc-300">
          <span>оценка 4.5</span>
          <span>15</span>
          <Heart className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function HomePage({
  favorites,
  onToggleFavorite,
  onOpen,
}: {
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onOpen: (item: (typeof media)[0]) => void;
}) {
  const popular = media.slice(0, 8);
  return (
    <div>
      <div className="mb-6 text-3xl font-semibold text-zinc-100">главная страница</div>
      <div className="mb-8 h-[220px] rounded-3xl bg-zinc-800" />
      <div className="mb-5 text-3xl font-semibold text-zinc-100">популярно сейчас</div>
      <div className="grid grid-cols-4 gap-8">
        {popular.map((item) => (
          <PosterCard key={item.id} item={item} favorite={favorites.includes(item.id)} onToggleFavorite={onToggleFavorite} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function CatalogPage({
  title,
  items,
  favorites,
  onToggleFavorite,
  onOpen,
}: {
  title: string;
  items: typeof media;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onOpen: (item: (typeof media)[0]) => void;
}) {
  return (
    <div>
      <div className="mb-6 text-3xl font-semibold text-zinc-100">{title}</div>
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <div key={filter} className="rounded-lg bg-zinc-700 px-3 py-2 text-sm text-zinc-200">
            {filter}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-8">
        {items.map((item) => (
          <PosterCard key={item.id} item={item} favorite={favorites.includes(item.id)} onToggleFavorite={onToggleFavorite} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function MoviePage({
  item,
  favorite,
  onToggleFavorite,
  onBack,
}: {
  item: (typeof media)[0];
  favorite: boolean;
  onToggleFavorite: (id: number) => void;
  onBack: () => void;
}) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <BackButton onClick={onBack} />
        <div className="text-3xl font-semibold text-zinc-100">фильм</div>
      </div>

      <div className="grid grid-cols-[240px_1fr] gap-10">
        <div className="relative">
          <img src={item.image} alt={item.title} className="h-[360px] w-[240px] rounded-3xl object-cover" />
          <button onClick={() => onToggleFavorite(item.id)} className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-black">
            <Heart className={cn("h-4 w-4", favorite ? "fill-black" : "")} />
          </button>
        </div>

        <div>
          <div className="mb-4 flex gap-3">
            <div className="rounded-lg bg-zinc-700 px-4 py-2 text-sm text-zinc-200">{item.kind === "film" ? "фильм" : "сериал"}</div>
            <div className="rounded-lg bg-zinc-700 px-4 py-2 text-sm text-zinc-200">{item.title}</div>
          </div>

          <div className="mb-6 rounded-3xl bg-zinc-900 p-5">
            <div className="mb-3 text-sm text-zinc-300">актёры и съёмочная группа</div>
            <div className="mb-4 grid grid-cols-4 gap-4">
              {actors.map((actor) => (
                <div key={actor.name} className="text-center">
                  <img src={actor.image} alt={actor.name} className="mx-auto mb-2 h-16 w-16 rounded-full object-cover" />
                  <div className="text-xs text-zinc-300">{actor.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-4">
            {[
              "средняя оценка без рецензий",
              "средняя оценка по рецензиям",
              "средняя оценка по критикам",
            ].map((label) => (
              <div key={label} className="rounded-2xl bg-zinc-900 p-4 text-center">
                <div className="mb-2 text-xs text-zinc-400">{label}</div>
                <div className="text-xl font-medium text-zinc-100">4.5</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-zinc-900 p-5">
        <div className="mb-4 text-lg text-zinc-100">форма оценки</div>
        <div className="mb-4 flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-700 text-white">
              <Star className="h-4 w-4" />
            </button>
          ))}
          <div className="ml-3 flex items-center gap-1 text-sm text-zinc-400">
            <Eye className="h-4 w-4" /> уже просмотрено
          </div>
        </div>
        <div className="min-h-[200px] rounded-2xl bg-zinc-700 p-4 text-sm text-zinc-200">поле ввода</div>
      </div>
    </div>
  );
}

function ProfilePage({ setCurrentPage }: { setCurrentPage: (value: string) => void }) {
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
          <button onClick={() => setCurrentPage("preferences")} className="rounded-2xl bg-zinc-900 p-4 text-left text-sm text-zinc-200">предпочтения</button>
          <button onClick={() => setCurrentPage("reviews")} className="rounded-2xl bg-zinc-900 p-4 text-left text-sm text-zinc-200">рецензии</button>
          <button onClick={() => setCurrentPage("other-profile")} className="rounded-2xl bg-zinc-900 p-4 text-left text-sm text-zinc-200">профиль другого пользователя</button>
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
          <ReviewCard item={media[0]} />
          <ReviewCard item={media[1]} />
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
        {media.filter((item) => item.section === "films").slice(0, 4).map((item) => (
          <PosterCard key={item.id} item={item} favorite />
        ))}
      </div>
      <div className="mb-5 text-2xl font-medium text-zinc-100">актёры</div>
      <div className="mb-8 grid grid-cols-4 gap-8">
        {actors.map((person) => (
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
        <ReviewCard item={media[0]} />
        <ReviewCard item={media[1]} />
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
            <Input placeholder="Введите почту" className="mb-2 h-10 w-full rounded-md border border-zinc-700 bg-zinc-700 px-3 text-sm text-white placeholder:text-zinc-300 outline-none" />
            <Button onClick={onEnter} className="mb-2 h-10 w-full rounded-md bg-zinc-600 text-sm text-zinc-100 hover:bg-zinc-500">продолжить</Button>
            <Button className="h-10 w-full rounded-md bg-zinc-600 text-sm text-zinc-100 hover:bg-zinc-500">зарегистрироваться</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([1, 2, 4, 5, 7]);
  const [selectedMovie, setSelectedMovie] = useState(media[0]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return media;
    return media.filter((item) => item.title.toLowerCase().includes(q));
  }, [search]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const openMovie = (item: (typeof media)[0]) => {
    setSelectedMovie(item);
    setCurrentPage("movie");
  };

  if (currentPage === "login") {
    return <LoginPage onEnter={() => setCurrentPage("home")} />;
  }

  return (
    <AppShell search={search} setSearch={setSearch} currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {currentPage === "home" && <HomePage favorites={favorites} onToggleFavorite={toggleFavorite} onOpen={openMovie} />}
      {currentPage === "filters" && (
        <CatalogPage
          title="фильмы"
          items={filteredItems.filter((item) => item.section === "films")}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onOpen={openMovie}
        />
      )}
      {currentPage === "series" && (
        <CatalogPage
          title="сериалы"
          items={filteredItems.filter((item) => item.section === "series")}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onOpen={openMovie}
        />
      )}
      {currentPage === "movie" && (
        <MoviePage
          item={selectedMovie}
          favorite={favorites.includes(selectedMovie.id)}
          onToggleFavorite={toggleFavorite}
          onBack={() => setCurrentPage("home")}
        />
      )}
      {currentPage === "profile" && <ProfilePage setCurrentPage={setCurrentPage} />}
      {currentPage === "other-profile" && <OtherProfilePage />}
      {currentPage === "preferences" && <PreferencesPage />}
      {currentPage === "reviews" && <ReviewsPage onBack={() => setCurrentPage("profile")} />}
    </AppShell>
  );
}