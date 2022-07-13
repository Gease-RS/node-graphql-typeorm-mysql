import { GraphQLBoolean, GraphQLID, GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { Users } from "../../Entities/Users";
import { UserType } from "../typeDefs/User";
import bcrypt, { compare } from "bcryptjs";
import { MessageType } from "../typeDefs/Message";

const comparePassword = async (password: string, oldPassword: string) =>
  await compare(oldPassword, password);

  const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

export const CREATE_USER = {
    type: UserType,
    args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString }
    },
    async resolve(_: any, args: any) {
        const { name, email, password, created_at, updated_at } = args;

        const encrybcryptPassword = await bcrypt.hash(password, 10) 
        
        const result = await Users.insert({ 
            name, 
            email, 
            password: encrybcryptPassword, 
            created_at, 
            updated_at 
        });

        console.log(result);

        return {
         ...args,
            id: result.identifiers[0].id,
            password: encrybcryptPassword
        }
    }
}

export const DELETE_USER = {
    type: GraphQLBoolean,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    async resolve(_: any, { id }: any) {
      const result = await Users.delete({ id });
      if (result.affected! > 0) return true;
      return false;
    },
  }

  export const UPDATE_USER = {
    type: MessageType,
    args: {
      id: { type: GraphQLID },
      input: {
        type: new GraphQLInputObjectType({
          name: "UserInput",
          fields: () => ({
            name: { type: GraphQLString },
            email: { type: GraphQLString },
            oldPassword: { type: GraphQLString },
            newPassword: { type: GraphQLString },
          }),
        }),
      },
    },
    async resolve(_: any, { id, input }: any) {
      const userFound = await Users.findOneBy({ id });
      if (!userFound) throw new Error("User not found");
  
      const isMatch = await comparePassword(
        userFound?.password as string,
        input.oldPassword
      );
      if (!isMatch) throw new Error("Passwords does not match");
  
      const newPassword = await hashPassword(input.newPassword);
      delete input.oldPassword;
      delete input.newPassword;
  
      input.password = newPassword;
  
      const response = await Users.update({ id }, input);
  
      if (response.affected === 0) return { message: "User not found" };
  
      return {
        success: true,
        message: "Update User successfully",
      };
    },
  };