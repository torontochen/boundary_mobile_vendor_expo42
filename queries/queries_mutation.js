import gql from "graphql-tag";

// Mutations


export const CHANGE_POSTALCODE = gql`
  mutation(
    $email: String!
    $postalCode: String!
    $initialLat: Float
    $initialLng: Float
  ) {
    changePostalCode(
      email: $email
      postalCode: $postalCode
      initialLat: $initialLat
      initialLng: $initialLng
    ) {
      postalCode
      initialLat
      initialLng
    }
  }
`;

export const COMMIT_GUILD_DEALS = gql`
  mutation($input: GuildDealsCommitedInput) {
    commitGuildDeals(input: $input) {
      guildDealId
      vendor
      vendorLogo
      dateFrom
      dateTo
      guildDealType
      redeemTerm
      transactions {
        transactionId
        resident
        vendor
        purchaseAmount
        date
      }
      specificItemList
        guildDealLevels {
            guildDealCondition
            guildDealAmount
            rewardItemsSelected
            rewardAmount
        }
    }
  }`;

export const JOIN_GUILD = gql`
  mutation($residentName: String, $nickName: String, $avatar: String, $guildId: ID) {
    joinGuild(residentName: $residentName, nickName: $nickName, avatar: $avatar, guildId: $guildId) {
        _id
      guildFullName
      guildShortName
      guildLeader
      guildScores
      guildLevel
      guildMembers {
        avatar
        name
        nickName
        rank
        might
      }
      guildSilver
      contractedVendors
      guildPurchase
      guildPost
      guildLogo
      applicants
      perk
      }
    }`;

export const PLACE_ORDER = gql`
mutation(
  $resident: String 
  $vendor: String 
  $deliveryType: String 
  $deliveryAddress: String 
  $pickupAddress: String 
  $totalAmount: Float 
  $silverSpand: Int
  $tax: Float 
  $paymentMethod: String){
    placeOrder(
      resident: $resident
      vendor: $vendor
      deliveryType: $deliveryType
      deliveryAddress: $deliveryAddress
      pickupAddress: $pickupAddress
      totalAmount: $totalAmount
      silverSpand: $silverSpand
      tax: $tax
      paymentMethod: $paymentMethod){
        date
        orderNo
        vendor
        resident
        deliveryType
        deliveryAddress
        pickupAddress
        totalAmount
        paymentMethod
        tax
        orderItem {
          description
          quantity
          unitPrice
          taxRate
          photo
        }
      }
  }`;


export const SAVE_CUSTOMER_RATING = gql`
  mutation(
    $vendor: String
    $residentId: ID
    $rating: Float
    $comments: String
    $time: String) {
      saveCustomerRating(
        vendor: $vendor
        residentId: $residentId
        rating: $rating
        comments: $comments
        time: $time
      ) {
        customerName
        customerAvatar
        rating
        comments
        time
      }
    }`;

export const SAVE_GUILD_CHAT = gql`
mutation( $residentId: ID, $guildFullName: String, $input: GuildMessageInput) {
  saveGuildChat(residentId: $residentId, guildFullName: $guildFullName, input: $input) {
    guildFullName
    message {
      author
      data 
      type
      date
    }
    residentName
    residentAvatar
    rank
  }
}`;


export const SAVE_SHOPPING_CART = gql`
  mutation(
    $resident: String
    $vendor: ID
    $itemCode: String
    $description: String
    $quantity: Int
    $rewardSilver: Int
    $rate: Float
    $promoRate: Float
  ) {
    saveShoppingCart(
      resident: $resident
      vendor: $vendor
      itemCode: $itemCode
      description: $description
      quantity: $quantity
      rewardSilver: $rewardSilver
      rate: $rate
      promoRate: $promoRate
    ) {
        itemCode
        vendorName
        vendorLogo
        description
        quantity
        rewardSilver
        photo
        rate
        promoRate
        taxRate
    }
  }`;
  
