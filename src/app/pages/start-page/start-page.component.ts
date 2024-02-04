import { Component, HostListener } from "@angular/core"
import { Router } from "@angular/router"
import { ApiService } from "../../services/api-service"
import { DataService } from "../../services/data-service"
import { ArticleResource } from "../../types"

@Component({
	templateUrl: "./start-page.component.html",
	styleUrl: "./start-page.component.scss"
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
