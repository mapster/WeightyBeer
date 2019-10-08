import { GraphQLSchema, GraphQLSchemaConfig, GraphQLObjectType, GraphQLFieldConfig, GraphQLNamedType } from "graphql";
import { PubSub } from "graphql-subscriptions";

export const WEIGHT_UPDATED_EVENT = "weightUpdated";

/**
 * This is a "hack" solution as the typegql library doesn't support subscriptons.
 * 
 * @param pubsub The pubsub service
 * @param schema The GraphQL Schema to append the subscriptions to.
 */

export function addSubscriptions(pubsub: PubSub, schema: GraphQLSchema): GraphQLSchema {
    const config: GraphQLSchemaConfig = schema.toConfig();
    
    return new GraphQLSchema({
        ...config,
        subscription: createSubscription(pubsub, config)
    });
}

function createSubscription(pubsub: PubSub, config: GraphQLSchemaConfig): GraphQLObjectType {
    const weightType = (config.types as GraphQLNamedType[]).find(x => x.name === "Weight") as GraphQLObjectType;

    const allRootFields: { [key: string]: GraphQLFieldConfig<any, any> } = {};
    allRootFields.weightUpdated = {type: weightType, subscribe: () => {
        return pubsub.asyncIterator(WEIGHT_UPDATED_EVENT);
    }};

    return new GraphQLObjectType({
        name: 'Subscription',
        fields: allRootFields
    });
}
