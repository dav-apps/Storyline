import { Component } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { ApiService } from "../../services/api-service"
import { ArticleResource } from "../../types"

@Component({
	templateUrl: "./article-page.component.html",
	styleUrl: "./article-page.component.scss"
})
export class ArticlePageComponent {
	article: ArticleResource = null

	constructor(
		private apiService: ApiService,
		private activatedRoute: ActivatedRoute
	) {}

	async ngOnInit() {
		const uuid = this.activatedRoute.snapshot.paramMap.get("uuid")

		const result = await this.apiService.retrieveArticle(
			`
				title
				image
				text
			`,
			{ uuid }
		)

		if (result.data?.retrieveArticle != null) {
			this.article = result.data.retrieveArticle
		}
	}
}
