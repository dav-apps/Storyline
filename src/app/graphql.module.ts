import { APOLLO_NAMED_OPTIONS, ApolloModule } from "apollo-angular"
import { HttpLink } from "apollo-angular/http"
import { NgModule } from "@angular/core"
import { InMemoryCache } from "@apollo/client/core"
import { davApiClientName, storylineApiClientName } from "./constants"
import { dataIdFromObject } from "./utils"
import { environment } from "../environments/environment"

export function createApollo(httpLink: HttpLink) {
	return {
		[davApiClientName]: {
			cache: new InMemoryCache({ dataIdFromObject }),
			link: httpLink.create({
				uri: environment.davApiUrl
			})
		},
		[storylineApiClientName]: {
			cache: new InMemoryCache({ dataIdFromObject }),
			link: httpLink.create({
				uri: environment.storylineApiUrl
			})
		}
	}
}

@NgModule({
	exports: [ApolloModule],
	providers: [
		{
			provide: APOLLO_NAMED_OPTIONS,
			useFactory: createApollo,
			deps: [HttpLink]
		}
	]
})
export class GraphQLModule {}
