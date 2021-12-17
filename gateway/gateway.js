const { ApolloGateway } = require("@apollo/gateway");
const { ApolloServer } = require("apollo-server");

const port = process.env.PORT || 4000

const gateway = new ApolloGateway({
    serviceList: [
        { name: "products", url: "http://localhost:4001" },
        { name: "prices", url: "http://localhost:4002" },
        { name: "users", url: "http://localhost:4003" },
        { name: "orders", url: "http://localhost:4004" }
    ]
});

const server = new ApolloServer({
    gateway,
    subscriptions: false,
});

server.listen({ port }).then(({ url }) => {
    console.log(`Gateway ready at ${ url }`);
});