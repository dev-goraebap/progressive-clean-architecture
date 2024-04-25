import { ListResult } from "pocketbase";

export type PostModel = {
    id: string;
    url: string;
    title: string;
    description: string;
    thumbnail: string;
    createdAt: Date;
    userId: string;
}

export type PostState = ListResult<PostModel> & {
    loaded: boolean;
    error: string | null;
}

export type AddPostDTO = {
    url: string;
    title: string;
    description: string;
    thumbnail: string;
    categoryIds: string[];
}