import gql from "graphql-tag";

// Mutations
export const CHANGE_ORDER_STATUS = gql`
  mutation($vendor: String, $orderNo: String, $status: Boolean) {
    changeOrderStatus(vendor: $vendor, orderNo: $orderNo, status: $status) {
      vendor
      orderNo
      status
    }
  }`;

export const CONFIRM = gql`
mutation(
  $vendor: String, 
  $resident: String, 
  $orderNo: String, 
  $content: String, 
  $isUnderDispute: Boolean, 
  $isConfirmed: Boolean, 
  $isCanceled: Boolean){
  confirm(vendor: $vendor, 
    resident: $resident, 
    orderNo: $orderNo, 
    content: $content, 
    isUnderDispute: $isUnderDispute, 
    isConfirmed: $isConfirmed, 
    isCanceled: $isCanceled){
      vendor
      resident
      orderNo
      content
      isUnderDispute
      isConfirmed
      isCanceled
    }
}`;

export const FULFILL = gql`
    mutation($vendor: String, $orderNo: String, $fulfillNote: String){
      fulfill(vendor: $vendor, orderNo: $orderNo, fulfillNote: $fulfillNote) {
        note
      }
    }`;

export const PLACE_ORDER = gql`
  mutation(
    $resident: String 
    $vendor: String 
    $deliveryType: String 
    $customerName: String
    $deliveryAddress: String 
    $pickupAddress: String 
    $totalAmount: Float 
    $totalDiscount: Float
    $shipping: Float
    $silverSpand: Int
    $tax: Float 
    $valueDiscountList: [ValueDiscountListInput]
    $salesOrderItems: [SalesOrderItemInput]
    $paymentMethod: String
    $impendingOrderNo: String
    $note: String
    $dealsTitle: [DealTitleInput]){
      placeOrder(
        resident: $resident
        vendor: $vendor
        deliveryType: $deliveryType
        customerName: $customerName
        deliveryAddress: $deliveryAddress
        pickupAddress: $pickupAddress
        totalAmount: $totalAmount
        totalDiscount: $totalDiscount
        shipping: $shipping
        silverSpand: $silverSpand
        tax: $tax
        valueDiscountList: $valueDiscountList
        salesOrderItems: $salesOrderItems
        paymentMethod: $paymentMethod
        impendingOrderNo: $impendingOrderNo
        note: $note
        dealsTitle: $dealsTitle){
          date
          orderNo
          vendor
          resident
          deliveryType
          customerName
          deliveryAddress
          pickupAddress
          totalAmount
          totalDiscount
          shipping
          impending
          finalizeInfo
          isGameSubstitueBuy
          isUnderDispute
          isCanceled
          isConfirmed
          disputeInfo
          paymentMethod
          note
          tax
          orderItems {
            itemCode
            description
            quantity
            unitPrice
            taxRate
            photo
          }
        }
    }`;

export const SEND_MESSAGE = gql`
  mutation(
    $sender: String
    $receiver: String
    $receiverType: String
    $time: String
    $text:String
    $fullName: String
    $title: String
    $guild: String
  ) {
    sendMessage(
      sender: $sender
      receiver: $receiver
      receiverType: $receiverType
      time: $time
      text: $text
      fullName: $fullName
      guild: $guild
      title: $title
    ) {
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

export const SIGNIN_VENDOR = gql`
  mutation($email: String!, $password: String!, $fingerPrint: String) {
    signinVendor(
      email: $email
      password: $password
      fingerPrint: $fingerPrint
    ) {
      token
      confirmed
    }
  }
`;
