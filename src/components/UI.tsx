import type { ReactNode, CSSProperties } from 'react';
import { FIREFLIES, MOVIES, PARAM_NAMES, fmt } from '../data';
import type { Movie, RatingKind, Review, ScoreSets } from '../data/types';

export function Firefly({ level=3, size=25 }: {level?:number;size?:number}) {
  const f=FIREFLIES[Math.max(0,Math.min(5,level-1))];
  return <span className="firefly" style={{'--fly':f.color,'--glow':f.glow,width:size,height:size} as CSSProperties}><span className="wing l"/><span className="wing r"/><span className="body"/></span>;
}
export function Rating({ total, parts=[], kind='reviews', large=false }: {total:number|null;parts?:number[];kind?:RatingKind;large?:boolean}) {
  return <div className={`rating-badge rating-${kind} ${large?'rating-large':''} ${total===null?'rating-empty':''}`}><strong className="rating-total">{total??'—'}</strong>{parts.length>0?<span className="rating-parts">{parts.map((v,i)=><i key={i} className={i===4?'impression':''} data-param-label={PARAM_NAMES[i]} tabIndex={0}>{v}</i>)}</span>:<span className="rating-empty-text">Нет оценок</span>}</div>;
}
export const RATING_LABELS: [RatingKind,string][]=[['reviews','По рецензиям'],['ratings','Без рецензий'],['critics','Медиа / критики']];
export function ScoreTriplet({scores,full=false}:{scores:ScoreSets;full?:boolean}) {
  return <div className={full?'react-score-triplet full':'react-score-triplet'}>{RATING_LABELS.map(([kind,label])=><div className="score-group" key={kind}><span>{label}</span><Rating total={scores[kind].total} parts={full?scores[kind].parts:[]} kind={kind} large={full}/></div>)}</div>;
}
export function Poster({movie,onClick}:{movie:Movie;onClick:()=>void}) {
  return <button className="poster popular-poster" onClick={onClick}><div className="react-poster-image"><img src={movie.poster} alt={`Постер: ${movie.title}`}/><div className="react-poster-scores">{RATING_LABELS.map(([kind,label])=><span className={`react-poster-score rating-${kind}`} key={kind} title={label}><b>{movie.scoreSets[kind].total??'—'}</b></span>)}</div></div><strong>{movie.title}</strong><span>{movie.year} · {movie.director}</span></button>;
}
export function MovieRow({movie,onClick}:{movie:Movie;onClick:()=>void}) {
  return <article className="movie-row echo-movie-row react-movie-row"><button className="react-movie-row-main" onClick={onClick}><img className="echo-movie-row-poster" src={movie.poster} alt=""/><div className="movie-copy"><h3>{movie.title}</h3><p>{movie.year} · {movie.genre} · {movie.director}</p><p className="movie-copy-desc">{movie.desc}</p><span className="movie-counts">{fmt(movie.reviews)} рецензий · {fmt(movie.ratings)} оценок</span></div></button><div className="movie-scores">{RATING_LABELS.map(([kind,label])=><div className={`compact-score echo-score-tile rating-${kind}`} key={kind} title={label}><strong>{movie.scoreSets[kind].total??'—'}</strong><span className="echo-score-label">{label}</span></div>)}</div></article>;
}
export function Empty({children}:{children:ReactNode}){return <div className="react-empty">{children}</div>}
export function ReviewCard({review,context='release',expanded,onExpand,spoilerShown,onSpoiler,liked,onLike,onMovie,onUser}:{review:Review;context?:'release'|'home'|'profile';expanded:boolean;onExpand:()=>void;spoilerShown:boolean;onSpoiler:()=>void;liked:boolean;onLike:()=>void;onMovie:(id:number)=>void;onUser:(name:string)=>void}){
  const movie=MOVIES.find(m=>m.id===review.movieId)??MOVIES[0];
  const long=review.text.length>160;
  const profile=context==='profile';
  return <article className={`review ${profile?'profile-review':''} ${context==='home'?'review-home':''} ${expanded?'react-review-expanded':''}`}>
    <div className="react-review-header">
      {profile?<button className="react-review-film" onClick={()=>onMovie(movie.id)}><img src={movie.poster} alt=""/><span><strong>{movie.title}</strong><small>{movie.year} · {movie.director}</small></span></button>:<button className="person" onClick={()=>onUser(review.user)}><img src={review.avatar} alt=""/><span><strong>{review.user}</strong><small style={{color:review.kind==='media'?'var(--cyan)':'var(--violet)'}}>{review.status}</small></span></button>}
      <Rating total={review.total} parts={review.parts} kind="reviews"/>
    </div>
    {!profile&&<button className="react-review-film-inline" onClick={()=>onMovie(movie.id)}><img src={movie.poster} alt=""/><span><strong>{movie.title}</strong><small>{movie.year} · {movie.director}</small></span></button>}
    <h3>{review.title}</h3>
    {review.spoiler&&!spoilerShown?<div className="react-spoiler"><b>Содержит спойлеры</b><button className="quiet" onClick={onSpoiler}>Показать рецензию</button></div>:<>
      <div className={`review-copy ${!expanded&&long?'is-collapsed':''}`} style={!expanded&&long?{maxHeight:'min(25vh,170px)',overflow:'hidden'}:undefined}><p className="review-text">{review.text}</p></div>
      {long&&<button className="expand-btn" onClick={onExpand}>{expanded?'Свернуть':'Читать полностью'}</button>}
    </>}
    <footer className="react-review-footer"><button className={`react-like ${liked?'is-liked':''}`} onClick={onLike} aria-pressed={liked}>♥ {fmt(review.likes+(liked?1:0))}</button><span>{review.moderation==='pending'?'Ожидает модерации · ':''}{review.date}</span></footer>
  </article>;
}
