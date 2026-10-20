import type { ReactNode } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useEcho } from '../context';
import { Firefly } from './UI';
export function Shell({children}:{children:ReactNode}){
 const {page,navigate,query,setQuery,logged}=useEcho();
 return <div className="app"><header className="topbar react-topbar">
   <button className="brand" onClick={()=>navigate('home')}><span className="brand-mark"><img src="./echo-mark.png" alt=""/></span>Эхо</button>
   <nav className="navlinks"><button className={page==='home'?'active':''} onClick={()=>navigate('home')}>Главная</button><button className={page==='catalog'?'active':''} onClick={()=>navigate('catalog')}>Каталог</button></nav>
   <label className="search-open react-search"><SearchIcon size={18}/><input value={query} placeholder="Поиск фильмов, людей и авторов" onFocus={()=>navigate('search')} onChange={e=>{setQuery(e.target.value);navigate('search')}} aria-label="Поиск"/></label>
   <button className="authors-btn" onClick={()=>navigate('authorAuth')}><span className="author-dot"/><span>Для авторов</span></button>
   <button className="account-btn" onClick={()=>navigate(logged?'profile':'auth')}>{logged?<><Firefly level={3} size={19}/><span>Профиль</span></>:<><span className="react-login-dot"/><span>Войти</span></>}</button>
 </header>{children}<footer className="site-footer"><span>Эхо — кино как разговор</span><span>Иван Зуев · Киракосян Анна · Роман Стяжкин</span><span>Рецензии · Оценки · Предпочтения · Авторы</span></footer></div>;
}
