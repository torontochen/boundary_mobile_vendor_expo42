// import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {  Platform } from 'react-native'

import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { onError } from "apollo-link-error";
import { ApolloLink, Observable } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { setContext } from "apollo-link-context";
import { persistCache } from "apollo-cache-persist";

import resolvers from "./resolvers/resolvers";
import defaultStates from "./resolvers/defaultStates";

const cache = new InMemoryCache({});
cache.writeData({ data: defaultStates });


// persistCache({
//   cache,
//   storage: AsyncStorage,
// });
const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  // const token = localStorage.getItem('token');
  // await AsyncStorage.removeItem("token");
  let token = await AsyncStorage.getItem("vendorToken");
  // console.log("token");
  // console.log(token);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
// const request = async (operation) => {
// operation adds the token to an authorization header that is to be sent to server
// await AsyncStorage.removeItem("token");
// let token = await AsyncStorage.getItem("token");
// console.log("token");
// console.log(token);
// : localStorage.getItem("vendortoken");

// operation.setContext({
//   headers: {
//     // authorization: token ? `Bearer ${token}` : "",
//     authorization: token ? token : "",
//   },
// });
// }
// };

// set up the request handlers for the http clients
const requestLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    let handle;
    Promise.resolve(operation)
      .then((oper) => {
        // request(oper);
        // console.log(oper);
      })
      .then(() => {
        handle = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });
      })
      .catch(observer.error.bind(observer));
    return () => {
      if (handle) handle.unsubscribe();
    };
  });
});

// Set up websocket link for subscriptions
const wsLink = ApolloLink.from([
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.log(
          `[GraphQL error]: Message: ${err.message},Location: ${err.locations}, Path: ${err.path}`
        );
        if (err.name === "AuthenticationError") {
          console.log('wslink',err);
          if(AsyncStorage.token){
            (async () => {
              await AsyncStorage.removeItem("vendorToken");
              await AsyncStorage.clear();
            })();
          }
        }
      }
    }
    if (networkError) {
      try {
        console.log('networkError',networkError)
        JSON.parse(networkError.bodyText);
      } catch (e) {
        // If not replace parsing error message with real one
        networkError.message = networkError.bodyText;
      }
      console.log("[networkError]", networkError);
    }
  }),

  requestLink,

  new WebSocketLink({
    // uri: `wss://vueload.herokuapp.com/graphql`,
    uri: `ws://localhost:4000/graphql`,
    options: {
      reconnect: true,
      connectionParams: () => {
        if (AsyncStorage.token) {
          const token = AsyncStorage.getItem("vendorToken");
          return {
            Authorization: `Bearer ${token}`,
          };
        }
        // if (localStorage.vendortoken) {
        //   const token = localStorage.getItem("vendortoken");
        //   return {
        //     Authorization: `Bearer ${token}`,
        //   };
        // }
      },
    },
  }),
]);

// HTTP link for queries and mutations
const httpLink = ApolloLink.from([
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err);
        if (err.name === "AuthenticationError") {
          console.log('httplink',err.name);
          // if(AsyncStorage.token){
            // (async () => {
            //   await AsyncStorage.removeItem("token");
            //   await AsyncStorage.clear();
            // })();

            (async () => {

              // AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove)
              // await AsyncStorage.removeItem("token");
              // await AsyncStorage.clear();
            const asyncStorageKeys = await AsyncStorage.getAllKeys()
            console.log('asyncStorageKeys',asyncStorageKeys)
              if (asyncStorageKeys.length > 0) {
                if (Platform.OS === 'android') {

                  await AsyncStorage.clear();
                }
                if (Platform.OS === 'ios') {
                  
                  try {
                    // await AsyncStorage.removeItem("token");
                  await AsyncStorage.multiRemove(asyncStorageKeys);

                  // await AsyncStorage.clear();

                  } catch (err) {
                    console.log(err);
                  }
                  // await AsyncStorage.removeItem("token");
                }
          }
            })();
          // }

          // (async () => {
          //   await AsyncStorage.removeItem("token");
          //   await AsyncStorage.clear();
          // })();

          // try {
          //   await AsyncStorage.removeItem("token");
            
          //   navigation.replace("DashBoard");
          //   // await AsyncStorage.clear();
          //   // await client.clearStore();
          // } catch (err) {
          //   console.log(err);
          // }
        }
        if (err.name === "GraphQLError") {
          console.log(err.message);
        }
      }
    }
    if (networkError) {
      try {
        JSON.parse(networkError.bodyText);
      } catch (e) {
        // If not replace parsing error message with real one
        networkError.message = networkError.bodyText;
      }
      console.log("[networkError", networkError);
    }
  }),

  requestLink,

  // Create file upload link
  new createUploadLink({
    // uri: `https://vueload.herokuapp.com/graphql`,
    uri: `http://localhost:4000/graphql`,
    credentials: "include",
  }),
]);

// Link to direct ws and http traffic to the correct place
const link = ApolloLink.split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  authLink.concat(httpLink)
);

// Set up apolloClient and apolloProvider
const defaultClient = new ApolloClient({
  cache,
  link,
  resolvers,
});

// console.log('defaultclient', defaultClient)

export default defaultClient;
