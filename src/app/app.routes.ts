import { Routes } from "@angular/router"
import { TrendingPageComponent } from "./pages/trending-page/trending-page.component"
import { ArticlePageComponent } from "./pages/article-page/article-page.component"

export const routes: Routes = [
	{
		path: "",
		component: TrendingPageComponent
	},
	{
		path: "article/:uuid",
		component: ArticlePageComponent
	}
]
