export interface InventoryItem {
    id: number;
    name: string;
    category: string;
    description: string;
    price: number;
    rating: number;
    imageUrl: string;
    quantity?: number;
}

export interface LineItem {
    code: string,
    lineTotalEx: number,
    lineTotalTax: number
    lineTotalInc: number,
    priceInc: number,
    quantity: number,
    shortDescription: string,
    taxRate: number,
}

export interface Contact {
    firstName: string,
    lastName: string,
    emailAddress: string
}

export interface Address {
    streetAddress: string,
    city: string,
    state: string,
    postCode: string
}

export interface Location {
    addresses: Address[],
}

export interface Customer {
    bsid: string,
    name: string,
    locations: Location[],
    contacts: Contact[]
}

export interface SalesOrder {
    guid: string,
    bsid: string,
    customerBSID: string,
    refNumber: string,
    transDate: string,
    totalEx?: number,
    totalInc: number,
    totalTax: number,
    lines: LineItem[]
}

export interface Tenant {
    name: string
    abn: string
    phone1: string
    marketPlacePath: string
    locations: Location[]
    users: User[]
    id: number
    guid: string
    isActive: boolean
  }
  
  export interface Location {
    name: string
    isDefaultLocation: boolean
    utcOffset: number
    timeZoneName: string
    addresses: Address[]
    id: number
    guid: string
    isActive: boolean
  }
  
  export interface Address {
    addressType: string
    streetAddress: string
    city: string
    state: string
    country: string
    postCode: string
    isDefaultDeliverTo: boolean
    isDefaultBilling: boolean
    isDefaultServiceTo: boolean
    guid: string
    isActive: boolean
  }
  
  export interface User {
    firstName: string
    lastName: string
    emailAddress: string
    phoneMobile?: string
    isPrimaryContact: boolean
    id: number
    guid: string
    isActive: boolean
  }

  export interface PaymentAccount {
    accountGUID: string
    merchantGUID: string
    serviceType: string
    paymentMethod: string
    isVerified: boolean
    invoiceAmount: number
    creditAvailable: number
    creditApplied: number
    totalAmount: number
    fees: unknown[]
  }

  export interface Payment {
    customerBSID: string
    refNumber: string
    status: string
    paymentID: number
    paymentGUID: string
    paymentRefNumber: string
    paymentDate_utc: string
    paymentDate_offset: number
    paymentDate: string
    paymentMethod: string
    paymentStatus: string
    amount: number
    logs: Log[]
    id: number
    guid: string
    isActive: boolean
  }
  
  export interface Log {
    description: string
    status: string
    logDateTime_utc: string
    guid: string
    isActive: boolean
  }

  export interface m2mToken {
    access_token: string,
    scope: string,
    token_type: string,
    expires_in: number
  }