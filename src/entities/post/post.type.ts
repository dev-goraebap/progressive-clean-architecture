export type PostEntity = {
    id: string;
    url: string;
    title: string;
    description: string;
    thumbnail: string;
    createdAt: Date;
    userId: string;
}

export type AddPostDTO = Pick<PostEntity, 'url' | 'title' | 'description' | 'thumbnail'>;