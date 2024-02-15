import { Component, ViewChild } from "@angular/core"
import { Router, ActivatedRoute } from "@angular/router"
import {
	faArrowUpRightFromSquare,
	faPlus
} from "@fortawesome/pro-regular-svg-icons"
import { Dav, TableObject, GetAllTableObjects } from "dav-js"
import { ApiService } from "../../services/api-service"
import { DataService } from "../../services/data-service"
import { LocalizationService } from "../../services/localization-service"
import { LoginPromptDialogComponent } from "../../dialogs/login-prompt-dialog/login-prompt-dialog.component"
import { ArticleResource, PublisherResource } from "src/app/types"
import { followTablePublisherKey } from "src/app/constants"
import { environment } from "src/environments/environment"

@Component({
	templateUrl: "./publisher-page.component.html",
	styleUrl: "./publisher-page.component.scss"
})
export class PublisherPageComponent {
	locale = this.localizationService.locale.publisherPage
	faArrowUpRightFromSquare = faArrowUpRightFromSquare
	@ViewChild("loginPromptDialog") loginPromptDialog: LoginPromptDialogComponent
	publisher: PublisherResource = null
	articles: ArticleResource[] = []
	faPlus = faPlus
	limit: number = 10
	offset: number = 0
	articlesLoading: boolean = false
	followTableObject: TableObject = null

	constructor(
		private apiService: ApiService,
		private dataService: DataService,
		private localizationService: LocalizationService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {}

	async ngOnInit() {
		const uuid = this.activatedRoute.snapshot.paramMap.get("uuid")
		const publisher = await this.loadPublisher(uuid, this.limit, this.offset)

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
			f => f.GetPropertyValue(followTablePublisherKey) == uuid
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
			Math.abs(
				contentContainer.scrollHeight -
					contentContainer.scrollTop -
					contentContainer.clientHeight
			) < 1

		if (hasReachedBottom) {
			this.loadMoreArticles()
		}
	}

	async loadPublisher(uuid: string, limit: number, offset: number) {
		const response = await this.apiService.retrievePublisher(
			`
				uuid
				name
				url
				logoUrl
				articles(limit: $limit, offset: $offset) {
					items {
						uuid
						title
						imageUrl
					}
				}
			`,
			{ uuid, limit, offset }
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
			this.publisher.uuid,
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

	articleItemClick(event: Event, article: ArticleResource) {
		event.preventDefault()
		this.router.navigate(["article", article.uuid])
	}

	async follow() {
		// Check if the user is logged in
		if (!this.dataService.dav.isLoggedIn) {
			this.loginPromptDialog.show()
			return
		}

		// Follow the publisher by creating a Follow object
		let tableObject = new TableObject()
		tableObject.TableId = environment.followTableId

		await tableObject.SetPropertyValue({
			name: followTablePublisherKey,
			value: this.publisher.uuid
		})

		this.followTableObject = tableObject
	}

	async unfollow() {
		await this.followTableObject.Delete()
		this.followTableObject = null
	}

	navigateToLoginPage() {
		Dav.ShowLoginPage(environment.apiKey, window.location.href)
	}
}
