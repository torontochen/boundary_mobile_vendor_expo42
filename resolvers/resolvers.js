const resolvers = {
  Mutation: {
    setAuth: (_, { isAuthed }, { cache }) => {
      const data = {
        auth: {
          isAuthed,
          __typename: "auth",
        },
      };
      cache.writeData({ data });
      return null;
    },

    setAuthError: (_, { errMsg }, { cache }) => {
      const data = {
        authError: {
          errMsg,
          __typename: "authError",
        },
      };
      cache.writeData({ data });
      return null;
    },

    setGuildEnrolled: (_, { isEnrolled }, { cache }) => {
      const data = {
        guildEnrolled: {
          isEnrolled,
          __typename: "guildEnrolled"
        }
      }
      cache.writeData({data})
      return null
    },

    setLandingPageShowed: (_, { showed }, { cache }) => {
      const data = {
        landingPageShowed: {
          showed,
          __typename: "landingPageShowed",
        },
      };
      cache.writeData({ data });
      return null;
    },

    setInitLocation: (_, { initLat, initLng }, { cache }) => {
      const data = {
        initLocation: {
          initLat,
          initLng,
          __typename: "initLocation",
        },
      };
      cache.writeData({ data });
      return null;
    },

    setShoppingCartCount: (_, { count }, { cache }) => {
      const data = {
        shoppingCartCount: {
          count,
          __typename: "shoppingCartCount"
        }
      }
      cache.writeData({ data })
      return null
    }

    // setActiveFlyerLocal:(_, {
    //   businessTitle, 
    //   logo, 
    //   businessCategory, 
    //   flyerId, 
    //   flyerTitle, 
    //   flyerType, 
    //   dateFrom, 
    //   dateTo, 
    //   promoInfo}, { cache }) => {
    //   const data = {
    //     activeFlyer: {
    //       businessTitle,
    //       logo,
    //       businessCategory,
    //       flyerId, 
    //       flyerTitle, 
    //       flyerType, 
    //       dateFrom, 
    //       dateTo, 
    //       promoInfo,
    //       __typename: "activeFlyer" 
    //     }
    //   };
    //   cache.writeData({ data });
    //   return null
    // }
  },
};

export default resolvers;
