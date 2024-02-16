import { Component, Input, Output, EventEmitter } from "@angular/core"
import { ArticleResource } from "src/app/types"

@Component({
	selector: "storyline-article-list",
	templateUrl: "./article-list.component.html",
	styleUrl: "./article-list.component.scss"
})
export class ArticleListComponent {
	@Input() articles: ArticleResource[] = []
	@Output() itemClick = new EventEmitter()

	itemClicked(event: Event, article: ArticleResource) {
		event.preventDefault()
		this.itemClick.emit(article)
	}

	uriEncode(value: string) {
		return encodeURIComponent(value)
	}
}
