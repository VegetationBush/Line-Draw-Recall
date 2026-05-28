export interface LeaderboardEntry {
    name: string,
    score: number,
}
export interface LeaderboardResponse {
    entries: LeaderboardEntry[],
    lastUpdated: number,
}