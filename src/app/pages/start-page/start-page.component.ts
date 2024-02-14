import { Component, HostListener } from "@angular/core"
import { Router } from "@angular/router"
import { ApiService } from "../../services/api-service"
import { DataService } from "../../services/data-service"
import { ArticleResource } from "../../types"

@Component({
	templateUrl: "./start-page.component.html",
	styleUrl: "./start-page.component.scss"
})
export class StartPageComponent {
	articles: ArticleResource[] = []
	limit: number = 10
	offset: number = 0
	articlesLoading: boolean = false

	constructor(
		private apiService: ApiService,
		private dataService: DataService,
		private router: Router
	) {
		this.dataService.loadingScreenVisible = true
	}

	async ngOnInit() {
		const articles = await this.loadArticles()
		this.dataService.loadingScreenVisible = false

		for (let article of articles) {
			this.articles.push(article)
		}

		this.dataService.contentContainer.addEventListener(
			"scroll",
			this.onScroll
		)
	}

	ngOnDestroy() {
		this.dataService.contentContainer.removeEventListener(
			"scroll",
			this.onScroll
		)
	}

	onScroll = () => {
		const contentContainer = this.dataService.contentContainer
		const hasReachedBottom =
			Math.abs(
				contentContainer.scrollHeight -
					contentContainer.scrollTop -
					contentContainer.clientHeight
			) < 1

		if (hasReachedBottom) {
			this.loadMoreArticles()
		}
	}

	articleItemClick(event: Event, article: ArticleResource) {
		event.preventDefault()
		this.router.navigate(["article", article.uuid])
	}

	async loadArticles(limit: number = 10, offset: number = 0) {
		const result = await this.apiService.listArticles(
			`
				total
				items {
					uuid
					url
					title
					imageUrl
					publisher {
						name
					}
				}
			`,
			{
				limit,
				offset
			}
		)

		if (result != null) {
			return result?.data.listArticles.items
		}

		return []
	}

	async loadMoreArticles() {
		if (this.articlesLoading) return
		this.articlesLoading = true

		this.offset += this.limit
		const articles = await this.loadArticles(this.limit, this.offset)

		for (let article of articles) {
			this.articles.push(article)
		}

		this.articlesLoading = false
	}
}
