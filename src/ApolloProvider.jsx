import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as Provider,
  split,
  defaultDataIdFromObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

const { hostname } = window.location;

const envProd = true;
export const END_POINT = envProd
? 'https://api.roberp.fr'
: `http://${hostname}:8000`;
const uri = envProd
  ? 'https://api.roberp.fr/graphql'
  : `http://${hostname}:8000/graphql`;
const wss = envProd
  ? 'wss://api.roberp.fr/graphql'
  : `ws://${hostname}:8000/graphql`;

let httpLink = createUploadLink({
  uri: uri
});

const authLink = setContext((_, { headers }) => {
  // // get the authentication token from local storage if it exist
  const token = JSON.parse(localStorage.getItem('token')) || '';
  // return the headers to the context so httpLink can read them+
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : '',
    },
  };
});

httpLink = authLink.concat(httpLink);

const wsLink = new WebSocketLink({
  uri: wss,
  options: {
    reconnect: true,
    connectionParams: {
      JWT: `${JSON.parse(localStorage.getItem('token')) || ''}`,
    },
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

// const splitLink = split(
//     ({ query }) => {
//       const definition = getMainDefinition(query)
//       return (
//         definition.kind === 'OperationDefinition'
//       )
//     },
//     httpLink,
//   )


const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    dataIdFromObject: (object) => {
      switch (object.__typename) {
        case 'DataType':
          return object.key; // use `key` as the primary key
        default:
          return defaultDataIdFromObject(object); // fall back to default handling
      }
    },
  }),
});

export default function ApolloProvider(props) {
  return <Provider client={client} {...props} />;
}
