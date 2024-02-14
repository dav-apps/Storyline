import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome"

// Local modules
import { GraphQLModule } from "./graphql.module"
import { AppRoutingModule } from "./app-routing.module"

// Apollo
import { HttpClientModule } from "@angular/common/http"
import { ApolloModule } from "apollo-angular"

// Components
import { AppComponent } from "./app.component"
import { LoadingScreenComponent } from "./components/loading-screen/loading-screen.component"

// Pages
import { StartPageComponent } from "./pages/start-page/start-page.component"
import { UserPageComponent } from "./pages/user-page/user-page.component"
import { ArticlePageComponent } from "./pages/article-page/article-page.component"
import { PublisherPageComponent } from "./pages/publisher-page/publisher-page.component"

// Services
import { ApiService } from "./services/api-service"
import { DataService } from "./services/data-service"
import { LocalizationService } from "./services/localization-service"

@NgModule({
	declarations: [
		AppComponent,
		LoadingScreenComponent,
		StartPageComponent,
		UserPageComponent,
		ArticlePageComponent,
		PublisherPageComponent
	],
	imports: [
		BrowserModule,
		FontAwesomeModule,
		ApolloModule,
		HttpClientModule,
		AppRoutingModule,
		GraphQLModule
	],
	providers: [ApiService, DataService, LocalizationService],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
