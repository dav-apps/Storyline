import { Component } from "@angular/core"
import { ApiService } from "../../services/api-service"

@Component({
	standalone: true,
	templateUrl: "./trending-page.component.html",
	styleUrl: "./trending-page.component.scss",
	providers: [ApiService]
})
export class TrendingPageComponent {
	constructor(private apiService: ApiService) {}

	async ngOnInit() {
		const result = await this.apiService.listArticles(
			`
				total
				items {
					title
					url
				}
			`,
			{}
		)

		console.log(result?.data.listArticles)
	}
}
