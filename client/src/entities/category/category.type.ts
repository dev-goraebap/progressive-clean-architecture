import { ListResult } from "pocketbase";


export type CategoryModel = {
    id: string;
    name: string;
}

export type CategoryState = ListResult<CategoryModel> & {
    loaded: boolean;
    error: string | null;
};