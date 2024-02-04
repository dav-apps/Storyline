import { Injectable } from "@angular/core"
import { Apollo, gql } from "apollo-angular"
import { ApolloQueryResult, ErrorPolicy } from "@apollo/client/core"
import { List, ArticleResource } from "../types"

const errorPolicy: ErrorPolicy = "all"

@Injectable()
export class ApiService {
	constructor(private apollo: Apollo) {}

	async retrieveArticle(queryData: string, variables: { uuid: string }) {
		return await this.apollo
			.query<{
				retrieveArticle: ArticleResource
			}>({
				query: gql`
				query RetrieveArticle($uuid: String!) {
					retrieveArticle(uuid: $uuid) {
						${queryData}
					}
				}
			`,
				variables,
				errorPolicy
			})
			.toPromise()
	}

	async listArticles(
		queryData: string,
		variables: { limit?: number; offset?: number }
	): Promise<
		ApolloQueryResult<{ listArticles: List<ArticleResource> }> | undefined
	> {
		return await this.apollo
			.query<{
				listArticles: List<ArticleResource>
			}>({
				query: gql`
					query ListArticles($limit: Int, $offset: Int) {
						listArticles(limit: $limit, offset: $offset) {
							${queryData}
						}
					}
				`,
				variables,
				errorPolicy
			})
			.toPromise()
	}
}
