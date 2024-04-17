import { Component } from "@angular/core";

import { AddPostForm } from "src/features";

@Component({
    selector: 'feed-page',
    standalone: true,
    imports: [
        AddPostForm
    ],
    template: `
    <div>
        <h2>피드 페이지</h2>
        <add-post-form />
    </div>
    `
})
export class FeedPage {

    constructor() { }
}