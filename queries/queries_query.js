import gql from "graphql-tag";

export const CHECK_GUILD_NAME = gql`
  query($guildName: String!, $nameType: String) {
    checkGuildName(guildName: $guildName, nameType: $nameType) {
      guildNameIsOk
      }
  }`;

export const CHECK_RESIDENTNAME = gql`
  query($residentName: String!) {
    checkResidentName(residentName: $residentName) {
      residentNameVal
    }
  }
`;

export const EMAIL_CHECK = gql`
  query($email: String!) {
    checkEmail(email: $email) {
      emailVal
    }
  }
`;

export const GET_CURRENT_RESIDENT = gql`
  query {
    getCurrentResident {
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

export const GET_ACTIVE_FLYER = gql`
  query {
    getActiveFlyer{
      businessTitle
      logo
      businessCategory
      vendorActiveFlyer {
        flyerId
        flyerTitle
        flyerType
        dateFrom
        dateTo
        promoInfo
      }
    }
  }
`;

export const GET_ALL_GUILDS = gql`
   query{
    getAllGuilds {
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

export const GET_ALL_GUILD_DEALS = gql`
query {
  getAllGuildDeals {
     _id
      vendor
      vendorLogo
      guildDealType
      dealRedeemTerm
      specificItemList
      guildDealLevels {
          guildDealCondition
          guildDealAmount
          rewardItemsSelected
          rewardAmount
      }
      dateFrom
      dateTo
      active
  }
}`;

// export const GET_ACTIVE_FLYER_LOCAL = gql`
//   query {
//     activeFlyer @client{
//       businessTitle
//       logo
//       businessCategory
//       flyerId
//       flyerTitle
//       flyerType
//       dateFrom
//       dateTo
//       promoInfo
//     }
//   }
// `;

export const GET_AUTH = gql`
  query {
    auth @client {
      isAuthed
    }
  }
`;

export const GET_AUTH_ERROR = gql`
  query {
    authError @client {
      errMsg
    }
  }
`;

export const GET_GUILD_CHAT_MESSAGES = gql`
  query($guildFullName: String) {
    getGuildChatMessages(guildFullName: $guildFullName) {
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

export const GET_GUILD_DEALS_STATUS = gql`
  query($guildFullName: String) {
    getGuildDealsStatus(guildFullName: $guildFullName) {
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

export const GET_GUILD_ENROLLED =gql`
  query {
    guildEnrolled @client {
      isEnrolled
    }
  }`;

export const GET_LANDING_PAGE_SHOWED = gql`
  query {
    landingPageShowed @client {
      showed
    }
  }
`;

export const GET_INIT_LOCATION = gql`
  query {
    initLocation @client {
      initLat
      initLng
    }
  }
`;


export const GET_PETS = gql`
  query {
    getPets {
      _id
      petName
      petImage
      petImgUrl
      petPerformance
    }
  }
`;

export const GET_PICKUP_ADDRESS = gql`
  query($vendorList: [String]) {
    getPickupAddress(vendorList: $vendorList) {
      vendor
      address
    }
  }`;

export const GET_PROMOTION_EVENTS = gql`
  query {
    getPromotionEvents {
      vendor
      vendorUnitNo
      vendorStreetNo
      vendorStreetName
      vendorCity
      vendorState
      vendorCountry
      vendorCategory
      vendorLogo
      eventType
      eventPhoto
      eventTitle
      eventInstruction
      promotionItems 
      dateFrom
      dateTo
    }
  }`;

export const GET_RESIDENT_ORDERS = gql`
query($resident: String) {
  getResidentOrders(resident: $resident) {
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

export const GET_SELECTED_FLYER_CLIENT_VIEW = gql`
  query($flyerId: String!, $businessTitle: String!) {
    getSelectedFlyerClientView(
      flyerId: $flyerId
      businessTitle: $businessTitle
    ) {
        vendor
        flyerId
        couponId
        base64
        width
        height
        flyerType
        couponType
    }
  }
`;

export const GET_SHOPPING_CART = gql`
  query($resident: String) {
    getShoppingCart(resident: $resident) {
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

  export const GET_SHOPPING_CART_COUNT = gql`
    query {
      shoppingCartCount @client {
        count
      }
    }`;

export const GET_SINGLE_ITEM_RATING = gql`
query($vendor: String, $itemCode: String) {
  getSingleItemRating ( vendor: $vendor, itemCode: $itemCode) {
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

export const GET_VENDOR_INTERFACE = gql`
  query($vendor: String) {
    getVendorInterface (vendor: $vendor) {
      _id
      tagline
      businessTitle
      businessUnitNo
      businessStreetNo
      businessStreetName
      businessCity
      businessState
      businessCountry
      businessPostalCode
      businessPhone
      businessHours {
        weekDay
        time
      }
      businessFax
      businessEmail
      logo
      businessCategory
      aboutUs
      website
      photoList
      vendorPromotionEvents {
        eventType
        eventPhoto
        eventTitle
        eventInstruction
        promotionItems
        dateFrom
        dateTo
      }
      itemCatalog {
        subcategory
        itemCode
        description
        specification
        rewardSilver
        unit
        photo
        rate
        promoRate
        active
        taxRate
      }
      customerRatings {
        customerName
        customerAvatar
        rating
        comments
        time
      }
    }
  }`;


