import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { StartPageComponent } from "./pages/start-page/start-page.component"
import { AdminPageComponent } from "./pages/admin-page/admin-page.component"
import { AdminPublisherPageComponent } from "./pages/admin-publisher-page/admin-publisher-page.component"
import { UserPageComponent } from "./pages/user-page/user-page.component"
import { SettingsPageComponent } from "./pages/settings-page/settings-page.component"
import { DiscoverPageComponent } from "./pages/discover-page/discover-page.component"
import { ArticlePageComponent } from "./pages/article-page/article-page.component"
import { PublisherPageComponent } from "./pages/publisher-page/publisher-page.component"

const routes: Routes = [
	{
		path: "",
		component: StartPageComponent
	},
	{
		path: "admin",
		component: AdminPageComponent
	},
	{
		path: "admin/publisher/:uuid",
		component: AdminPublisherPageComponent
	},
	{
		path: "user",
		component: UserPageComponent
	},
	{
		path: "settings",
		component: SettingsPageComponent
	},
	{
		path: "discover",
		component: DiscoverPageComponent
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
