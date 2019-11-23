import gql from "graphql-tag";

//-----------CategoriesCRUD-----------
export const CategoriesCRUD = gql`
  mutation($transaction: TransactionTypes!, $Categories: [CategoriesIp!]!) {
    result: CategoriesCRUD(transaction: $transaction, Categories: $Categories)
  }
`;

//-----------searchCategories-----------
export const searchCategories = gql`
  query($CATEGORY_ID: String, $CATEGORY_NAME: String, $CATEGORY_DESC: String) {
    result: searchCategories(
      CATEGORY_ID: $CATEGORY_ID
      CATEGORY_NAME: $CATEGORY_NAME
      CATEGORY_DESC: $CATEGORY_DESC
    ) {
      CATEGORY_ID
      CATEGORY_NAME
      CATEGORY_DESC
      DISPLAY_ORDER
      CATEGORY_IMAGE
    }
  }
`;
//-----------populateSubCategoryFormDDL-----------
export const populateSubCategoryFormDDL = gql`
  query {
    UOM: populateDDL(ddlName: UOM, paraArray: []) {
      CODE
      DESC
    }
    CATEGORIES: populateDDL(ddlName: CATEGORIES, paraArray: []) {
      CODE
      DESC
    }
  }
`;

//-----------populateCATEGORIESDDL-----------
export const populateCATEGORIESDDL = gql`
  query {
    result: populateDDL(ddlName: CATEGORIES, paraArray: []) {
      CODE
      DESC
    }
  }
`;
//-----------SubCategoriesCRUD-----------
export const SubCategoriesCRUD = gql`
  mutation(
    $transaction: TransactionTypes!
    $SubCategories: [SubCategoriesIp!]!
  ) {
    result: SubCategoriesCRUD(
      transaction: $transaction
      SubCategories: $SubCategories
    )
  }
`;

//-----------searchSubCategories-----------
export const searchSubCategories = gql`
  query(
    $CATEGORY_ID: String
    $SUBCATEGORY_ID: String
    $SUBCATEGORY_NAME: String
  ) {
    result: searchSubCategories(
      CATEGORY_ID: $CATEGORY_ID
      SUBCATEGORY_ID: $SUBCATEGORY_ID
      SUBCATEGORY_NAME: $SUBCATEGORY_NAME
    ) {
      CATEGORY_ID
      CATEGORY_NAME
      SUBCATEGORY_ID
      SUBCATEGORY_NAME
      SUBCATEGORY_DESC
      SUBCATEGORY_RATE
      SUBCATEGORY_QUANTITY
      SUBCATEGORY_UOM
      SUBCATEGORY_IMAGE
      DISPLAY_ORDER
      SUBCATEGORY_PRICES {
        PRICE_ID
        SUBCATEGORY_ID
        ITEM_QUANTITY
        ITEM_RATE
        ITEM_UOM
        DISPLAY_ORDER
      }
    }
  }
`;

//-----------UpdateSubCategoryPrices-----------
export const updateSubCategoryPrices = gql`
  mutation($SubCategoryPrices: [SubCategoryPricesIp!]!) {
    result: UpdateSubCategoryPrices(SubCategoryPrices: $SubCategoryPrices)
  }
`;

