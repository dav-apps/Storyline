import { Component, ViewChild } from "@angular/core"
import { GetAllTableObjects } from "dav-js"
import { FeedSettingsDialogComponent } from "src/app/dialogs/feed-settings-dialog/feed-settings-dialog.component"
import { ApiService } from "src/app/services/api-service"
import { DataService } from "src/app/services/data-service"
import { LocalizationService } from "src/app/services/localization-service"
import { ArticleResource, PublisherResource } from "src/app/types"
import {
	followTablePublisherKey,
	bottomArticleThreshold
} from "src/app/constants"
import { environment } from "src/environments/environment"

@Component({
	templateUrl: "./start-page.component.html",
	styleUrl: "./start-page.component.scss"
})
export class StartPageComponent {
	locale = this.localizationService.locale.startPage
	articles: ArticleResource[] = []
	publisherUuids: string[] = []
	publishers: PublisherResource[] = []
	limit: number = 12
	offset: number = 0
	articlesLoading: boolean = false
	initialized: boolean = false
	@ViewChild("feedSettingsDialog")
	feedSettingsDialog: FeedSettingsDialogComponent

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

		let articles: ArticleResource[] = []

		if (this.dataService.startPageArticles.length > 0) {
			articles = this.dataService.startPageArticles
			this.offset = this.dataService.startPageOffset
		} else {
			articles = await this.loadArticles(this.publisherUuids)
		}

		this.dataService.loadingScreenVisible = false

		for (let article of articles) {
			this.articles.push(article)
		}

		if (this.dataService.dav.user.Plan > 0) {
			this.publishers = await this.loadPublishers()
		}

		this.dataService.contentContainer.addEventListener(
			"scroll",
			this.onScroll
		)
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.dataService.contentContainer.scrollTo(
				0,
				this.dataService.startPagePosition
			)

			this.initialized = true
		}, 50)
	}

	ngOnDestroy() {
		this.dataService.contentContainer.removeEventListener(
			"scroll",
			this.onScroll
		)

		this.dataService.startPageArticles = this.articles
		this.dataService.startPageOffset = this.offset
	}

	onScroll = () => {
		if (this.initialized) {
			// Save the new position
			this.dataService.startPagePosition =
				this.dataService.contentContainer.scrollTop
		}

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

	async loadArticles(
		publishers: string[],
		limit: number = 12,
		offset: number = 0
	) {
		const response = await this.apiService.listArticles(
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
				publishers,
				limit,
				offset
			}
		)

		if (response.errors == null) {
			return response.data.listArticles.items
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

	async loadPublishers() {
		let publishers: PublisherResource[] = []

		for (let uuid of this.publisherUuids) {
			let response = await this.apiService.retrievePublisher(
				`
					uuid
					name
					logoUrl
					feeds(hasName: $hasName) {
						items {
							uuid
							name
						}
					}
				`,
				{ uuid, hasName: true }
			)

			if (response.errors == null) {
				publishers.push(response.data.retrievePublisher)
			}
		}

		return publishers
	}

	showFeedSettingsDialog() {
		this.feedSettingsDialog.show()
	}
}
