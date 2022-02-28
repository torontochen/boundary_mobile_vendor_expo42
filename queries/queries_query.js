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
      website
      photoList
      boundaryCharge
      messages {
        sender
        receiver
        time
        text
        receiverType
      }
    }
  }
`;

export const GET_CUSTOMER_RATINGS = gql`
  query($vendor: String) {
    getCustomerRatings( vendor: $vendor) {
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
    }
  }
`;

export const GET_PRODUCT_RATINGS = gql`
  query($vendor: String) {
    getProductRatings(vendor: $vendor) {
      customerName
      customerAvatar
      rating
      comments
      reply
      time
      itemCode
      vendor
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
      vendor
    }
  }
}`;

export const GET_VENDOR_ORDERS = gql`
query($vendor: String) {
  getVendorOrders(vendor: $vendor) {
      date
      orderNo
      tax
      totalAmount
      deliveryType
      deliveryAddress
      pickupAddress
      resident
      vendor
      paymentMethod
      orderItems {
        itemCode
        description
        quantity
        unitPrice
        taxRate
        isFulfilled
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
      tax
      boundaryGold
      paymentMethod
      boundaryPayable
      amountPaidByCustomer
      amountPaidToBoundary
    }
  }`