//-----------searchSubCategories-----------
export const searchSubCategoryPrices = gql`
  query(
    $CATEGORY_ID: String
    $SUBCATEGORY_ID: String
    $SUBCATEGORY_NAME: String
  ) {
    result: searchSubCategories(
      CATEGORY_ID: $CATEGORY_ID
      SUBCATEGORY_ID: $SUBCATEGORY_ID
      SUBCATEGORY_NAME: $SUBCATEGORY_NAME
    ) {
      CATEGORY_ID
      CATEGORY_NAME
      SUBCATEGORY_ID
      SUBCATEGORY_NAME
      SUBCATEGORY_DESC
      SUBCATEGORY_RATE
      SUBCATEGORY_QUANTITY
      SUBCATEGORY_UOM
      SUBCATEGORY_IMAGE
      DISPLAY_ORDER
      SUBCATEGORY_PRICES {
        PRICE_ID
        SUBCATEGORY_ID
        ITEM_QUANTITY
        ITEM_RATE
        ITEM_UOM
        DISPLAY_ORDER
      }
    }
  }
`;
//-----------searchOrders-----------
export const searchOrders = gql`
  query(
    $ORDER_ID: String
    $USER_ID: String
    $USER_NAME: String
    $MOBILE_NUMBER: String
    $ORDER_STATUS: String
    $ORDER_FROM_DATE: String
    $ORDER_TO_DATE: String
  ) {
    result: searchOrders(
      ORDER_ID: $ORDER_ID
      USER_ID: $USER_ID
      USER_NAME: $USER_NAME
      MOBILE_NUMBER: $MOBILE_NUMBER
      ORDER_STATUS: $ORDER_STATUS
      ORDER_FROM_DATE: $ORDER_FROM_DATE
      ORDER_TO_DATE: $ORDER_TO_DATE
    ) {
      ORDER_ID
      USER_ID
      USER_NAME
      MOBILE_NUMBER
      DELIVERY_DATE
      DELIVERY_DATE_FRMT
      DELIVERY_TIME
      DELIVERY_TIME_FRMT
      TOTAL_AMOUNT
      DISCOUNT
      NET_AMOUNT
      PAID_AMOUNT
      BALANCE_AMOUNT
      MODE_OF_PAYMENT
      ORDER_STATUS
      ORDER_STATUS_DESC
      STATUS_DATE
      STATUS_TIME

      ORDER_DETAILS {
        ORDER_ID
        ORDER_SUBID
        DELIVERY_ADDRESS
        CATEGORY_ID
        CATEGORY_NAME
        SUBCATEGORY_ID
        SUBCATEGORY_NAME
        SUBCATEGORY_DESC
        SUBCATEGORY_RATE
        SUBCATEGORY_QUANTITY
        SUBCATEGORY_UOM
        SUBCATEGORY_IMAGE
        ITEM_QUANTITY
        ITEM_UOM
        ITEM_RATE
        ITEM_UNITS
        ITEM_PRICE
        CUSTOM_MESSAGE
      }
    }
  }
`;
//....................populateUSERSDDL.........................
export const UpdateOrderStatus = gql`
  mutation($ORDER_ID: String!, $ORDER_STATUS: String!) {
    result: UpdateOrderStatus(
      OrderStatus: [{ ORDER_ID: $ORDER_ID, ORDER_STATUS: $ORDER_STATUS }]
    )
  }
`;
//....................populateUSERSDDL.........................
export const populateUSERSDDL = gql`
  query {
    result: populateDDL(ddlName: USERS, paraArray: []) {
      CODE
      DESC
    }
  }
`;

