import { Component } from "@angular/core"
import { Router, ActivatedRoute } from "@angular/router"
import { ApiService } from "../../services/api-service"
import { ArticleResource } from "../../types"

@Component({
	templateUrl: "./article-page.component.html",
	styleUrl: "./article-page.component.scss"
})
export class ArticlePageComponent {
	article: ArticleResource = null
	content: string = null

	constructor(
		private apiService: ApiService,
		private activatedRoute: ActivatedRoute,
		private router: Router
	) {}

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
}
