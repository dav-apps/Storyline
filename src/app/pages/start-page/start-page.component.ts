import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { Router } from "@angular/router"
import { ApiService } from "../../services/api-service"
import { ArticleResource } from "../../types"

@Component({
	standalone: true,
	templateUrl: "./start-page.component.html",
	styleUrl: "./start-page.component.scss",
	providers: [ApiService],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StartPageComponent {
	articles: ArticleResource[] = []

	constructor(private apiService: ApiService, private router: Router) {}

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

	articleItemClick(event: Event, article: ArticleResource) {
		event.preventDefault()
		this.router.navigate(["article", article.uuid])
	}
}
