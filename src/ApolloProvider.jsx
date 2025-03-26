import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as Provider,
  split,
  defaultDataIdFromObject,
} from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { getToken, refreshToken } from './_shared/graphql/provider/auth';
import { ApolloLink } from '@apollo/client/core';

const { hostname } = window.location;

const envProd = false;
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
  const token = getToken();
  // return the headers to the context so httpLink can read them+
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : '',
    },
  };
});
// 📌 **3. Gestion des erreurs et rafraîchissement du token**
const errorLink = onError(({ graphQLErrors, networkError, operation, forward  }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err && err.code) {
        switch (err.code) {
          // Handle missing refresh tokens (when trying to refresh a JWT)
          case 'expired_token':
          // Retry queries/mutations after attempting to refetch a valid JWT
            // Modify the operation context with a new token
            
        return refreshToken(client).then((newToken) => {
          if (!newToken) {
            console.error("Token expiré et rafraîchissement échoué.");
            return;
          }
          operation.setContext(({ headers = {} }) => ({
            headers: {
              ...headers,
              authorization: `JWT ${newToken}`,
            },
          }));
          return forward(operation);
        });
        }
      }
    }
  }
  // To retry on network errors, we recommend the RetryLink
  // instead of the onError link. This just logs the error.
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const CheckErrorLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    if(response.data){
      for (const [key, value] of Object.entries(response.data)) {
        if(!value.success){
          if(value.errors && value.errors.nonFieldErrors){
            for (let err of value.errors.nonFieldErrors) {
              if (err && err.code) {
                switch (err.code) {
                  // Handle missing refresh tokens (when trying to refresh a JWT)
                  case "unauthenticated" : console.log("unauthenticated"); 
                }
              }
            }
          }
        }
      }
    }
    return response;
  });
});

httpLink = authLink.concat(httpLink)
httpLink = errorLink.concat(httpLink)
httpLink = CheckErrorLink.concat(httpLink)

const wsLink = new WebSocketLink({
  uri: wss,
  options: {
    reconnect: true,
    connectionParams: {
      JWT: `${getToken()}`,
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
