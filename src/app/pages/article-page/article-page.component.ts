import { Component, ViewChild } from "@angular/core"
import { Router, ActivatedRoute, ParamMap } from "@angular/router"
import { faBookmark as faBookmarkSolid } from "@fortawesome/pro-solid-svg-icons"
import {
	faShareFromSquare,
	faBookmark as faBookmarkRegular
} from "@fortawesome/pro-regular-svg-icons"
import { Dav, GetAllTableObjects, TableObject } from "dav-js"
import { Toast } from "dav-ui-components"
import { UpgradePlusDialogComponent } from "src/app/dialogs/upgrade-plus-dialog/upgrade-plus-dialog.component"
import { ApiService } from "src/app/services/api-service"
import { DavApiService } from "src/app/services/dav-api-service"
import { DataService } from "src/app/services/data-service"
import { LocalizationService } from "src/app/services/localization-service"
import { isServer, isClient } from "src/app/utils"
import { ArticleResource } from "src/app/types"
import {
	bookmarkTableArticleKey,
	bottomArticleThreshold
} from "src/app/constants"
import { environment } from "src/environments/environment"

@Component({
	templateUrl: "./article-page.component.html",
	styleUrl: "./article-page.component.scss"
})
export class ArticlePageComponent {
	locale = this.localizationService.locale.articlePage
	faShareFromSquare = faShareFromSquare
	faBookmarkSolid = faBookmarkSolid
	faBookmarkRegular = faBookmarkRegular
	slug: string = ""
	article: ArticleResource = null
	content: string = null
	showShareButton: boolean = false
	articleRecommendations: ArticleResource[] = []
	articleRecommendationsHeadline: string = ""
	limit: number = 12
	offset: number = 0
	articleRecommendationsLoading: boolean = false
	bookmarkTableObject: TableObject = null

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
		private activatedRoute: ActivatedRoute,
		private router: Router
	) {
		this.showShareButton = isClient() && navigator.share != null
		this.dataService.loadingScreenVisible = true
	}

	async ngOnInit() {
		this.slug = this.activatedRoute.snapshot.paramMap.get("slug")

		await this.loadData()

		this.dataService.setMeta({
			title: `${this.article.title} | Storyline`,
			description: this.article.content,
			twitterCard: "summary_large_image",
			image: this.article.imageUrl,
			url: `article/${this.article.slug}`
		})

		this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
			let slug = paramMap.get("slug")
			if (this.slug == slug) return

			this.slug = slug

			// Show loading screen & clear article recommendations
			this.dataService.loadingScreenVisible = true
			this.articleRecommendations = []
			this.dataService.contentContainer.scrollTo(0, 0)

			await this.loadData()

			this.dataService.setMeta({
				title: `${this.article.title} | Storyline`,
				description: this.article.content,
				twitterCard: "summary_large_image",
				image: this.article.imageUrl,
				url: `article/${this.article.slug}`
			})

			await this.dataService.userPromiseHolder.AwaitResult()

			// Try to find a bookmark table object for the article
			const bookmarks = await GetAllTableObjects(environment.bookmarkTableId)
			let i = bookmarks.findIndex(b =>
				slug.endsWith(b.GetPropertyValue(bookmarkTableArticleKey) as string)
			)
			if (i != -1) this.bookmarkTableObject = bookmarks[i]
		})

		if (this.dataService.contentContainer != null) {
			this.dataService.contentContainer.addEventListener(
				"scroll",
				this.onScroll
			)
		}
	}

	ngOnDestroy() {
		if (this.dataService.contentContainer != null) {
			this.dataService.contentContainer.removeEventListener(
				"scroll",
				this.onScroll
			)
		}
	}

	onScroll = () => {
		const contentContainer = this.dataService.contentContainer
		if (contentContainer == null) return

		const hasReachedBottom =
			contentContainer.scrollHeight -
				contentContainer.scrollTop -
				contentContainer.clientHeight -
				bottomArticleThreshold <
			0

		if (hasReachedBottom) {
			this.loadMoreArticleRecommendations()
		}
	}

	async loadData() {
		const isUserOnPlus = this.dataService.dav.user.Plan > 0
		const slug = this.activatedRoute.snapshot.paramMap.get("slug")

		const response = await this.apiService.retrieveArticle(
			`
				uuid
				slug
				url
				title
				imageUrl
				content
				${isUserOnPlus ? "summary" : ""}
				publisher {
					uuid
					slug
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
			{ uuid: slug }
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
				articles(
					exclude: $exclude
					limit: $limit
					offset: $offset
				) {
					items {
						uuid
						slug
						title
						imageUrl
					}
				}
			`,
			{
				uuid: this.article.feeds.items[0].uuid,
				exclude: this.article.uuid,
				limit,
				offset
			}
		)

		let feedResponseData = feedResponse.data.retrieveFeed

		if (feedResponseData != null) {
			for (let article of feedResponseData.articles.items) {
				this.articleRecommendations.push({
					...article,
					publisher: {
						uuid: null,
						slug: null,
						url: null,
						name: null,
						description: null,
						logoUrl: this.article.publisher.logoUrl,
						feeds: null,
						articles: null
					}
				})
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
		this.router.navigate(["publisher", this.article.publisher.slug])
	}

	share() {
		if (isServer()) return

		navigator.share({
			url: this.article.url,
			title: this.article.title
		})
	}

	async addToBookmarks() {
		// Create a bookmark table object
		let tableObject = new TableObject()
		tableObject.TableId = environment.bookmarkTableId

		await tableObject.SetPropertyValue({
			name: bookmarkTableArticleKey,
			value: this.article.uuid
		})

		this.bookmarkTableObject = tableObject
		this.dataService.bookmarksCount++

		// Send success toast
		let toast = document.createElement("dav-toast")
		toast.text = this.locale.addedToBookmarks
		toast.paddingBottom = this.dataService.isMobile ? 80 : 0

		Toast.show(toast)
	}

	async removeFromBookmarks() {
		await this.bookmarkTableObject.Delete()
		this.bookmarkTableObject = null
		this.dataService.bookmarksCount--

		// Send success toast
		let toast = document.createElement("dav-toast")
		toast.text = this.locale.removedFromBookmarks
		toast.paddingBottom = this.dataService.isMobile ? 80 : 0

		Toast.show(toast)
	}

	showUpgradePlusDialog() {
		this.upgradePlusDialog.show()
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
