import { Component } from "@angular/core"
import { ApiService } from "src/app/services/api-service"
import { DataService } from "src/app/services/data-service"
import { LocalizationService } from "src/app/services/localization-service"
import { ArticleResource } from "src/app/types"

@Component({
	templateUrl: "./discover-page.component.html",
	styleUrl: "./discover-page.component.scss"
})
export class DiscoverPageComponent {
	locale = this.localizationService.locale.discoverPage
	articles: ArticleResource[] = []
	limit: number = 12
	offset: number = 0
	articlesLoading: boolean = false

	constructor(
		private apiService: ApiService,
		private dataService: DataService,
		private localizationService: LocalizationService
	) {}

	async ngOnInit() {
		const articles = await this.loadArticles()

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

	async loadArticles(limit: number = 12, offset: number = 0) {
		const result = await this.apiService.listArticles(
			`
				items {
					uuid
					title
					imageUrl
					publisher {
						name
						logoUrl
					}
				}
			`,
			{
				limit,
				offset
			}
		)

		if (result != null) {
			return result.data.listArticles.items
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
