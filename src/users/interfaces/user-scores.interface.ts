export interface UserScore {
    name: string;
    scores: number;
  }
  
  export interface UserScoresResponse {
    users: UserScore[];
    totalPages: number;
  }