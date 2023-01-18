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

export const ORDER_STATUS_CHANGED = gql`
subscription{
  orderStatusChanged{
    resident
    vendor
    orderNo
    content
    isConfirmed
    isCanceled
    isUnderDispute
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

// export const VENDOR_ORDER_STATUS_CHANGED = gql`
// subscription{
//   vendorOrderStatusChanged{
//     vendor
//     orderNo
//     status
//   }
// }`;



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

