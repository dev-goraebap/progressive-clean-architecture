export type CategoryEntity = {
    id: string;
    name: string;
}

export type CategoryState = {
    loaded: boolean;
    count: number;
    categories: CategoryEntity[];
    error: null|string;
}