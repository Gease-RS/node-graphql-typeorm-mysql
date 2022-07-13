import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { Users } from "../../Entities/Users";
import { UserType } from "../typeDefs/User";

export const GET_ALL_USERS = {
    type: new GraphQLList(UserType),
    async resolve() {
        const result = await Users.find();
        return result
    }
}

export const GET_USER = {
    type: UserType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    async resolve(_: any, args: any) {
        const result = await Users.findOneBy({ id: args.id });
        return result
    }
}

