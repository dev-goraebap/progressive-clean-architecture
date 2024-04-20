import PocketBase from 'pocketbase';

let _instance: PocketBase;

export const pocketBaseClient = (): PocketBase => {
    if (!_instance) {
        throw new Error('PocketBaseClient is not initialized 😅');
    }
    return _instance;
}

export const pocketBaseInitialize = () => {
    console.info('Initializing PocketBaseClient... ⚗️');
    _instance = new PocketBase('http://127.0.0.1:8090');
}