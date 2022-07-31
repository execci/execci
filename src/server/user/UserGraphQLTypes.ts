import { schemaComposer } from 'graphql-compose';

export type Person = {
  displayName: string;
};

export type UnregisteredPerson = Person;

schemaComposer.createInterfaceTC<Person>({
  fields: {
    displayName: 'String!',
  },
  name: 'Person',
  resolveType: (obj: Person): string => {
    if ('_id' in obj) {
      return 'User';
    } else {
      return 'UnregisteredPerson';
    }
  },
});

export const UnregisteredPersonGraphQLType =
  schemaComposer.createObjectTC<UnregisteredPerson>({
    fields: {
      displayName: 'String!',
    },
    interfaces: ['Person'],
    name: 'UnregisteredPerson',
  });

export const UserGraphQLType = schemaComposer.createObjectTC<Express.User>({
  fields: {
    _id: 'String!',
    displayName: 'String!',
    emailAddress: 'String!',
  },
  interfaces: ['Person'],
  name: 'User',
});

export const CurrentUserGraphQLType = schemaComposer.createObjectTC({
  fields: {
    user: 'User',
  },
  name: 'CurrentUser',
});

export type CurrentUserPayload = {
  user: Express.User | undefined;
};