export const SAVE_SINGLE_ITEM_RATING = gql`
  mutation(
    $itemCode: String
    $vendor: String
    $residentId: ID
    $rating: Float
    $comments: String
    $time: String) {
      saveSingleItemRating(
        itemCode: $itemCode
        vendor: $vendor
        residentId: $residentId
        rating: $rating
        comments: $comments
        time: $time) {
          itemCode
          averageRating
          customerRatings {
            customerName
            customerAvatar
            rating
            comments
            time
          }
        }
    }`;

export const SET_AUTH = gql`
  mutation($isAuthed: Boolean) {
    setAuth(isAuthed: $isAuthed) @client
  }
`;

export const SET_AUTH_ERROR = gql`
  mutation($errMsg: String) {
    setAuthError(errMsg: $errMsg) @client
  }
`;

// export const SET_ACTIVE_FLYER_LOCAL = gql`
//   mutation(
//     $businessTitle: String 
//     $logo: String 
//     $businessCategory: String 
//     $flyerId: String 
//     $flyerTitle: String 
//     $flyerType: String 
//     $dateFrom: String 
//     $dateTo: String 
//     $promoInfo: String) {
//     setActiveFlyerLocal(
//       businessTitle: $businessTitle 
//       logo: $logo 
//       businessCategory: $businessCategory 
//       flyerId: $flyerId
//       flyerTitle: $flyerTitle 
//       flyerType: $flyerType 
//       dateFrom: $dateFrom 
//       dateTo: $dateTo 
//       promoInfo: $promoInfo
//       ) @client
//   }`

export const SET_GUILD_ENROLLED = gql`
  mutation($isEnrolled: Boolean) {
    setGuildEnrolled(isEnrolled: $isEnrolled) @client
  }`;

export const SET_LANDING_PAGE_SHOWED = gql`
  mutation($showed: Boolean) {
    setLandingPageShowed(showed: $showed) @client
  }
`;

export const SET_INIT_LOCATION = gql`
  mutation($initLat: Float, $initLng: Float) {
    setInitLocation(initLat: $initLat, initLng: $initLng) @client
  }
`;

export const SET_SHOPPING_CART_COUNT =gql`
  mutation($count: Int) {
    setShoppingCartCount(count: $count) @client
  }`;

export const SIGNUP_RESIDENT = gql`
  mutation(
    $email: String!
    $password: String!
    $postalCode: String!
    $initialLat: Float
    $initialLng: Float
  ) {
    signupResident(
      email: $email
      password: $password
      postalCode: $postalCode
      initialLat: $initialLat
      initialLng: $initialLng
    ) {
      emailSent
    }
  }
`;

export const SIGNIN_RESIDENT = gql`
  mutation($email: String!, $password: String!, $fingerPrint: String) {
    signinResident(
      email: $email
      password: $password
      fingerPrint: $fingerPrint
    ) {
      token
      confirmed
    }
  }
`;

export const START_GUILD = gql`
  mutation($guildLeader: String, 
  $guildLeaderAvatar: String, 
  $guildLeaderNickName: String, 
  $guildFullName: String, 
  $guildShortName: String, 
  $guildLogo: String, 
  $guildPost: String) {
    startGuild(
    guildLeader: $guildLeader
    guildLeaderAvatar: $guildLeaderAvatar
    guildLeaderNickName: $guildLeaderNickName
    guildFullName: $guildFullName 
    guildShortName: $guildShortName 
    guildLogo: $guildLogo 
    guildPost: $guildPost) {
      idAdded
      guilds{
        _id
        guildFullName
        guildShortName
        guildLeader
        guildScores
        guildLevel
        guildMembers{
          avatar
          name
          nickName
          rank
          might
        }
        guildSilver
        contractedVendors
        guildPurchase
        guildPost
        guildLogo
        applicants
        perk
      }
    }
  }`;

export const STASH_FLYER = gql`
        mutation(
            $residentName: String! 
            $vendor: String! 
            $flyerId: String! 
            $flyerTitle: String!
            $flyerType: String!
            $dateFrom: String!
            $dateTo: String!
            $promoInfo: String
            $logo: String!) {
            stashFlyer(
              residentName: $residentName 
              vendor: $vendor 
              flyerId: $flyerId
              flyerTitle: $flyerTitle
              flyerType: $flyerType
              dateFrom: $dateFrom
              dateTo: $dateTo
              promoInfo: $promoInfo
              logo: $logo) {
                vendor
                flyerId
                flyerTitle
                flyerType
                dateFrom
                dateTo
                promoInfo
                logo
            }
  }`

