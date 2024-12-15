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