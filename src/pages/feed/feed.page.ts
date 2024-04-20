import { Component } from "@angular/core";

import { AddPostFormWidget } from "src/widgets";

@Component({
    selector: 'feed-page',
    standalone: true,
    imports: [
        AddPostFormWidget
    ],
    template: `
    <div class="p-4">
        <h2>피드 페이지</h2>
        <br/>
        <add-post-form-widget />
    </div>
    `
})
export class FeedPage { }