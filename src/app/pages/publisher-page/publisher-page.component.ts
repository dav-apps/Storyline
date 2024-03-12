import { Component, ViewChild } from "@angular/core"
import { Router, ActivatedRoute } from "@angular/router"
import { faBellOn } from "@fortawesome/pro-solid-svg-icons"
import {
	faArrowUpRightFromSquare,
	faPlus,
	faBell
} from "@fortawesome/pro-regular-svg-icons"
import {
	Dav,
	TableObject,
	GetAllTableObjects,
	SetupWebPushSubscription
} from "dav-js"
import { ApiService } from "../../services/api-service"
import { DataService } from "../../services/data-service"
import { LocalizationService } from "../../services/localization-service"
import { LoginPromptDialogComponent } from "../../dialogs/login-prompt-dialog/login-prompt-dialog.component"
import { ArticleResource, PublisherResource } from "src/app/types"
import {
	followTablePublisherKey,
	notificationTablePublisherKey,
	bottomArticleThreshold
} from "src/app/constants"
import { environment } from "src/environments/environment"

@Component({
	templateUrl: "./publisher-page.component.html",
	styleUrl: "./publisher-page.component.scss"
})
export class PublisherPageComponent {
	locale = this.localizationService.locale.publisherPage
	actionsLocale = this.localizationService.locale.actions
	faArrowUpRightFromSquare = faArrowUpRightFromSquare
	faPlus = faPlus
	faBell = faBell
	faBellOn = faBellOn
	@ViewChild("loginPromptDialog") loginPromptDialog: LoginPromptDialogComponent
	publisher: PublisherResource = null
	articles: ArticleResource[] = []
	limit: number = 12
	offset: number = 0
	articlesLoading: boolean = false
	followTableObject: TableObject = null
	notificationTableObject: TableObject = null

	constructor(
		private apiService: ApiService,
		private dataService: DataService,
		private localizationService: LocalizationService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {}

	async ngOnInit() {
		const slug = this.activatedRoute.snapshot.paramMap.get("slug")
		const publisher = await this.loadPublisher(slug, this.limit, this.offset)

		if (publisher == null) {
			this.router.navigate([""])
			return
		}

		this.publisher = publisher

		for (let article of publisher.articles.items) {
			this.articles.push(article)
		}

		this.dataService.contentContainer.addEventListener(
			"scroll",
			this.onScroll
		)

		// Try to find a Follow object for the publisher
		const follows = await GetAllTableObjects(environment.followTableId)
		let i = follows.findIndex(
			f => f.GetPropertyValue(followTablePublisherKey) == publisher.uuid
		)
		if (i != -1) this.followTableObject = follows[i]
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

	async loadPublisher(slug: string, limit: number, offset: number) {
		const response = await this.apiService.retrievePublisher(
			`
				uuid
				slug
				name
				url
				logoUrl
				articles(limit: $limit, offset: $offset) {
					items {
						uuid
						slug
						title
						imageUrl
					}
				}
			`,
			{ uuid: slug, limit, offset }
		)

		const responseData = response.data?.retrievePublisher
		if (responseData == null) return null

		return responseData
	}

	async loadMoreArticles() {
		if (this.articlesLoading) return
		this.articlesLoading = true
		this.offset += this.limit

		const publisher = await this.loadPublisher(
			this.publisher.slug,
			this.limit,
			this.offset
		)

		for (let article of publisher.articles.items) {
			this.articles.push(article)
		}

		this.articlesLoading = false
	}

	openWebsite() {
		window.open(this.publisher.url, "_blank")
	}

	async follow() {
		// Check if the user is logged in
		if (!this.dataService.dav.isLoggedIn) {
			// Show login prompt if user follows >= 3 publishers
			let tableObjects = await GetAllTableObjects(environment.followTableId)

			if (tableObjects.length >= 3) {
				this.loginPromptDialog.show()
				return
			}
		}

		// Follow the publisher by creating a Follow table object
		let tableObject = new TableObject()
		tableObject.TableId = environment.followTableId

		await tableObject.SetPropertyValue({
			name: followTablePublisherKey,
			value: this.publisher.uuid
		})

		this.followTableObject = tableObject

		// Clear the articles cache on the start page
		this.dataService.startPageArticles = []
		this.dataService.startPageOffset = 0
		this.dataService.startPagePosition = 0
	}

	async unfollow() {
		await this.followTableObject.Delete()
		this.followTableObject = null

		// Clear the articles cache on the start page
		this.dataService.startPageArticles = []
		this.dataService.startPageOffset = 0
		this.dataService.startPagePosition = 0
	}

	async activateNotifications() {
		// Check if the user is logged in
		if (!this.dataService.dav.isLoggedIn) {
			this.loginPromptDialog.show()
			return
		}

		// Ask the user for notification permission
		if (!(await SetupWebPushSubscription())) return

		// Activate notifications by creating a Notifications table object
		let tableObject = new TableObject()
		tableObject.TableId = environment.notificationTableId

		await tableObject.SetPropertyValue({
			name: notificationTablePublisherKey,
			value: this.publisher.uuid
		})

		this.notificationTableObject = tableObject
	}

	async deactivateNotifications() {
		await this.notificationTableObject.Delete()
		this.notificationTableObject = null
	}

	navigateToLoginPage() {
		Dav.ShowLoginPage(environment.apiKey, window.location.href)
	}
}
