import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { StartPageComponent } from "./pages/start-page/start-page.component"
import { ArticlePageComponent } from "./pages/article-page/article-page.component"
import { PublisherPageComponent } from "./pages/publisher-page/publisher-page.component"

const routes: Routes = [
	{
		path: "",
		component: StartPageComponent
	},
	{
		path: "article/:uuid",
		component: ArticlePageComponent
	},
	{
		path: "publisher/:uuid",
		component: PublisherPageComponent
	}
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
