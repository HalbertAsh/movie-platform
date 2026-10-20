export type RatingKind = 'reviews' | 'ratings' | 'critics';
export type Score = { total: number | null; parts: number[] };
export type ScoreSets = Record<RatingKind, Score>;
export type AuthorComment = { title?: string; author: string; role: string; avatar: string; text: string; likes: number; date: string };
export type Movie = { id: number; title: string; year: number; genre: string; director: string; country: string; poster: string; desc: string; reviews: number; ratings: number; preferred: number; total: number; parts: number[]; authorComment: AuthorComment | null; scoreSets: ScoreSets };
export type Review = { id: number; movieId: number; user: string; avatar: string; status: string; kind: string; total: number; parts: number[]; title: string; text: string; likes: number; date: string; spoiler: boolean; popular: number; moderation?: 'pending' | 'approved' };
export type Work = { id: string; title: string; year: number; genre: string; director: string; role: string; poster: string; reviews: number; ratings: number; popularity: number; scores: Record<RatingKind, number> };
export type AuthorProfile = { image: string; specialty: string; verified: boolean; authorRatings: number; comments: number; preferred: number; authorLikes?: number; scores: Record<RatingKind, number>; works: Work[] };
export type Preference = { movies: number[]; directors: number[]; actors: number[] };
export type Draft = { title: string; text: string; parts: number[]; spoiler: boolean };
export type User = { nickname: string; bio: string; avatar: string; joined: string; points: number };

export type RatingEntry = {id:number;movieId:number;user:string;total:number;parts:number[];date:string;moderation:'pending'|'approved'};
