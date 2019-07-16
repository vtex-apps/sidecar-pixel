import { canUseDOM } from 'vtex.render-runtime'
import { PixelMessage, OrderPlacedData } from './typings/events'

let added = false
function handleMessages(e: PixelMessage) {
  switch (e.data.eventName) {
    case 'vtex:pageView': {
      const { pageUrl } = e.data
      const isOrderPlaced = pageUrl.indexOf('checkout/orderPlaced') !== -1
      if (!isOrderPlaced && added === false) {
        addTrackingLib()
      }
      break
    }
    case 'vtex:orderPlaced': {
      const order = e.data
      addMetrics(order)
      addTrackingLib()
      break
    }
    default:
      break
  }
}

function addTrackingLib() {
  const a = document.createElement('script')
  a.async = true
  a.setAttribute('data-id', encodeURI(window.__sidecar_id))
  a.setAttribute('data-domain', encodeURI(window.__sidecar_domain))
  a.setAttribute('data-other', JSON.stringify({}))
  a.id = '_SCJS_'
  a.src = 'https://d3v27wwd40f0xu.cloudfront.net/js/tracking/sidecar.js'
  const r =
    document.getElementsByTagName('script')[0] ||
    document.getElementsByTagName('body')[0]
  r.parentNode!.insertBefore(a, r)
}

function addMetrics(order: OrderPlacedData) {
  window.sidecar = window.sidecar || {}

  type Promo = { name: string; amount: number }
  const promosMap = order.transactionProducts.reduce<Record<string, Promo>>(
    (promos, product) => {
      product.priceTags.forEach(priceTag => {
        // Not a discount, priceTag is increasing the price
        if (priceTag.value > 0) {
          return
        }

        if (!promos[priceTag.identifier]) {
          promos[priceTag.identifier] = {
            name: priceTag.identifier,
            amount: priceTag.value * -1,
          }
        }

        promos[priceTag.identifier].amount += priceTag.value * -1
      })

      return promos
    },
    {}
  )

  window.sidecar.transactions = {
    add: true,
    data: {
      order_id: order.transactionId,
      subtotal: order.transactionSubtotal,
      tax: order.transactionTax,
      shipping: order.transactionShipping,
      discounts: order.transactionDiscounts,
      total: order.transactionTotal,
      zipcode: order.visitorAddressPostalCode,
    },
    items: order.transactionProducts.map(product => ({
      product_id: product.sku,
      unit_price: product.price,
      quantity: product.quantity,
    })),
    discounts: Object.values(promosMap),
  }
}

if (canUseDOM) {
  window.addEventListener('message', handleMessages)
}
