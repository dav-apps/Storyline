import { Component } from "@angular/core"
import { Router, ActivatedRoute } from "@angular/router"
import {
	faArrowUpRightFromSquare,
	faPlus
} from "@fortawesome/pro-regular-svg-icons"
import { ApiService } from "../../services/api-service"
import { DataService } from "../../services/data-service"
import { ArticleResource, PublisherResource } from "../../types"

@Component({
	templateUrl: "./publisher-page.component.html",
	styleUrl: "./publisher-page.component.scss"
})
export class PublisherPageComponent {
	publisher: PublisherResource = null
	articles: ArticleResource[] = []
	faArrowUpRightFromSquare = faArrowUpRightFromSquare
	faPlus = faPlus
	limit: number = 10
	offset: number = 0
	articlesLoading: boolean = false

	constructor(
		private apiService: ApiService,
		private dataService: DataService,
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
}
