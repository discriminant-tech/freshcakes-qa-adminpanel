import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { ServerUrl } from '../ServerURL/serverURL'
import { from } from 'apollo-link';

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
};
const httpLink = createHttpLink({
  uri: ServerUrl,
  credentials: 'same-origin'
});


const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = sessionStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  //console.log("------------------");
  console.log(token);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// local host
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),

  defaultOptions: defaultOptions,
});
export const execGql = function (gqlType, gqlTypeName, gqlVariables) {

  const promise = new Promise((resolve, reject) => {
    //console.log("2");

    if (gqlType == 'mutation') {

      client.mutate({ mutation: gqlTypeName, variables: gqlVariables })
        .then(result => { resolve(result) })
        .catch(err => {

          const errorsGql = err.graphQLErrors.map(graphQLerror => graphQLerror.message);
          const errorMessageGql = errorsGql.join();
          reject({ 'errorsGql': errorsGql, 'errorMessageGql': errorMessageGql })
        })

    }
    if (gqlType == 'query') {

      client.query({ query: gqlTypeName, variables: gqlVariables })
        .then(result => { resolve(result) })
        .catch(err => {
          const errorsGql = err.graphQLErrors.map(graphQLerror => graphQLerror.message);
          const errorMessageGql = errorsGql.join();
          reject({ 'errorsGql': errorsGql, 'errorMessageGql': errorMessageGql })
        })
    }

  });
  return promise;
}


