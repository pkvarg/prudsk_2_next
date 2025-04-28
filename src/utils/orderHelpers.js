// utils/orderHelpers.js
import Order from '@/models/orderModel'

/**
 * Generates a unique order number
 * Format: Year-Month-Day-Sequential number (YYMMDDxxxx)
 * @returns {string} Unique order number
 */
export async function getOrderNumber() {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  const datePrefix = `${year}${month}${day}`

  // Find the latest order from today to get the sequence number
  const latestOrder = await Order.findOne({
    orderNumber: { $regex: `^${datePrefix}` },
  }).sort({ orderNumber: -1 })

  let sequenceNumber = 1

  if (latestOrder) {
    // Extract sequence number from the latest order number
    const latestSequence = parseInt(latestOrder.orderNumber.slice(-4))
    sequenceNumber = latestSequence + 1
  }

  // Format the sequence number to 4 digits (with leading zeros if needed)
  const formattedSequence = String(sequenceNumber).padStart(4, '0')

  return `${datePrefix}${formattedSequence}`
}
