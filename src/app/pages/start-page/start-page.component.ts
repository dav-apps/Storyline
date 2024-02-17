import { Component } from "@angular/core"
import { Router } from "@angular/router"
import { GetAllTableObjects } from "dav-js"
import { ApiService } from "src/app/services/api-service"
import { DataService } from "src/app/services/data-service"
import { LocalizationService } from "src/app/services/localization-service"
import { ArticleResource } from "src/app/types"
import { followTablePublisherKey } from "src/app/constants"
import { environment } from "src/environments/environment"

@Component({
	templateUrl: "./start-page.component.html",
	styleUrl: "./start-page.component.scss"
})
export class StartPageComponent {
	locale = this.localizationService.locale.startPage
	articles: ArticleResource[] = []
	publisherUuids: string[] = []
	limit: number = 12
	offset: number = 0
	articlesLoading: boolean = false

	constructor(
		private apiService: ApiService,
		private dataService: DataService,
		private localizationService: LocalizationService
	) {
		this.dataService.loadingScreenVisible = true
	}

	async ngOnInit() {
		// Get all Follow table objects
		let tableObjects = await GetAllTableObjects(environment.followTableId)
		this.publisherUuids = []

		for (let tableObject of tableObjects) {
			this.publisherUuids.push(
				tableObject.GetPropertyValue(followTablePublisherKey) as string
			)
		}

		const articles = await this.loadArticles(this.publisherUuids)
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

	async loadArticles(
		publishers: string[],
		limit: number = 12,
		offset: number = 0
	) {
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
						logoUrl
					}
				}
			`,
			{
				publishers,
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

		const articles = await this.loadArticles(
			this.publisherUuids,
			this.limit,
			this.offset
		)

		for (let article of articles) {
			this.articles.push(article)
		}

		this.articlesLoading = false
	}
}
