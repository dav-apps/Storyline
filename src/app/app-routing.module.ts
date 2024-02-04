import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { StartPageComponent } from "./pages/start-page/start-page.component"
import { ArticlePageComponent } from "./pages/article-page/article-page.component"

const routes: Routes = [
	{
		path: "",
		component: StartPageComponent
	},
	{
		path: "article/:uuid",
		component: ArticlePageComponent
	}
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
