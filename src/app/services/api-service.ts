import { Injectable } from "@angular/core"
import { Apollo, gql } from "apollo-angular"
import { ApolloQueryResult, ErrorPolicy } from "@apollo/client/core"
import { List, PublisherResource, ArticleResource } from "../types"

const errorPolicy: ErrorPolicy = "all"

@Injectable()
export class ApiService {
	constructor(private apollo: Apollo) {}

	async retrievePublisher(
		queryData: string,
		variables: { uuid: string; limit?: number; offset?: number }
	): Promise<ApolloQueryResult<{ retrievePublisher: PublisherResource }>> {
		let limitParam = queryData.includes("limit") ? "$limit: Int" : ""
		let offsetParam = queryData.includes("offset") ? "$offset: Int" : ""

		return await this.apollo
			.query<{
				retrievePublisher: PublisherResource
			}>({
				query: gql`
					query RetrievePublisher(
						$uuid: String!
						${limitParam}
						${offsetParam}
					) {
						retrievePublisher(uuid: $uuid) {
							${queryData}
						}
					}
				`,
				variables,
				errorPolicy
			})
			.toPromise()
	}

	async retrieveArticle(
		queryData: string,
		variables: { uuid: string }
	): Promise<ApolloQueryResult<{ retrieveArticle: ArticleResource }>> {
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
		variables: { publishers?: string[]; limit?: number; offset?: number }
	): Promise<
		ApolloQueryResult<{ listArticles: List<ArticleResource> }> | undefined
	> {
		return await this.apollo
			.query<{
				listArticles: List<ArticleResource>
			}>({
				query: gql`
					query ListArticles(
						$publishers: [String!]
						$limit: Int
						$offset: Int
					) {
						listArticles(
							publishers: $publishers
							limit: $limit
							offset: $offset
						) {
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
