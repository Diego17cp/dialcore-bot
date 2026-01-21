export interface GitHubUser {
    login: string;
    html_url: string;
    avatar_url: string;
    name: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
}
export interface GitHubRepo {
    name: string;
    full_name: string;
    html_url: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    fork: boolean;
}
export interface GitHubEvent {
    type: string;
    created_at: string;
}
export interface DevStats {
    languages: Record<string, number>;
    commits90d: number;
    activeDays: number;
    repos: GitHubRepo[];
    devScore?: string;
}