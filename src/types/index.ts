export interface userJwtPayload {
    _id: string;
    email: string;
}
export interface IUser extends Document {
    _id: string;
    email: string;
    password?: string;
    name?: string;
    loginType?: string;
    matchPassword(password: string): Promise<boolean>;
    generateToken(): string;
    creditsUsed: number;
}

export interface IVideoDetails {
    _id: string;
    title: string;
    duration: string | number;
    channelName: string;
    thumbnailUrl: string;
    publishedAt: string;
    youtubeId: string;
    libraryId: string;
    summary: string;
    status: "watched" | "to_watch" | "in_progress";
    isStandalone: boolean;
    isStarred: boolean;
    playlistId: string;
}

export interface ILibrary extends Document {
    _id: string;
    userId: string;
    videoId: string;
    type: "standalone" | "playlist_entry";
    playlistId: string;
    userNotes: string[];
    watchProgress: IWatchProgress;
    tags: string[];
    status: "watched" | "to_watch" | "in_progress";
    rating: number;
    addedAt: Date;
    lastUpdated: Date;
    isStarred: boolean;
    videoDetails: IVideoDetails;
    playlistDetails: IPlaylist;
}

export interface IUserNote extends Document {
    _id: string;
    libraryId: string;
    timestamp: number;
    title: string;
    text: string;
    createdAt: Date;
}

export interface IWatchProgress{
    lastWatchedTimestamp: number;
    percentageWatched: number;
}

export interface IPlaylist extends Document {
    _id: string;
    userId: string;
    name: string;
    description: string;
    coverPicture: string;
    tags: string[];
    videoCount: number;
    videos: IVideoDetails[];
    createdAt: Date;
    updatedAt: Date;
}

