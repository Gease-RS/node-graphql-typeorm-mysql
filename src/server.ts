import express from "express";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./schema";
import { AppDataSource } from "./schema/data-source";

AppDataSource.initialize()
  .then(() => {
    const app = express();

    app.use(express.json());

    app.use(
      "/graphql",
      graphqlHTTP({
        graphiql: true,
        schema: schema,
      })
    )

    const port = process.env.PORT || 3333;

    return app.listen(port, () => {
      console.log("Server is running on port " + port);
    });
  })
  .catch((error) => console.log(error));
