import { Component, ViewChild } from "@angular/core"
import { Dav, GetAllTableObjects, TableObject } from "dav-js"
import { HorizontalPublisherListComponent } from "src/app/components/horizontal-publisher-list/horizontal-publisher-list.component"
import { FeedSettingsDialogComponent } from "src/app/dialogs/feed-settings-dialog/feed-settings-dialog.component"
import { UpgradePlusDialogComponent } from "src/app/dialogs/upgrade-plus-dialog/upgrade-plus-dialog.component"
import { ApiService } from "src/app/services/api-service"
import { DavApiService } from "src/app/services/dav-api-service"
import { DataService } from "src/app/services/data-service"
import { LocalizationService } from "src/app/services/localization-service"
import { ArticleResource, FeedResource, PublisherResource } from "src/app/types"
import {
	followTablePublisherKey,
	followTableExcludedFeedsKey,
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
	excludedFeedUuids: string[] = []
	publishers: PublisherResource[] = []
	followTableObjects: TableObject[] = []
	limit: number = 12
	offset: number = 0
	articlesLoading: boolean = false
	initialized: boolean = false
	unfollowedPublishers: PublisherResource[] = []
	feedSettingsChanged: boolean = false
	@ViewChild("horizontalPublisherList")
	horizontalPublisherList: HorizontalPublisherListComponent
	@ViewChild("feedSettingsDialog")
	feedSettingsDialog: FeedSettingsDialogComponent

	//#region UpgradePlusDialog
	@ViewChild("upgradePlusDialog")
	upgradePlusDialog: UpgradePlusDialogComponent
	upgradePlusDialogLoading: boolean = false
	//#endregion

	constructor(
		private apiService: ApiService,
		private davApiService: DavApiService,
		public dataService: DataService,
		private localizationService: LocalizationService
	) {
		this.dataService.loadingScreenVisible = true
	}

	async ngOnInit() {
		await this.loadFeed()
		this.publishers = await this.loadPublishers()

		this.dataService.loadingScreenVisible = false

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

	async loadFeed() {
		this.articles = []

		// Get all Follow table objects
		this.followTableObjects = await GetAllTableObjects(
			environment.followTableId
		)
		this.publisherUuids = []
		this.excludedFeedUuids = []

		for (let tableObject of this.followTableObjects) {
			this.publisherUuids.push(
				tableObject.GetPropertyValue(followTablePublisherKey) as string
			)

			let feedsString = tableObject.GetPropertyValue(
				followTableExcludedFeedsKey
			) as string

			if (feedsString != null) {
				for (let feedUuid of feedsString.split(",")) {
					this.excludedFeedUuids.push(feedUuid)
				}
			}
		}

		let articles: ArticleResource[] = []

		if (this.dataService.startPageArticles.length > 0) {
			articles = this.dataService.startPageArticles
			this.offset = this.dataService.startPageOffset
		} else {
			articles = await this.loadArticles(
				this.publisherUuids,
				this.excludedFeedUuids
			)
		}

		for (let article of articles) {
			this.articles.push(article)
		}
	}

	async loadArticles(
		publishers: string[],
		excludeFeeds: string[],
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
				excludeFeeds,
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
			this.excludedFeedUuids,
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
		if (this.dataService.dav.user.Plan > 0) {
			this.unfollowedPublishers = []
			this.feedSettingsChanged = false
			this.feedSettingsDialog.show()
		} else {
			this.upgradePlusDialog.show()
		}
	}

	unfollowPublisher(publisher: PublisherResource) {
		let i = this.publishers.findIndex(p => p.uuid == publisher.uuid)

		if (i != -1) {
			this.publishers.splice(i, 1)
		}

		this.unfollowedPublishers.push(publisher)
	}

	async includeFeed(event: {
		publisher: PublisherResource
		feed: FeedResource
	}) {
		// Remove the feed from excluded feeds
		let i = this.excludedFeedUuids.findIndex(u => u == event.feed.uuid)

		if (i != -1) {
			this.excludedFeedUuids.splice(i, 1)
		}

		i = this.followTableObjects.findIndex(
			obj =>
				obj.GetPropertyValue(followTablePublisherKey) ==
				event.publisher.uuid
		)

		if (i == -1) return

		let followTableObject = this.followTableObjects[i]
		let feedUuidsString = followTableObject.GetPropertyValue(
			followTableExcludedFeedsKey
		) as string

		if (feedUuidsString == null) return

		let feedUuids = feedUuidsString.split(",")
		let j = feedUuids.findIndex(f => f == event.feed.uuid)

		// Remove the feed from the feed uuids string
		feedUuids.splice(j, 1)

		await followTableObject.SetPropertyValue({
			name: followTableExcludedFeedsKey,
			value: feedUuids.join(",")
		})

		this.feedSettingsChanged = true
	}

	async excludeFeed(event: {
		publisher: PublisherResource
		feed: FeedResource
	}) {
		// Add the feed to excluded feeds
		this.excludedFeedUuids.push(event.feed.uuid)

		let i = this.followTableObjects.findIndex(
			obj =>
				obj.GetPropertyValue(followTablePublisherKey) ==
				event.publisher.uuid
		)

		if (i == -1) return

		let followTableObject = this.followTableObjects[i]
		let feedUuidsString = followTableObject.GetPropertyValue(
			followTableExcludedFeedsKey
		) as string

		let newFeedUuidsString = event.feed.uuid

		if (feedUuidsString != null && feedUuidsString.length > 0) {
			newFeedUuidsString = `${feedUuidsString},${event.feed.uuid}`
		}

		await followTableObject.SetPropertyValue({
			name: followTableExcludedFeedsKey,
			value: newFeedUuidsString
		})

		this.feedSettingsChanged = true
	}

	async feedSettingsDialogClosed() {
		if (this.unfollowedPublishers.length == 0 && !this.feedSettingsChanged) {
			return
		}

		this.dataService.loadingScreenVisible = true

		for (let publisher of this.unfollowedPublishers) {
			let i = this.publisherUuids.findIndex(u => u == publisher.uuid)

			if (i != -1) {
				this.publisherUuids.splice(i, 1)
			}

			// Delete the follow table object
			i = this.followTableObjects.findIndex(
				obj =>
					obj.GetPropertyValue(followTablePublisherKey) == publisher.uuid
			)

			if (i != -1) {
				await this.followTableObjects[i].Delete()
				this.followTableObjects.splice(i, 1)
			}
		}

		this.horizontalPublisherList.init()

		// Reload the feed
		await this.loadFeed()

		this.dataService.loadingScreenVisible = false
	}

	async upgradePlusDialogPrimaryButtonClick() {
		if (this.dataService.dav.isLoggedIn) {
			await this.navigateToCheckoutPage()
		} else {
			await this.navigateToLoginPage()
		}
	}

	async navigateToCheckoutPage() {
		this.upgradePlusDialogLoading = true

		let response = await this.davApiService.createSubscriptionCheckoutSession(
			`url`,
			{
				plan: "PLUS",
				successUrl: window.location.href,
				cancelUrl: window.location.href
			}
		)

		const url = response.data?.createSubscriptionCheckoutSession?.url

		if (url != null) {
			window.location.href = url
		} else {
			this.upgradePlusDialogLoading = false
		}
	}

	async navigateToLoginPage() {
		// Go to login page with upgradePlus=true in the url
		let url = new URL(window.location.href)
		url.searchParams.append("upgradePlus", "true")
		Dav.ShowLoginPage(environment.apiKey, url.toString())
	}
}
