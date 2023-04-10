import gql from "graphql-tag";

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

export const GET_CURRENT_VENDOR = gql`
  query {
    getCurrentVendor {
      _id
      tagline
      businessTitle
      email
      password
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
      goldCoins
      silverCoins
      aboutUs
      emailVerified
      existingCustomerList
      {
        customer
        location
        purchaseTimes
        totalPurchaseAmount
        dateLastTimePurchase
      }
      website
      deliveryFees
      maxDeliveryDistance
      rating
      photoList
      boundaryCharge
      crossBoundaryBusiness
      homePageVisit
      lat
      lng
      messages {
        sender
        receiver
        time
        text
        receiverType
        fullName 
        title 
        guild 
        isRead
      }
    }
  }
`;

// export const GET_CUSTOMER_RATINGS = gql`
//   query($vendor: String) {
//     getCustomerRatings( vendor: $vendor) {
//         customerName
//         customerAvatar
//         rating
//         comments
//         time
//         vendor
//     }
//   }`;

export const GET_CUSTOMER_RATINGS = gql`
  query($vendor: String) {
    getCustomerRatings( vendor: $vendor) {
        resident
        customerName
        customerAvatar
        rating
        comments
        time
        vendor
    }
  }`;

export const GET_ITEM_CATALOG = gql`
  query($subcategory: String, $businessTitle: String ) {
    getItemCatalog(
      subcategory: $subcategory
      businessTitle: $businessTitle
    ) {
        subcategory
        itemCode
        specification
        rewardSilver
        description
        unit
        photo
        rate
        promoRate
        active
        taxRate
        event
    }
  }
`;

export const GET_PICKUP_ADDRESS = gql`
  query($vendorName: String) {
    getPickupAddress(vendorName: $vendorName) {
      vendor
      address
    }
  }`;

// export const GET_PRODUCT_RATINGS = gql`
//   query($vendor: String) {
//     getProductRatings(vendor: $vendor) {
//       customerName
//       customerAvatar
//       rating
//       comments
//       # reply
//       time
//       itemCode
//       vendor
//     }
//   }`;

export const GET_PRODUCT_RATINGS = gql`
query($vendor: String) {
  getProductRatings(vendor: $vendor) {

    resident
    customerName
    customerAvatar
    rating
    comments
    # reply
    time
    itemCode
    vendor
  }
}`;

  export const GET_RESIDENT_LIST = gql`
    query{
      getResidentList {
        residentName
        firstName
        lastName
      }
    }`;

export const GET_SINGLE_COUPON = gql`
  query($vendor: String, $flyerId: String, $couponId: String){
    getSingleCoupon(vendor: $vendor, flyerId: $flyerId, couponId: $couponId) {
        valueType
        amount
        couponId
        couponTitle
        oneTimeUsage
        minimalAmount
        minimalQty
        isForAllItems
        itemsBound {
          itemCode
          description
          unit
          quantity
        }
    }
  }`;

export const GET_SINGLE_ITEM_RATING = gql`
  query($vendor: String, $itemCode: String) {
    getSingleItemRating ( vendor: $vendor, itemCode: $itemCode) {
      itemCode
      averageRating
      customerRatings {
        resident
        customerName
        customerAvatar
        rating
        comments
        time
        vendor
      }
    }
  }`;

// export const GET_VENDOR_GUILD_DEALS = gql`
//   query($vendor: String!) {
//     getVendorGuildDeals(vendor: $vendor) {
//         _id
//         vendor
//         vendorLogo
//         vendorCategory
//         guildDealType
//         dealRedeemTerm
//         specificItemList
//         guildDealLevels {
//             guildDealCondition
//             guildDealAmount
//             rewardItemsSelected
//             rewardAmount
//         }
//         dateFrom
//         dateTo
//         active
//         dealNo
//         dealFulfillmentRecords{
//           guild
//           purchaseAmount
//         }
//       }
//     }`;

export const GET_VENDOR_ORDERS = gql`
query($vendor: String) {
  getVendorOrders(vendor: $vendor) {
      date
      orderNo
      tax
      totalAmount
      totalDiscount
      shipping
      deliveryType
      customerName
      deliveryAddress
      pickupAddress
      resident
      vendor
      paymentMethod
      isUnderDispute
      isCanceled
      isConfirmed
      disputeInfo
      note
      isFulfilled
      fulfillNote
      orderItems {
        itemCode
        description
        quantity
        unitPrice
        taxRate       
      }
  }
}`;


export const GET_VENDOR_SALES_INFO = gql`
  query($vendor: String){
    getVendorSalesInfo(vendor: $vendor){
      dailySales{
        sales
        orders
      }
      monthToDateSales{
        sales
        orders
      }
      yearToDateSales{
        sales
        orders
      }
    }
  }`;

export const GET_VENDOR_PROMOTION_EVENTS = gql`
  query($vendor: String) {
    getVendorPromotionEvents (vendor: $vendor) {
      eventType
      eventPhoto
      eventTitle
      eventInstruction
      promotionItems
      dateFrom
      dateTo
      postOnPortal
    }
  }`;

export const GET_VENDOR_SETTLEMENT_RECORDS = gql`
  query($vendor: String) {
    getVendorSettlementRecords( vendor: $vendor) {
      date
      vendor
      salesOrderNo
      purchaseOrderNo
      totalAmount
      totalDiscount
      tax
      boundaryGold
      paymentMethod
      boundaryPayable
      amountPaidByCustomer
      amountPaidToBoundary
    }
  }`

export const SEARCH_AVAILABLE_DEALS = gql`
  query($input: DealSearchInput){
    searchAvailableDeals(input: $input) {
      flyerId
      couponId
      valueType
      amount
      itemCode
      couponTitle
      flyerTitle
      isForExceedance
      isForAllItems
      minimalAmount
      minimalQty
    }
  }`;


