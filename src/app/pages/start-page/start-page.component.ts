import { Component, ViewChild } from "@angular/core"
import {
	Dav,
	GetAllTableObjects,
	TableObject,
	CanSetupWebPushSubscription,
	SetupWebPushSubscription
} from "dav-js"
import { Toast } from "dav-ui-components"
import { HorizontalPublisherListComponent } from "src/app/components/horizontal-publisher-list/horizontal-publisher-list.component"
import { FeedSettingsDialogComponent } from "src/app/dialogs/feed-settings-dialog/feed-settings-dialog.component"
import { UpgradePlusDialogComponent } from "src/app/dialogs/upgrade-plus-dialog/upgrade-plus-dialog.component"
import { ApiService } from "src/app/services/api-service"
import { DavApiService } from "src/app/services/dav-api-service"
import { DataService } from "src/app/services/data-service"
import { LocalizationService } from "src/app/services/localization-service"
import { SettingsService } from "src/app/services/settings-service"
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
	actionsLocale = this.localizationService.locale.actions
	articles: ArticleResource[] = []
	publisherUuids: string[] = []
	excludedFeeds: { [uuid: string]: string[] } = {}
	publishers: PublisherResource[] = []
	followTableObjects: TableObject[] = []
	limit: number = 12
	offset: number = 0
	articlesLoading: boolean = false
	initialized: boolean = false
	activateNotificationsCardVisible: boolean = false
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
		private localizationService: LocalizationService,
		private settingsService: SettingsService
	) {
		this.dataService.setMeta()
		this.dataService.loadingScreenVisible = true
	}

	async ngOnInit() {
		await this.loadFeed()
		this.publishers = await this.loadPublishers()

		this.dataService.loadingScreenVisible = false

		// Check if there are any Notification table objects
		const notificationTableObjects = await GetAllTableObjects(
			environment.notificationTableId
		)

		this.activateNotificationsCardVisible =
			notificationTableObjects.length > 0 &&
			!(await this.settingsService.getActivateNotificationsCardClosed()) &&
			(await CanSetupWebPushSubscription())

		if (this.dataService.contentContainer != null) {
			this.dataService.contentContainer.addEventListener(
				"scroll",
				this.onScroll
			)
		}
	}

	ngAfterViewInit() {
		if (this.dataService.contentContainer == null) return

		setTimeout(() => {
			this.dataService.contentContainer.scrollTo(
				0,
				this.dataService.startPagePosition
			)

			this.initialized = true
		}, 50)
	}

	ngOnDestroy() {
		if (this.dataService.contentContainer != null) {
			this.dataService.contentContainer.removeEventListener(
				"scroll",
				this.onScroll
			)
		}

		this.dataService.startPageArticles = this.articles
		this.dataService.startPageOffset = this.offset
	}

	onScroll = () => {
		if (this.dataService.contentContainer == null) return

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
		this.excludedFeeds = {}

		for (let tableObject of this.followTableObjects) {
			const publisherUuid = tableObject.GetPropertyValue(
				followTablePublisherKey
			) as string

			// Delete duplicate follow table objects
			if (this.publisherUuids.includes(publisherUuid)) {
				await tableObject.Delete()
				continue
			}

			this.publisherUuids.push(publisherUuid)
			this.excludedFeeds[publisherUuid] = []

			let feedsString = tableObject.GetPropertyValue(
				followTableExcludedFeedsKey
			) as string

			if (feedsString != null) {
				for (let feedUuid of feedsString.split(",")) {
					if (feedUuid.length > 0) {
						this.excludedFeeds[publisherUuid].push(feedUuid)
					}
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
				this.flattenExcludedFeeds(this.excludedFeeds)
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
			this.flattenExcludedFeeds(this.excludedFeeds),
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
					feeds(
						hasName: $hasName
						limit: 10000
					) {
						items {
							uuid
							name
						}
					}
				`,
				{ uuid, hasName: true }
			)

			if (response.errors == null && response.data.retrievePublisher) {
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
		let i = this.excludedFeeds[event.publisher.uuid].findIndex(
			u => u == event.feed.uuid
		)

		if (i == -1) return

		this.excludedFeeds[event.publisher.uuid].splice(i, 1)
		this.feedSettingsChanged = true
	}

	async excludeFeed(event: {
		publisher: PublisherResource
		feed: FeedResource
	}) {
		// Add the feed to excluded feeds
		this.excludedFeeds[event.publisher.uuid].push(event.feed.uuid)
		this.feedSettingsChanged = true
	}

	async feedSettingsDialogClosed() {
		if (this.unfollowedPublishers.length == 0 && !this.feedSettingsChanged) {
			return
		}

		this.dataService.loadingScreenVisible = true

		// Update all follow table objects
		for (let uuid of Object.keys(this.excludedFeeds)) {
			let i = this.followTableObjects.findIndex(
				obj => obj.GetPropertyValue(followTablePublisherKey) == uuid
			)

			if (i == -1) continue

			let followTableObject = this.followTableObjects[i]
			let feedUuids = this.excludedFeeds[uuid]

			await followTableObject.SetPropertyValue({
				name: followTableExcludedFeedsKey,
				value: feedUuids.join(",")
			})
		}

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

	async activateNotifications() {
		let toast = document.createElement("dav-toast")
		toast.text = this.locale.activateNotificationsCard.failureMessage
		toast.paddingBottom = this.dataService.isMobile ? 80 : 0

		if (await SetupWebPushSubscription()) {
			this.activateNotificationsCardVisible = false
			toast.text = this.locale.activateNotificationsCard.successMessage
		}

		Toast.show(toast)
	}

	async closeActivateNotificationsCard() {
		this.activateNotificationsCardVisible = false
		await this.settingsService.setActivateNotificationsCardClosed(true)
	}

	flattenExcludedFeeds(excludedFeeds: { [uuid: string]: string[] }) {
		let allExcludedFeeds: string[] = []

		for (let publisherUuid of Object.keys(excludedFeeds)) {
			allExcludedFeeds.push(...excludedFeeds[publisherUuid])
		}

		return allExcludedFeeds
	}
}
