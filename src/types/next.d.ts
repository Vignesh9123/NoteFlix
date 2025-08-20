import { IUser } from "@/types";

declare module "next/server" {
    interface NextRequest {
        user?: IUser;
    }
}
