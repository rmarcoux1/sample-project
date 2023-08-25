import { request, gql } from "graphql-request";

async function testAppSyncAPI() {
  try {
    const endpoint = "https://7zfbslbdi5h6xojik6tzjbjnbe.appsync-api.us-east-1.amazonaws.com/graphql"; // Replace with your actual AppSync API endpoint

    const graphQLClient = new GraphQLClient(endpoint, {
    });

    // Replace "YOUR_BOOK_ID" with the actual ID of the book you want to retrieve
    const bookId = "YOUR_BOOK_ID";

    const query = gql`
      query GetCharacter($id: ID!) {
        getCharacter(id: $id) {
            name: String!
            height: Int!
        }
      }
    `;

    const variables = {
      id: bookId,
    };

    const response = await graphQLClient.request(query, variables);
    const book = response.getBook;
    console.log("Book:", response);
  } catch (error) {
    console.error("Error fetching book:", error);
  }
}

// Call the test function
testAppSyncAPI();
