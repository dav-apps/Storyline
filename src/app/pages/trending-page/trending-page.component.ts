import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { ApiService } from "../../services/api-service"
import { ArticleResource } from "../../types"

@Component({
	standalone: true,
	templateUrl: "./trending-page.component.html",
	styleUrl: "./trending-page.component.scss",
	providers: [ApiService],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrendingPageComponent {
	articles: ArticleResource[] = []

	constructor(private apiService: ApiService) {}

	async ngOnInit() {
		const result = await this.apiService.listArticles(
			`
				total
				items {
					uuid
					title
					url
					image
				}
			`,
			{}
		)

		if (result != null) {
			this.articles = result?.data.listArticles.items
		}
	}
}
