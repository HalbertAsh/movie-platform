import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Heart, Info } from 'lucide-react';
import { useEcho } from '../context';
import { CREW, MOVIES, PARAM_INFO, PARAM_NAMES, avatars, calcReviewTotal, fmt } from '../data';
import type { Draft, Movie, Review } from '../data/types';
import { Empty, MovieRow, Poster, ReviewCard, ScoreTriplet } from '../components/UI';

function Reviews({list,context}:{list:Review[];context:'home'|'release'|'profile'}){
 const {openMovie,openUser,likedReviews,toggleReviewLike}=useEcho();
 const [expanded,setExpanded]=useState<number[]>([]);const [shown,setShown]=useState<number[]>([]);
 return <div className={context==='home'?'reviews-grid react-reviews-grid':'review-list'}>{list.map(r=><ReviewCard key={r.id} review={r} context={context} expanded={expanded.includes(r.id)} onExpand={()=>setExpanded(s=>s.includes(r.id)?s.filter(x=>x!==r.id):[...s,r.id])} spoilerShown={shown.includes(r.id)} onSpoiler={()=>setShown(s=>[...s,r.id])} liked={likedReviews.includes(r.id)} onLike={()=>toggleReviewLike(r.id)} onMovie={openMovie} onUser={openUser}/>)}</div>;
}
export {Reviews};
function Comment({movie}:{movie:Movie}){
 const {openMovie,openAuthor,likedComments,toggleCommentLike}=useEcho();const c=movie.authorComment;if(!c)return null;
 const liked=likedComments.includes(movie.id);
 return <article className="comment-card"><button className="react-review-film-inline" onClick={()=>openMovie(movie.id)}><img src={movie.poster} alt=""/><span><strong>{movie.title}</strong><small>{movie.year} · {movie.director}</small></span></button><button className="person" onClick={()=>openAuthor(c.author)}><img src={c.avatar} alt=""/><span><strong>{c.author}</strong><small>{c.role}</small></span></button><h3>{c.title}</h3><p>{c.text}</p><footer className="react-review-footer"><button className={`react-like ${liked?'is-liked':''}`} onClick={()=>toggleCommentLike(movie.id)}>♥ {fmt(c.likes+(liked?1:0))}</button><span>{c.date}</span></footer></article>;
}
export function Home(){
 const {navigate,openMovie,reviews}=useEcho();
 return <main className="page"><section className="hero"><div className="hero-copy"><span className="eyebrow">Кино как разговор</span><h1>Смотри внимательнее.<br/><em>Говори точнее.</em></h1><p>Рецензии, оценки и авторские комментарии, которые помогают увидеть в кино больше.</p><div className="react-actions"><button className="btn primary" onClick={()=>navigate('catalog')}>Исследовать фильмы</button><button className="btn ghost" onClick={()=>document.getElementById('home-discussions')?.scrollIntoView({behavior:'smooth'})}>Читать рецензии</button></div></div><div className="hero-visual"><div className="react-orbit-logo"><img src="./echo-mark.png" alt="Эхо"/></div></div></section>
 <section className="section" id="home-discussions"><div className="section-head"><h2>Сейчас обсуждают</h2></div><Reviews list={reviews.slice(0,3)} context="home"/></section>
 <section className="section"><div className="section-head"><h2>Популярное</h2><button className="quiet" onClick={()=>navigate('catalog')}>Весь каталог →</button></div><div className="poster-row">{MOVIES.map(m=><Poster key={m.id} movie={m} onClick={()=>openMovie(m.id)}/>)}</div></section>
 <section className="section"><div className="section-head"><h2>Последние авторские комментарии</h2></div><div className="comment-grid">{MOVIES.filter(m=>m.authorComment).map(m=><Comment key={m.id} movie={m}/>)}</div></section>
 </main>;
}
export function Catalog(){
 const {openMovie}=useEcho();const [genre,setGenre]=useState('Все'),[year,setYear]=useState('Все'),[country,setCountry]=useState('Все'),[sort,setSort]=useState('Лучшие');
 const years=[...new Set(MOVIES.map(m=>m.year))].sort((a,b)=>b-a).map(String);
 const countries=[...new Set(MOVIES.flatMap(m=>m.country.split(', ')))];
 const films=useMemo(()=>MOVIES.filter(m=>(genre==='Все'||m.genre===genre)&&(year==='Все'||String(m.year)===year)&&(country==='Все'||m.country.split(', ').includes(country))).sort((a,b)=>sort==='Лучшие'?(b.scoreSets.reviews.total??0)-(a.scoreSets.reviews.total??0):b.year-a.year),[genre,year,country,sort]);
 return <main className="page"><div className="catalog-head"><div><span className="eyebrow">Каталог</span><h1>Фильмы</h1></div><div className="filters">{([['Жанр',genre,setGenre,['Все',...new Set(MOVIES.map(m=>m.genre))]],['Год',year,setYear,['Все',...years]],['Страна',country,setCountry,['Все',...countries]],['Сортировка',sort,setSort,['Лучшие','Новые']]] as [string,string,(v:string)=>void,string[]][]).map(([label,value,set,options])=><label className="react-filter" key={label}><span>{label}</span><select value={value} onChange={e=>set(e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select></label>)}</div></div><p className="react-found">Найдено: {films.length}</p><div className="react-movie-list">{films.map(m=><MovieRow key={m.id} movie={m} onClick={()=>openMovie(m.id)}/>)}</div>{!films.length&&<Empty>По выбранным фильтрам фильмы не найдены.</Empty>}</main>;
}
export function Search(){
 const {query,searchTab,setSearchTab,openMovie,openAuthor,openUser}=useEcho();
 const q=query.trim().toLocaleLowerCase('ru');
 const movies=MOVIES.filter(m=>q&&(m.title+' '+m.genre+' '+m.director+' '+m.country).toLocaleLowerCase('ru').includes(q));
 const people=[{name:'frames.by.ira',role:'Пользователь · Наблюдатель',img:avatars[2],type:'user'},{name:'NADYA',role:'Пользователь · Лазурь',img:avatars[0],type:'user'},{name:'CINEMA//NOW',role:'Медиа',img:avatars[1],type:'user'},...Object.keys(CREW).flatMap(()=>[] as {name:string;role:string;img:string;type:string}[]),...Object.entries({ 'Дени Вильнёв':avatars[3],'Кристофер Нолан':avatars[1],'Тимоти Шаламе':avatars[4],'Зендея':avatars[2]}).map(([name,img])=>({name,role:'Автор',img,type:'author'}))].filter(p=>q&&p.name.toLocaleLowerCase('ru').includes(q));
 return <main className="page"><div className="catalog-head"><div><span className="eyebrow">Поиск</span><h1>{q?`Результаты для «${query}»`:'Начните вводить запрос'}</h1></div><div className="tabs">{[['all','Все'],['films','Фильмы'],['people','Люди']].map(([v,l])=><button className={searchTab===v?'active':''} key={v} onClick={()=>setSearchTab(v)}>{l}</button>)}</div></div><p className="react-found">Найдено: {(searchTab==='people'?0:movies.length)+(searchTab==='films'?0:people.length)}</p>
 {(searchTab==='all'||searchTab==='films')&&<div className="react-movie-list">{movies.map(m=><MovieRow key={m.id} movie={m} onClick={()=>openMovie(m.id)}/>)}</div>}
 {(searchTab==='all'||searchTab==='people')&&<div className="react-search-people">{people.map(p=><button key={p.name} className="react-person-result" onClick={()=>p.type==='author'?openAuthor(p.name):openUser(p.name)}><img src={p.img} alt=""/><span><strong>{p.name}</strong><small>{p.role}</small></span><ArrowRight size={18}/></button>)}</div>}
 {q&&!movies.length&&!people.length&&<Empty>Ничего не найдено. Попробуйте другой запрос.</Empty>}
 </main>;
}
export function MoviePage(){
 const {movieId,openAuthor,openMovie,likedComments,toggleCommentLike,reviews}=useEcho();const m=MOVIES.find(x=>x.id===movieId)??MOVIES[0];
 const [crewTab,setCrewTab]=useState<'actors'|'team'>('actors');const [sort,setSort]=useState('Новые');const track=useRef<HTMLDivElement>(null);
 const filmReviews=reviews.filter(r=>r.movieId===m.id).sort((a,b)=>sort==='Популярные'?b.likes-a.likes:sort==='Старые'?a.id-b.id:b.id-a.id);
 return <main className="page"><section className="react-movie-hero"><img className="react-film-poster" src={m.poster} alt={`Постер фильма ${m.title}`}/><div className="react-film-main"><div className="react-film-title"><span className="eyebrow">Фильм · {m.year}</span><h1>{m.title}</h1><p className="movie-description">{m.desc}</p><span className="react-preferred"><Heart size={16}/> {fmt(m.preferred)} в предпочтениях</span></div><div className="react-film-fields">{[['Год',m.year],['Жанр',m.genre],['Страна',m.country],['Режиссёр',m.director]].map(([label,value])=><div className="react-film-field" key={label}><span>{label}</span>{label==='Режиссёр'?<button className="quiet" onClick={()=>openAuthor(m.director)}>{value}</button>:<strong>{value}</strong>}</div>)}</div><div className="react-main-rating"><strong>{m.scoreSets.reviews.total??'—'}</strong><div><b>Итоговая оценка</b><small>Средний итог по рецензиям</small></div></div><ScoreTriplet scores={m.scoreSets} full/><details className="react-parameter-details"><summary>Пять параметров оценки <span>Шкала 1–10 ⌄</span></summary><div className="react-parameter-groups">{(['reviews','ratings','critics'] as const).map(k=><div className={`react-param-group rating-${k}`} key={k}><strong>{{reviews:'По рецензиям',ratings:'Без рецензий',critics:'Медиа / критики'}[k]}</strong><div className="react-param-pills">{m.scoreSets[k].parts.map((v,i)=><span key={i} className={i===4?'impression':''} data-param-label={PARAM_NAMES[i]} tabIndex={0}>{v}</span>)}</div></div>)}</div></details></div></section>
 <section className="section"><div className="section-head"><h2>Съёмочная группа</h2><div className="react-actions"><div className="tabs"><button className={crewTab==='actors'?'active':''} onClick={()=>setCrewTab('actors')}>Актёры</button><button className={crewTab==='team'?'active':''} onClick={()=>setCrewTab('team')}>Команда</button></div><button className="slider-btn" onClick={()=>track.current?.scrollBy({left:-450,behavior:'smooth'})} aria-label="Назад"><ArrowLeft size={18}/></button><button className="slider-btn" onClick={()=>track.current?.scrollBy({left:450,behavior:'smooth'})} aria-label="Вперёд"><ArrowRight size={18}/></button></div></div><div className="crew-track" ref={track}>{CREW[crewTab].map(([name,role,img])=><button className="crew-card" key={name} onClick={()=>openAuthor(name)}><img src={img} alt=""/><strong>{name}</strong><span>{role}</span></button>)}</div></section>
 {m.authorComment&&<section className="author-note"><div className="author-note-head"><div><span>АВТОРСКИЙ КОММЕНТАРИЙ</span><h3>{m.authorComment.title}</h3></div></div><button className="quiet" onClick={()=>openAuthor(m.authorComment!.author)}>{m.authorComment.author} · {m.authorComment.role}</button><p>{m.authorComment.text}</p><footer><button className={`react-like ${likedComments.includes(m.id)?'is-liked':''}`} onClick={()=>toggleCommentLike(m.id)}>♥ {fmt(m.authorComment.likes+(likedComments.includes(m.id)?1:0))}</button><span>{m.authorComment.date}</span></footer></section>}
 <Composer key={m.id} movie={m}/>
 <section className="section reading"><div className="toolbar"><h2>Рецензии</h2><label className="react-filter"><span>Сортировка</span><select value={sort} onChange={e=>setSort(e.target.value)}>{['Новые','Популярные','Старые'].map(s=><option key={s}>{s}</option>)}</select></label></div>{filmReviews.length?<Reviews list={filmReviews} context="release"/>:<Empty>На этот фильм пока нет рецензий.</Empty>}</section>
 <section className="section"><button className="quiet" onClick={()=>openMovie((m.id+1)%MOVIES.length)}>Следующий фильм →</button></section></main>;
}
const blank:Draft={title:'',text:'',parts:[5,5,5,5,5],spoiler:false};
function Composer({movie}:{movie:Movie}){
 const {logged,navigate,drafts,setDrafts,setPendingMovie,setReviews,setRatings,user,showNotice}=useEcho();
 const draft=drafts[movie.id]??blank;
 const [confirm,setConfirm]=useState(false);
 const total=calcReviewTotal(draft.parts);
 const setDraft=(patch:Partial<Draft>)=>setDrafts(s=>({...s,[movie.id]:{...blank,...(s[movie.id]??{}),...patch}}));
 const submit=()=>{
   if(!logged){setPendingMovie(movie.id);navigate('auth');showNotice('Черновик сохранён. После входа вернём вас к фильму.');return;}
   if(!draft.text.trim()){setConfirm(true);return;}
   if(draft.text.trim().length<150){showNotice('Для рецензии нужно не менее 150 символов.');return;}
   if(!draft.title.trim()){showNotice('Добавьте заголовок рецензии.');return;}
   setConfirm(true);
 };
 const publish=()=>{
   const hasText=!!draft.text.trim();
   const r:Review={id:Date.now(),movieId:movie.id,user:user.nickname,avatar:user.avatar,status:'Лазурь',kind:'user',total,parts:[...draft.parts],title:hasText?draft.title.trim():'Оценка без рецензии',text:hasText?draft.text.trim():'Пользователь оставил оценку без текстовой рецензии.',likes:0,date:new Date().toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'}),spoiler:draft.spoiler,popular:0,moderation:'pending'};
   if(hasText){setReviews(s=>[r,...s]);}else{setRatings(s=>[{id:r.id,movieId:r.movieId,user:r.user,total:r.total,parts:r.parts,date:r.date,moderation:'pending'},...s]);}
   setDrafts(s=>{const next={...s};delete next[movie.id];return next});setConfirm(false);showNotice('Отправлено. Материал ожидает модерации.');
 };
 return <section className="panel composer" id="reviewComposer"><div className="composer-head"><div><span className="eyebrow">Ваше мнение</span><h2>Написать рецензию</h2></div><div className="rules"><strong>Правила публикации</strong><ul><li>От 150 до 10 000 символов</li><li>Без оскорблений и нецензурной лексики</li><li>Спойлеры отмечаются</li></ul></div></div>
 <div className="parameters">{PARAM_NAMES.map((name,i)=><label className={`parameter ${i===4?'impression':''}`} key={name}><span>{name} <span className="react-info" data-param-label={PARAM_INFO[i]} tabIndex={0}><Info size={15}/></span></span><b>{draft.parts[i]}</b><input type="range" min="1" max="10" value={draft.parts[i]} onChange={e=>setDraft({parts:draft.parts.map((v,j)=>j===i?Number(e.target.value):v)})}/></label>)}</div>
 <div className="react-composer-total"><span>Итоговый балл</span><strong>{total}</strong><small>По пяти параметрам</small></div>
 <label className="field"><span>Заголовок</span><input value={draft.title} maxLength={140} onChange={e=>setDraft({title:e.target.value})} placeholder="О чём ваша рецензия?"/></label>
 <label className="field"><span>Содержание</span><textarea id="reviewText" value={draft.text} maxLength={10000} onChange={e=>setDraft({text:e.target.value})} placeholder="Расскажите, что вы почувствовали и заметили в фильме..."/><small className={draft.text.length>0&&draft.text.length<150?'bad':''}>{draft.text.length} / 10 000 символов</small></label>
 <div className="react-composer-bottom"><label className="react-check"><input type="checkbox" checked={draft.spoiler} onChange={e=>setDraft({spoiler:e.target.checked})}/> В рецензии есть спойлеры</label><div className="react-actions"><button className="btn ghost" onClick={()=>setDrafts(s=>{const next={...s};delete next[movie.id];return next})}>Отмена</button><button className="btn primary" onClick={submit}>{draft.text.trim()?'Отправить рецензию':'Сохранить оценку'}</button></div></div>
 {confirm&&<div className="overlay" onMouseDown={()=>setConfirm(false)}><div className="modal react-confirm" onMouseDown={e=>e.stopPropagation()}><h2>{draft.text.trim()?'Отправить рецензию?':'Сохранить оценку без рецензии?'}</h2><p>Итоговый балл: <strong>{total}</strong>. После отправки материал ожидает модерации.</p><div className="react-actions"><button className="btn ghost" onClick={()=>setConfirm(false)}>Отмена</button><button className="btn primary" onClick={publish}>Подтвердить</button></div></div></div>}
 </section>;
}
