import gql from "graphql-tag";

export const GUILD_DEAL_TRANSACTION_ADDED = gql`
  subscription {
    guildDealTransactionAdded {
      transactionId
        resident
        vendor
        purchaseAmount
        date
    }
  }`;

export const GUILD_CHAT_MSG_ADDED = gql`
subscription {
  guildChatMsgAdded {
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

export const UPDATE_ACTIVE_FLYER = gql`
  subscription {
    updateActiveFlyers{
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

export const RESIDENT_ORDER_ADDED = gql`
  subscription{
    residentOrderAdded{
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

