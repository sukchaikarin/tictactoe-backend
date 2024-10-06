export interface UserMaxWinsStreak {
    name: string;
    maxWinsStreak: number;
}

export interface UserMaxWinsStreakResponse {
    users: UserMaxWinsStreak[];
    totalPages: number;
}