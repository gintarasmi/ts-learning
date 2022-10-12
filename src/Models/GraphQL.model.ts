import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

export const AddressType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Address',
  description: 'Defines where a house is',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLString) },
    city: { type: GraphQLNonNull(GraphQLString) },
    street: { type: GraphQLNonNull(GraphQLString) },
    houseNumber: { type: GraphQLNonNull(GraphQLString) },
    flatNumber: { type: GraphQLString }
  })
});
