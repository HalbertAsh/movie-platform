import { useCallback, useEffect, useMemo, useState } from 'react';
import { Context } from './context';
import type { Page } from './context';
import { avatars, INITIAL_REVIEWS } from './data';
import type { Draft, Preference, RatingEntry, Review, User } from './data/types';
import { usePersistentState } from './usePersistentState';
import { Shell } from './components/Shell';
import { Home, Catalog, Search, MoviePage } from './pages/Movies';
import { Profile, EditProfile, PublicAuthor } from './pages/Profiles';
import { Auth, Studio } from './pages/Accounts';

const INITIAL_USER:User={nickname:'NADYA',bio:'Люблю медленное кино, психологические триллеры и фильмы, после которых хочется обсуждать увиденное.',avatar:avatars[0],joined:'сентябрь 2026',points:1800};
const INITIAL_PREFS:Preference={movies:[0,1,2,3,4],directors:[0,1,2,3,4],actors:[0,1,2,3,4]};
export default function App(){
  const [page,setPage]=useState<Page>('home');
  const [movieId,setMovieId]=useState(0);
  const [authorName,setAuthorName]=useState('Дени Вильнёв');
  const [publicUser,setPublicUser]=useState('frames.by.ira');
  const [query,setQuery]=useState('');
  const [searchTab,setSearchTab]=useState('all');
  const [logged,setLogged]=usePersistentState('echo-react:logged',false);
  const [authorLogged,setAuthorLogged]=usePersistentState('echo-react:author-logged',false);
  const [authMode,setAuthMode]=useState<'login'|'register'>('login');
  const [user,setUser]=usePersistentState<User>('echo-react:user',INITIAL_USER);
  const [prefs,setPrefs]=usePersistentState<Preference>('echo-react:prefs',INITIAL_PREFS);
  const [authorPrefs,setAuthorPrefs]=usePersistentState<number[]>('echo-react:author-prefs',[0,1,2]);
  const [reviews,setReviews]=usePersistentState<Review[]>('echo-react:reviews',INITIAL_REVIEWS);
  const [ratings,setRatings]=usePersistentState<RatingEntry[]>('echo-react:ratings',[]);
  const [drafts,setDrafts]=usePersistentState<Record<number,Draft>>('echo-react:drafts',{});
  const [pendingMovie,setPendingMovie]=usePersistentState<number|null>('echo-react:pending-movie',null);
  const [likedReviews,setLikedReviews]=usePersistentState<number[]>('echo-react:liked-reviews',[]);
  const [likedComments,setLikedComments]=usePersistentState<number[]>('echo-react:liked-comments',[]);
  const [notice,setNotice]=useState('');
  const [modal,setModal]=useState<string|null>(null);
  const [studioPage,setStudioPage]=useState('dashboard');
  const navigate=useCallback((p:Page)=>{setPage(p);window.scrollTo({top:0,behavior:'instant'});},[]);
  const openMovie=useCallback((id:number)=>{setMovieId(id);navigate('movie');},[navigate]);
  const openAuthor=useCallback((name:string)=>{setAuthorName(name);navigate('author');},[navigate]);
  const openUser=useCallback((name:string)=>{setPublicUser(name);navigate('publicProfile');},[navigate]);
  const toggleReviewLike=(id:number)=>setLikedReviews(s=>s.includes(id)?s.filter(v=>v!==id):[...s,id]);
  const toggleCommentLike=(id:number)=>setLikedComments(s=>s.includes(id)?s.filter(v=>v!==id):[...s,id]);
  const showNotice=(s:string)=>setNotice(s);
  useEffect(()=>{if(!notice)return;const t=window.setTimeout(()=>setNotice(''),3500);return()=>window.clearTimeout(t);},[notice]);
  const context=useMemo(()=>({page,navigate,movieId,openMovie,authorName,openAuthor,publicUser,openUser,query,setQuery,searchTab,setSearchTab,logged,setLogged,authorLogged,setAuthorLogged,authMode,setAuthMode,user,setUser,prefs,setPrefs,authorPrefs,setAuthorPrefs,reviews,setReviews,ratings,setRatings,drafts,setDrafts,pendingMovie,setPendingMovie,likedReviews,toggleReviewLike,likedComments,toggleCommentLike,notice,showNotice,modal,setModal,studioPage,setStudioPage}),[page,navigate,movieId,openMovie,authorName,openAuthor,publicUser,openUser,query,searchTab,logged,authorLogged,authMode,user,prefs,authorPrefs,reviews,ratings,drafts,pendingMovie,likedReviews,likedComments,notice,modal,studioPage]);
  return <Context.Provider value={context}>
    {page==='auth'?<Auth author={false}/>:page==='authorAuth'?<Auth author/>:page==='studio'?<Studio/>:<Shell>
      {page==='home'&&<Home/>}
      {page==='catalog'&&<Catalog/>}
      {page==='search'&&<Search/>}
      {page==='movie'&&<MoviePage key={movieId}/>}
      {page==='profile'&&<Profile own/>}
      {page==='publicProfile'&&<Profile own={false}/>}
      {page==='author'&&<PublicAuthor/>}
      {page==='edit'&&<EditProfile/>}
    </Shell>}
    {notice&&<div className="react-toast" role="status">{notice}</div>}
    {modal==='status'&&<StatusModal onClose={()=>setModal(null)}/>}
  </Context.Provider>;
}
function StatusModal({onClose}:{onClose:()=>void}){
  const {user}=useEchoInner();
  return <div className="overlay" onMouseDown={onClose}><div className="modal status-modal" onMouseDown={e=>e.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">Статус на платформе</span><h2>Лестница статусов</h2></div><button onClick={onClose} aria-label="Закрыть">×</button></div><div className="level-ladder">{[0,500,1500,3000,5000,8000].map((t,i)=><div className={`fly-card ${user.points>=t?'active':'locked'}`} key={t}><div className="react-level-dot"/><div><strong>{['Искра','Мята','Лазурь','Аметист','Рубин','Полярный'][i]}</strong><span>От {t.toLocaleString('ru-RU')} баллов</span></div><b>{user.points>=t?'✓':''}</b></div>)}</div><h3>Как получать баллы</h3><p>Рецензия +100 · Оценка +10 · Полученный лайк +3 · Лайк автора +500</p></div></div>;
}
import { useEcho as useEchoInner } from './context';
