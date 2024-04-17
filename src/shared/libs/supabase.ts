import { Injectable } from "@angular/core";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class Supabase {

    public readonly client!: SupabaseClient;

    constructor() {
        console.log('create supabase instance ⚗️');
        this.client = createClient(environment.supabase.url, environment.supabase.apiKey);
    }
}