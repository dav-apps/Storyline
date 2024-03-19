import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import {
	BrowserModule,
	provideClientHydration
} from "@angular/platform-browser"
import { ServiceWorkerModule } from "@angular/service-worker"
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome"
import { Environment } from "dav-js"
import { environment } from "src/environments/environment"

// Local modules
import { GraphQLModule } from "./graphql.module"
import { AppRoutingModule } from "./app-routing.module"

// Apollo
import { HttpClientModule } from "@angular/common/http"
import { ApolloModule } from "apollo-angular"

// Components
import { AppComponent } from "./app.component"
import { ArticleListComponent } from "./components/article-list/article-list.component"
import { HorizontalPublisherListComponent } from "./components/horizontal-publisher-list/horizontal-publisher-list.component"
import { LoadingScreenComponent } from "./components/loading-screen/loading-screen.component"

// Dialogs
import { LoginPromptDialogComponent } from "./dialogs/login-prompt-dialog/login-prompt-dialog.component"
import { LogoutDialogComponent } from "./dialogs/logout-dialog/logout-dialog.component"
import { UpgradePlusDialogComponent } from "./dialogs/upgrade-plus-dialog/upgrade-plus-dialog.component"
import { PublisherDialogComponent } from "./dialogs/publisher-dialog/publisher-dialog.component"
import { CreateFeedDialogComponent } from "./dialogs/create-feed-dialog/create-feed-dialog.component"
import { FeedSettingsDialogComponent } from "./dialogs/feed-settings-dialog/feed-settings-dialog.component"

// Pages
import { StartPageComponent } from "./pages/start-page/start-page.component"
import { BookmarksPageComponent } from "./pages/bookmarks-page/bookmarks-page.component"
import { AdminPageComponent } from "./pages/admin-page/admin-page.component"
import { AdminPublisherPageComponent } from "./pages/admin-publisher-page/admin-publisher-page.component"
import { UserPageComponent } from "./pages/user-page/user-page.component"
import { SettingsPageComponent } from "./pages/settings-page/settings-page.component"
import { DiscoverPageComponent } from "./pages/discover-page/discover-page.component"
import { PublishersPageComponent } from "./pages/publishers-page/publishers-page.component"
import { ArticlePageComponent } from "./pages/article-page/article-page.component"
import { PublisherPageComponent } from "./pages/publisher-page/publisher-page.component"

// Services
import { ApiService } from "./services/api-service"
import { DavApiService } from "./services/dav-api-service"
import { DataService } from "./services/data-service"
import { LocalizationService } from "./services/localization-service"
import { SettingsService } from "./services/settings-service"

@NgModule({
	declarations: [
		AppComponent,
		ArticleListComponent,
		HorizontalPublisherListComponent,
		LoadingScreenComponent,
		LoginPromptDialogComponent,
		LogoutDialogComponent,
		UpgradePlusDialogComponent,
		PublisherDialogComponent,
		CreateFeedDialogComponent,
		FeedSettingsDialogComponent,
		StartPageComponent,
		BookmarksPageComponent,
		AdminPageComponent,
		AdminPublisherPageComponent,
		UserPageComponent,
		SettingsPageComponent,
		DiscoverPageComponent,
		PublishersPageComponent,
		ArticlePageComponent,
		PublisherPageComponent
	],
	imports: [
		BrowserModule,
		FontAwesomeModule,
		ApolloModule,
		HttpClientModule,
		AppRoutingModule,
		GraphQLModule,
		ServiceWorkerModule.register("sw.js", {
			enabled:
				environment.environment == Environment.Staging ||
				environment.environment == Environment.Production
		})
	],
	providers: [
		ApiService,
		DavApiService,
		DataService,
		LocalizationService,
		SettingsService,
		provideClientHydration()
	],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
