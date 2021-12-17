// Dependencies
const fs = require("fs");
const { ApolloServer, gql } = require("apollo-server");
const { buildSubgraphSchema } = require("@apollo/federation")
const pry = require("pryjs");

// Internal imports
const typeDefs = gql(fs.readFileSync("./orders.graphql", 'utf8'));
const orders = require("./data/orders.js");

// Variable Definitions
const port = process.env.PORT || 4004

const resolvers = {
    User: {
        orders(user) {
            return orders.filter((order) => order.userId === parseInt(user.id));
        }
    },
    Order: {
        products(order) {
            return order.products.map((product) => ({ __typename: "Product", id: product }));
        },
        user(order) {
            return { __typename: "User", id: order.userId };
        }
    },
    Query: {
        order(_, { id }) {
            return orders.find((order) => order.id === parseInt(id, 10));
        },
        orders() {
            return orders
        }
    }
};

// Apollo Server Setup
const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});
  
server.listen({ port }).then(({ url }) => {
    console.log(`Products service ready at ${url}`);
});
