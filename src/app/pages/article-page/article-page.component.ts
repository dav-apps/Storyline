import { Component } from "@angular/core"
import { Router, ActivatedRoute } from "@angular/router"
import { faShareFromSquare } from "@fortawesome/pro-regular-svg-icons"
import { ApiService } from "../../services/api-service"
import { DataService } from "../../services/data-service"
import { LocalizationService } from "../../services/localization-service"
import { ArticleResource } from "../../types"

@Component({
	templateUrl: "./article-page.component.html",
	styleUrl: "./article-page.component.scss"
})
export class ArticlePageComponent {
	locale = this.localizationService.locale.articlePage
	faShareFromSquare = faShareFromSquare
	article: ArticleResource = null
	content: string = null
	showShareButton: boolean = false
	articleRecommendations: ArticleResource[] = []

	constructor(
		private apiService: ApiService,
		public dataService: DataService,
		private localizationService: LocalizationService,
		private activatedRoute: ActivatedRoute,
		private router: Router
	) {
		this.showShareButton = navigator.share != null
		this.dataService.loadingScreenVisible = true
	}

	async ngOnInit() {
		await this.dataService.userPromiseHolder.AwaitResult()
		const isUserOnPlus = this.dataService.dav.user.Plan > 0
		const uuid = this.activatedRoute.snapshot.paramMap.get("uuid")

		const response = await this.apiService.retrieveArticle(
			`
				uuid
				url
				title
				imageUrl
				${isUserOnPlus ? "summary" : "content"}
				publisher {
					uuid
					name
					url
					logoUrl
				}
				feeds {
					items {
						uuid
					}
				}
			`,
			{ uuid }
		)

		const responseData = response.data?.retrieveArticle
		this.dataService.loadingScreenVisible = false

		if (responseData == null) {
			this.router.navigate(["/"])
			return
		}

		this.article = responseData

		// Load article recommendations
		let feedResponse = await this.apiService.retrieveFeed(
			`
				name
				articles(limit: $limit, offset: $offset) {
					items {
						uuid
						title
						imageUrl
					}
				}
			`,
			{
				uuid: this.article.feeds.items[0].uuid
			}
		)

		let feedResponseData = feedResponse.data.retrieveFeed

		if (feedResponseData != null) {
			for (let article of feedResponseData.articles.items) {
				if (article.uuid != this.article.uuid) {
					this.articleRecommendations.push(article)
				}
			}
		}
	}

	navigateToPublisherPage(event: Event) {
		event.preventDefault()
		this.router.navigate(["publisher", this.article.publisher.uuid])
	}

	share() {
		navigator.share({
			url: this.article.url,
			title: this.article.title
		})
	}
}
