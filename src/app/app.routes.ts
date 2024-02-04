import { Routes } from "@angular/router"
import { StartPageComponent } from "./pages/start-page/start-page.component"
import { ArticlePageComponent } from "./pages/article-page/article-page.component"

export const routes: Routes = [
	{
		path: "",
		component: StartPageComponent
	},
	{
		path: "article/:uuid",
		component: ArticlePageComponent
	}
]
