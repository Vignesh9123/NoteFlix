import { NextRequest, NextResponse } from "next/server";
import {authMiddleware} from "@/middleware/auth.middleware";
import Playlist from "@/models/playlist.model";
import Library from "@/models/library.model";
import connectDB from "@/dbConfig/connectDB";
connectDB();

export async function POST(request: NextRequest){
    try {
        const auth = await authMiddleware(request);
        if(auth.status == 401) return NextResponse.json({message: "Unauthorized"}, {status: 401});
        const {name, description, isPublic, coverPicture, tags} = await request.json();
        if(!name) return NextResponse.json({message: "Invalid request"}, {status: 400});
        const playlist = await Playlist.create({name, description, isPublic, coverPicture, tags,userId: request.user?._id});
        return NextResponse.json({data: playlist}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});

    }
}

export async function PATCH(request: NextRequest){
    try {
        const auth = await authMiddleware(request);
        if(auth.status == 401) return NextResponse.json({message: "Unauthorized"}, {status: 401});
        const {id, name, description, isPublic, coverPicture, tags} = await request.json();
        const playlist = await Playlist.findById(id)
        if(!playlist) return NextResponse.json({message: "Playlist not found"}, {status: 404});
        if(playlist?.userId.toString() != request.user?._id.toString()) return NextResponse.json({message: "Unauthorized"}, {status: 401});
        playlist.name = name || playlist.name;
        playlist.description = description || playlist.description;
        playlist.isPublic = isPublic !== undefined ? isPublic : playlist.isPublic;
        playlist.coverPicture = coverPicture || playlist.coverPicture;
        playlist.tags = tags || playlist.tags;
        await playlist.save();
        return NextResponse.json({data: playlist}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});

    }
}

export async function DELETE(request: NextRequest){
    try {
        const auth = await authMiddleware(request);
    if(auth.status == 401) return NextResponse.json({message: "Unauthorized"}, {status: 401});
    const {id} = await request.json();
    const playlist = await Playlist.findById(id);
    if(!playlist) return NextResponse.json({message: "Playlist not found"}, {status: 404});
    if(playlist?.userId.toString() != request.user?._id.toString()) return NextResponse.json({message: "Unauthorized"}, {status: 401});
    await Playlist.findByIdAndDelete(id);
    await Library.deleteMany({playlistId: id});
    return NextResponse.json({data: playlist}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});

    }
}



