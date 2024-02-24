import { Component } from "@angular/core"
import { Router, ActivatedRoute, ParamMap } from "@angular/router"
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
	uuid: string = ""
	article: ArticleResource = null
	content: string = null
	showShareButton: boolean = false
	articleRecommendations: ArticleResource[] = []
	articleRecommendationsHeadline: string = ""
	limit: number = 12
	offset: number = 0
	articleRecommendationsLoading: boolean = false

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

		this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
			let uuid = paramMap.get("uuid")

			if (this.uuid != uuid) {
				this.uuid = uuid

				// Show loading screen & clear article recommendations
				this.dataService.loadingScreenVisible = true
				this.articleRecommendations = []
				this.dataService.contentContainer.scrollTo(0, 0)

				await this.loadData()
			}
		})

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
			this.loadMoreArticleRecommendations()
		}
	}

	async loadData() {
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
		await this.loadArticleRecommendations()
	}

	async loadArticleRecommendations(limit: number = 12, offset: number = 0) {
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
				uuid: this.article.feeds.items[0].uuid,
				limit,
				offset
			}
		)

		let feedResponseData = feedResponse.data.retrieveFeed

		if (feedResponseData != null) {
			for (let article of feedResponseData.articles.items) {
				if (article.uuid != this.article.uuid) {
					this.articleRecommendations.push(article)
				}
			}

			if (feedResponseData.name != null) {
				this.articleRecommendationsHeadline =
					this.locale.articleRecommendationsHeadline.inFeed.replace(
						"{0}",
						feedResponseData.name
					)
			} else {
				this.articleRecommendationsHeadline =
					this.locale.articleRecommendationsHeadline.byPublisher.replace(
						"{0}",
						this.article.publisher.name
					)
			}
		}
	}

	async loadMoreArticleRecommendations() {
		if (this.articleRecommendationsLoading) return
		this.articleRecommendationsLoading = true

		this.offset += this.limit

		await this.loadArticleRecommendations(this.limit, this.offset)

		this.articleRecommendationsLoading = false
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
