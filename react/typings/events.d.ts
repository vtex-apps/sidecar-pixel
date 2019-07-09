export interface PixelMessage extends MessageEvent {
  data: OrderPlacedData | PageViewData
}

export interface EventData {
  event: string
  eventName: string
  currency: string
}

export interface PageViewData extends EventData {
  event: 'pageView'
  eventName: 'vtex:pageView'
  pageTitle: string
  pageUrl: string
  referrer: string
}

export interface OrderPlacedData extends Order, EventData {
  event: 'orderPlaced'
  eventName: 'vtex:orderPlaced'
}

export interface Order {
  currency: string
  accountName: string
  orderGroup: string
  salesChannel: string
  coupon: string
  visitorCountry: string
  visitorState: string
  visitorType: string
  visitorContactInfo: string[]
  visitorAddressState: string
  visitorAddressCountry: string
  visitorAddressPostalCode: string
  transactionId: string
  transactionDate: string
  transactionAffiliation: string
  transactionTotal: number
  transactionSubtotal: number
  transactionDiscounts: number
  transactionShipping: number
  transactionTax: number
  transactionCurrency: string
  transactionPaymentType: PaymentType[]
  transactionShippingMethod: ShippingMethod[]
  transactionProducts: ProductOrder[]
  transactionPayment: {
    id: string
  }
}

interface PaymentType {
  group: string
  paymentSystemName: string
  installments: number
  value: number
}

interface ShippingMethod {
  itemId: string
  selectedSla: string
}

interface ProductOrder {
  id: string
  name: string
  sku: string
  skuRefId: string
  skuName: string
  brand: string
  brandId: string
  seller: string
  sellerId: string
  category: string
  categoryId: string
  categoryTree: string[]
  categoryIdTree: string[]
  priceTags: PriceTag[]
  originalPrice: number
  price: number
  sellingPrice: number
  tax: number
  quantity: number
  components: any[]
  measurementUnit: string
  unitMultiplier: number
}

interface PriceTag {
  identifier: string
  isPercentual: boolean
  value: number
}