//....................populateUSERSDDL.........................
export const populateSUBCATEGORIESSDDL = gql`
  query($category: [String]!) {
    result: populateDDL(ddlName: SUB_CATEGORIES, paraArray: $category) {
      CODE
      DESC
    }
  }
`;
//....................populateUSERSDDL.........................
export const populateORDERS_DDL = gql`
  query {
    ORDER_STATUS_TYPES: populateDDL(
      ddlName: ORDER_STATUS_TYPES
      paraArray: ["SUPPLIER"]
    ) {
      CODE
      DESC
    }

    USERS: populateDDL(ddlName: USERS, paraArray: ["SUPPLIER"]) {
      CODE
      DESC
    }
  }
`;
//....................searchAddresses.........................
export const searchAddresses = gql`
  query(
    $USER_ID: String
    $ADDRESS_ID: String
    $PINCODE: String
    $CITY: String
    $STATE: String
  ) {
    result: searchAddresses(
      USER_ID: $USER_ID
      ADDRESS_ID: $ADDRESS_ID
      PINCODE: $PINCODE
      CITY: $CITY
      STATE: $STATE
    ) {
      USER_ID
      ADDRESS_ID
      CUSTOMER_NAME
      MOBILE_NUMBER
      EMAIL
      PINCODE
      HOUSE_BUILDING
      COLONY_STREET
      LANDMARK
      CITY
      LOCALITY
      STATE
    }
  }
`;
//....................searchUserProfiles.........................
export const searchUserProfiles = gql`
  query(
    $USER_ID: String
    $FIRST_NAME: String
    $LAST_NAME: String
    $EMAIL: String
    $MOBILE_NUMBER: String
  ) {
    result: searchUserProfiles(
      USER_ID: $USER_ID
      FIRST_NAME: $FIRST_NAME
      LAST_NAME: $LAST_NAME
      EMAIL: $EMAIL
      MOBILE_NUMBER: $MOBILE_NUMBER
    ) {
      USER_ID
      FIRST_NAME
      LAST_NAME
      MOBILE_NUMBER
      EMAIL
      USER_TYPE
    }
  }
`;

//....................searchBanners.........................
export const searchBanners = gql`
  query($BANNER_ID: String, $BANNER_CATEGORY: String) {
    result: searchBanners(
      BANNER_ID: $BANNER_ID
      BANNER_CATEGORY: $BANNER_CATEGORY
    ) {
      BANNER_ID
      BANNER_CATEGORY
      BANNER_IMAGE
      BANNER_TARGET
      DISPLAY_ORDER
    }
  }
`;

//....................BannersCRUD.........................
export const BannersCRUD = gql`
  mutation($transaction: TransactionTypes!, $Banners: [BannersIp!]!) {
    result: BannersCRUD(transaction: $transaction, Banners: $Banners)
  }
`;
//....................Login.........................
export const logInQueries = gql`
  mutation($MOBILE_NUMBER: String!, $PASSWORD: String!) {
    result: localLogin(MOBILE_NUMBER: $MOBILE_NUMBER, PASSWORD: $PASSWORD) {
      USER_ID
      FIRST_NAME
      LAST_NAME
      MOBILE_NUMBER
      EMAIL
      USER_TYPE
      AUTH_TOKEN
    }
  }
`;

export const logedInQueries = gql`
  query {
    loggedInUser {
      email
      firstname
      lastname
    }
  }
`;

export const logoutQueries = gql`
  mutation localLogout {
    localLogout
  }
`;

export const UserProfileCRUD = gql`
  mutation updateUserProfile(
    $USER_ID: String
    $FIRST_NAME: String
    $LAST_NAME: String
    $EMAIL: String
    $MOBILE_NUMBER: String
  ) {
    updateUserProfile(
      user: {
        USER_ID: $USER_ID
        FIRST_NAME: $FIRST_NAME
        LAST_NAME: $LAST_NAME
        EMAIL: $EMAIL
        MOBILE_NUMBER: $MOBILE_NUMBER
      }
    )
  }
`;

export const AddressesCRUD = gql`
  mutation($addresses: [AddressesIp!]!, $transaction: TransactionTypes!) {
    AddressesCRUD(addresses: $addresses, transaction: $transaction)
  }
`;

//---------------Get Total Order Material------------------

export const getTotalOrderMaterial = gql`
  query getTotalOrderMaterial(
    $ORDER_FROM_DATE: String
    $ORDER_TO_DATE: String
  ) {
    result: getTotalOrderMaterial(
      ORDER_FROM_DATE: $ORDER_FROM_DATE
      ORDER_TO_DATE: $ORDER_TO_DATE
    ) {
      ORDER_DATE
      ORDER_DATE_FRMT
      CATEGORY_NAME
      SUBCATEGORY_NAME
      ORDER_PRICE
      ORDER_QUANTITY
      ORDER_UOM
    }
  }
`;
