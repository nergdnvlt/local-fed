const fs = require("fs");
const { ApolloServer, gql } = require("apollo-server");
const { buildSubgraphSchema } = require("@apollo/federation")
const typeDefs = gql(fs.readFileSync("./users.graphql", 'utf8'));
const users = require("./data/users.js");

const port = process.env.PORT || 4003

const resolvers = {
    User: {
        __resolveReference(object) {
            return users.find((user) => user.id === parseInt(object.id, 10));
        },
    },
    Query: {
        user(_, { id }) {
            return users.find((user) => user.id === parseInt(id, 10));
        },
        users() {
            return users
        }
    }
};

const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  });
  
  server.listen({ port }).then(({ url }) => {
    console.log(`Users service ready at ${url}`);
  });
