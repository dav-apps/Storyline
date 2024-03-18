import { Component } from "@angular/core"
import { ApiService } from "src/app/services/api-service"
import { DataService } from "src/app/services/data-service"
import { LocalizationService } from "src/app/services/localization-service"
import { bottomArticleThreshold } from "src/app/constants"
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
	articlesLoading: boolean = true
	moreArticlesLoading: boolean = false

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

		this.articlesLoading = false

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
			contentContainer.scrollHeight -
				contentContainer.scrollTop -
				contentContainer.clientHeight -
				bottomArticleThreshold <
			0

		if (hasReachedBottom) {
			this.loadMoreArticles()
		}
	}

	async loadArticles(limit: number = 12, offset: number = 0) {
		const result = await this.apiService.listArticles(
			`
				items {
					uuid
					slug
					title
					imageUrl
					publisher {
						name
						logoUrl
					}
				}
			`,
			{
				languages: this.dataService.getLanguages(),
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
		if (this.moreArticlesLoading) return
		this.moreArticlesLoading = true

		this.offset += this.limit

		const articles = await this.loadArticles(this.limit, this.offset)

		for (let article of articles) {
			this.articles.push(article)
		}

		this.moreArticlesLoading = false
	}
}
