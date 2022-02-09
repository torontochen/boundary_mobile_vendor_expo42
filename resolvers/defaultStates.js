const defaultStates = {
  auth: {
    isAuthed: false,
    __typename: "auth",
  },

  authError: {
    errMsg: "",
    __typename: "authError",
  },

  guildEnrolled: {
    isEnrolled: false,
    __typename: "guildEnrolled"
  },

  landingPageShowed: {
    showed: false,
    __typename: "landingPageShowed",
  },

  initLocation: {
    initLat: 0,
    initLng: 0,
    __typename: "initLocation",
  },

  shoppingCartCount: {
    count: 0,
    __typename: "shoppingCartCount"
  }

//   activeFlyer: {
//     businessTitle: "",
//     logo: "",
//     businessCategory: "",
//      flyerId: "",
//     flyerTitle: "",
//     flyerType: "",
//     dateFrom: "",
//     dateTo: "",
//     promoInfo: "",
//     __typename: "activeFlyer",
//   },

//   singleActiveFlyer: {
//     flyerId: "",
//     flyerTitle: "",
//     flyerType: "",
//     dateFrom: "",
//     dateTo: "",
//     promoInfo: "",
//     __typename: "singleActiveFlyer"
// }
};

export default defaultStates;
