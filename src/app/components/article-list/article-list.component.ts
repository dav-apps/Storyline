import { Component, Input, Output, EventEmitter } from "@angular/core"
import { Router } from "@angular/router"
import { ArticleResource } from "src/app/types"

@Component({
	selector: "storyline-article-list",
	templateUrl: "./article-list.component.html",
	styleUrl: "./article-list.component.scss"
})
export class ArticleListComponent {
	@Input() headline: string = ""
	@Input() loading: boolean = false
	@Input() loadingMore: boolean = false
	@Input() articles: ArticleResource[] = []

	constructor(private router: Router) {}

	itemClicked(event: Event, article: ArticleResource) {
		event.preventDefault()
		this.router.navigate(["article", article.uuid])
	}

	uriEncode(value: string) {
		return encodeURIComponent(value)
	}
}
