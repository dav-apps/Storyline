import { Component } from "@angular/core"
import { Router, ActivatedRoute } from "@angular/router"
import { faShareFromSquare } from "@fortawesome/pro-regular-svg-icons"
import { ApiService } from "../../services/api-service"
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

	constructor(
		private apiService: ApiService,
		private localizationService: LocalizationService,
		private activatedRoute: ActivatedRoute,
		private router: Router
	) {
		this.showShareButton = navigator.share != null
	}

	async ngOnInit() {
		const uuid = this.activatedRoute.snapshot.paramMap.get("uuid")

		const response = await this.apiService.retrieveArticle(
			`
				url
				title
				imageUrl
				content
				publisher {
					uuid
					name
					url
					logoUrl
					copyright
				}
			`,
			{ uuid }
		)

		const responseData = response.data?.retrieveArticle
		if (responseData == null) return

		this.article = responseData
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
