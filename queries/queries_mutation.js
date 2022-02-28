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

export const SEND_MESSAGE = gql`
mutation(
  $sender: String
  $receiver: String
  $receiverType: String
  $time: String
  $text:String
) {
  sendMessage(
    sender: $sender
    receiver: $receiver
    receiverType: $receiverType
    time: $time
    text: $text
  ) {
    sender
    receiver
    receiverType
    time
    text
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
