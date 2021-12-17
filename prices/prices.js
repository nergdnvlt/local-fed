// External Dependencies
const fs = require("fs");
const { ApolloServer, gql } = require("apollo-server");
const { buildSubgraphSchema } = require("@apollo/federation")

// Internal Dependencies
const typeDefs = gql(fs.readFileSync("./prices.graphql", 'utf8'));
const prices = require("./data/prices.js");

// Variable Definitions
const port = process.env.PORT || 4002

const resolvers = {
    Price: {
        __resolveReference(object) {
            return prices.find((price) => price.id === parseInt(object.id, 10));
        },
    },
    Query: {
        price(_, { id }) {
            return prices.find((price) => price.id === parseInt(id, 10));
        },
        prices() {
            return prices
        }
    }
};

// Apollo Server Setup
const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});
  
server.listen({ port }).then(({ url }) => {
    console.log(`Prices service ready at ${url}`);
});
