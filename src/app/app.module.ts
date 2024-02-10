import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"

// Local modules
import { GraphQLModule } from "./graphql.module"
import { AppRoutingModule } from "./app-routing.module"

// Apollo
import { HttpClientModule } from "@angular/common/http"
import { ApolloModule } from "apollo-angular"

// Components
import { AppComponent } from "./app.component"

// Pages
import { StartPageComponent } from "./pages/start-page/start-page.component"
import { ArticlePageComponent } from "./pages/article-page/article-page.component"
import { PublisherPageComponent } from "./pages/publisher-page/publisher-page.component"

// Services
import { ApiService } from "./services/api-service"
import { DataService } from "./services/data-service"

@NgModule({
	declarations: [
		AppComponent,
		StartPageComponent,
		ArticlePageComponent,
		PublisherPageComponent
	],
	imports: [
		BrowserModule,
		ApolloModule,
		HttpClientModule,
		AppRoutingModule,
		GraphQLModule
	],
	providers: [ApiService, DataService],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