export const UPDATE_AVATAR = gql`
  mutation($avatarUpdated: String!, $email: String!) {
    updateAvatar(avatarUpdated: $avatarUpdated, email: $email) {
      avatar
    }
  }
`;

export const UPDATE_PET_EXP_SILVER = gql`
  mutation(
    $residentName: String 
    $petExperience: Int 
    $silverCoins: Int 
    $vendor: String 
    $flyerId: String){
    updatePetExpSilver(
      residentName: $residentName 
      petExperience: $petExperience 
      silverCoins: $silverCoins
      vendor: $vendor
      flyerId: $flyerId) {
      petExperience
      silverCoins
      flyerId
    }
  }`;

export const UPDATE_PET_EXP_SILVER_STASH = gql`
  mutation(
    $residentName: String 
    $petExperience: Int 
    $silverCoins: Int 
    $vendor: String 
    $flyerId: String){
    updatePetExpSilverStash(
      residentName: $residentName 
      petExperience: $petExperience 
      silverCoins: $silverCoins
      vendor: $vendor
      flyerId: $flyerId) {
      petExperience
      silverCoins
      flyerId
      stashedFlyers {
        vendor
        flyerId
        flyerTitle
        flyerType
        dateFrom
        dateTo
        promoInfo
        logo
      }
    }
  }`;

export const UPDATE_PROFILE = gql`
  mutation(
    $residentId: ID
    $residentName: String
    $lastName: String
    $firstName: String
    $mailPostalCode: String
    $mailStrAddress: String
    $mailCity: String
    $gender: String
    $birthday: String
    $pet: String
    $postalCode: String
    $password: String
    $hobbies: [String]
    $favoriteFood: [String]
    $belief: String
  ) {
    updateProfile(
      residentId: $residentId
      residentName: $residentName
      lastName: $lastName
      firstName: $firstName
      mailPostalCode: $mailPostalCode
      mailStrAddress: $mailStrAddress
      mailCity: $mailCity
      gender: $gender
      birthday: $birthday
      pet: $pet
      postalCode: $postalCode
      password: $password
      hobbies: $hobbies
      favoriteFood: $favoriteFood
      belief: $belief
    ) {
     _id
      email
      residentName
      nickName
      firstName
      lastName
      password
      country
      mailStrAddress
      mailCity
      mailState
      mailCountry
      mailPostalCode
      postalCode
      avatarPic
      currentWish
      hobbies
      watchList
      receiveOnlineFlyer
      gender
      emailVerified
      goldCoins
      silverCoins
      guild {
        _id
        guildFullName
        guildShortName
        guildLeader
        guildScores
        guildLevel
        guildMembers {
          avatar
          name
          nickName
          rank
          might
        }
        guildSilver
        contractedVendors
        guildPurchase
        guildPost
        guildLogo
        applicants
        perk
      }
      guildOwned
      birthday
      favoriteFood
      belief
      initialLat
      initialLng
      petLevel
      petExperience
      flyersFedToPet
      propertyTax
      silverRecords {
        date
        orderNo
        vendor
        amountSpand
      }
      stashedFlyers {
        vendor
        flyerId
        flyerTitle
        flyerType
        dateFrom
        dateTo
        promoInfo
        logo
      }
      pet {
        _id
        petName
        petImage
        petImgUrl
        petPerformance
      }
    }
  }
`;

export const UPDATE_SHOPPING_CART = gql`
  mutation($resident: String, $itemCode:String, $quantity: Int){
    updateShoppingCart(resident: $resident, itemCode: $itemCode, quantity: $quantity) {
        itemCode
        quantity
    }
  }`;

export const UPDATE_STAHSED_FLYERS = gql`
 mutation($residentName: String, $flyerId: String) {
    updateStashedFlyers(residentName: $residentName, flyerId: $flyerId) {
        vendor
        flyerId
        flyerTitle
        flyerType
        dateFrom
        dateTo
        promoInfo
        logo
      }
    }`;
