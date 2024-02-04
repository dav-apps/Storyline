import { Component } from "@angular/core"
import { ApiService } from "../../services/api-service"

@Component({
	standalone: true,
	templateUrl: "./article-page.component.html",
	styleUrl: "./article-page.component.scss",
	providers: [ApiService]
})
export class ArticlePageComponent {}
