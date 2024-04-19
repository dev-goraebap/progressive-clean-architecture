import { Observable } from "rxjs";

import { AddPostDTO } from "../post.type";

export interface PostApi {
    add(dto: AddPostDTO): Observable<any>;
}