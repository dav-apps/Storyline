import { Component, Input } from "@angular/core"
import { Router } from "@angular/router"
import { faArrowRight as faArrowRightLight } from "@fortawesome/pro-light-svg-icons"
import { DataService } from "src/app/services/data-service"
import { ArticleResource } from "src/app/types"

@Component({
	selector: "storyline-article-list",
	templateUrl: "./article-list.component.html",
	styleUrl: "./article-list.component.scss"
})
export class ArticleListComponent {
	@Input() headline: string = ""
	@Input() headlineImageUrl: string = ""
	@Input() loading: boolean = false
	@Input() loadingMore: boolean = false
	@Input() articles: ArticleResource[] = []
	@Input() orientation: "horizontal" | "vertical" = "vertical"
	@Input() moreButtonLink: string = ""
	faArrowRightLight = faArrowRightLight

	constructor(private dataService: DataService, private router: Router) {}

	itemClicked(event: Event, article: ArticleResource) {
		event.preventDefault()
		this.router.navigate(["article", article.uuid])
	}

	uriEncode(value: string) {
		return encodeURIComponent(value)
	}

	moreButtonClick(event: MouseEvent) {
		event.preventDefault()
		this.dataService.contentContainer.scrollTo(0, 0)
		this.router.navigate([this.moreButtonLink])
	}
}
