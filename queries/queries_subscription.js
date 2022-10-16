import gql from "graphql-tag";

export const CUSTOMER_RATING_ADDED = gql`
  subscription{
    customerRatingAdded {
      customerName
      customerAvatar
      rating
      comments
      time
      # reply
      vendor
    }
  }`;

export const MESSAGE_RECEIVED = gql`
  subscription{
    messageReceived {
      sender
      receiver
      receiverType
      time
      text
      fullName 
      title 
      guild 
      isRead
    }
  }`;

export const PRODUCT_RATING_ADDED = gql`
  subscription{
    productRatingAdded{
      customerName
      customerAvatar
      comments
      # reply
      time
      rating
      itemCode
      vendor
    }
  }`;

export const VENDOR_ORDER_ADDED = gql`
  subscription{
    vendorOrderAdded{
      date
      orderNo
      tax
      totalAmount
      totalDiscount
      deliveryType
      customerName
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

export const VENDOR_ORDER_STATUS_CHANGED = gql`
subscription{
  vendorOrderStatusChanged{
    vendor
    orderNo
    status
  }
}`;



export const VENDOR_SETTLEMENT_RECORD_ADDED = gql`
  subscription{
    vendorSettlementRecordAdded{
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
  }`;

