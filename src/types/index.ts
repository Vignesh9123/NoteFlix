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
}

export interface IVideoDetails {
    title: string;
    duration: string;
    channelName: string;
    thumbnailUrl: string;
    publishedAt: string;
    youtubeId: string;
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
}

export interface IUserNote extends Document {
    _id: string;
    libraryId: string;
    timestamp: number;
    text: string;
    category: "key point" | "todo" | "question";
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

