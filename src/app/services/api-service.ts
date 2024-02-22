import { Injectable } from "@angular/core"
import { Apollo, ApolloBase, MutationResult, gql } from "apollo-angular"
import { ApolloQueryResult, ErrorPolicy } from "@apollo/client/core"
import { renewSession } from "dav-js"
import { List, PublisherResource, ArticleResource } from "../types"
import * as ErrorCodes from "../errorCodes"
import { storylineApiClientName } from "../constants"

const errorPolicy: ErrorPolicy = "all"

@Injectable()
export class ApiService {
	private apollo: ApolloBase

	constructor(private apolloProvider: Apollo) {
		this.loadApolloClient()
	}

	loadApolloClient() {
		this.apollo = this.apolloProvider.use(storylineApiClientName)
	}

	//#region Publisher
	async createPublisher(
		queryData: string,
		variables: {
			name: string
			description: string
			url: string
			logoUrl: string
		}
	): Promise<MutationResult<{ createPublisher: PublisherResource }>> {
		let result = await this.apollo
			.mutate<{
				createPublisher: PublisherResource
			}>({
				mutation: gql`
					mutation CreatePublisher(
						$name: String!
						$description: String!
						$url: String!
						$logoUrl: String!
					) {
						createPublisher(
							name: $name
							description: $description
							url: $url
							logoUrl: $logoUrl
						) {
							${queryData}
						}
					}
				`,
				variables,
				errorPolicy
			})
			.toPromise()

		if (
			result.errors != null &&
			result.errors.length > 0 &&
			result.errors[0].extensions["code"] == ErrorCodes.sessionEnded
		) {
			// Renew the access token and run the query again
			await renewSession()

			return await this.createPublisher(queryData, variables)
		}

		return result
	}

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

	async listPublishers(
		queryData: string,
		variables: { random?: boolean; limit?: number; offset?: number }
	): Promise<ApolloQueryResult<{ listPublishers: List<PublisherResource> }>> {
		return await this.apollo
			.query<{
				listPublishers: List<PublisherResource>
			}>({
				query: gql`
					query ListPublishers(
						$random: Boolean
						$limit: Int
						$offset: Int
					) {
						listPublishers(
							random: $random
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
	//#endregion

	//#region Article
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
	//#endregion
}
