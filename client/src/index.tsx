import React from 'react';
import { createRoot } from 'react-dom/client';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { AppProvider } from './components/app/AppProvider';
import App from './components/app/App';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from './redux/store';
import { ACCESS_TOKEN_KEY, ALGOLIA_API_KEY, ALGOLIA_APP_ID, DEV_SERVER_URI, GOOGLE_CLIENT_ID } from './constants';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, HttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { Preferences } from '@capacitor/preferences';
import algoliasearch from 'algoliasearch';
import { InstantSearch } from 'react-instantsearch-dom';

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

const httpLink = new HttpLink({
  uri: process.env.NODE_ENV === 'production'
    ? '/graphql'
    : `${DEV_SERVER_URI}/graphql`,
  credentials: process.env.NODE_ENV === 'production'
    ? 'same-origin'
    : 'include',
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const accessToken = await Preferences.get({
    key: ACCESS_TOKEN_KEY,
  })
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      accesstoken: accessToken.value,
    }
  }
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/subscriptions',
}));

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});



const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <AppProvider>
            <InstantSearch searchClient={searchClient} indexName="posts">
            <App/>
            </InstantSearch>
          </AppProvider>
        </ApolloProvider>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
