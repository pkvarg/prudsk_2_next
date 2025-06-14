// utils/orderHelpers.js
import prisma from '@/db/db'

export const getOrderNumber = async () => {
  const currentYear = new Date().getFullYear()
  const yearStart = new Date(currentYear, 0, 1)
  const yearEnd = new Date(currentYear + 1, 0, 1)

  try {
    // Find the first unused cancelled order number for this year
    const cancelledOrder = await prisma.order.findFirst({
      where: {
        createdAt: {
          gte: yearStart,
          lt: yearEnd,
        },
        isCancelled: true,
        isCancelledOrderNumberUsed: false,
      },
      orderBy: {
        orderNumber: 'asc',
      },
    })

    if (cancelledOrder) {
      // Mark the cancelled order number as used
      await prisma.order.update({
        where: { id: cancelledOrder.id },
        data: { isCancelledOrderNumberUsed: true },
      })

      // Return the order number without 'W' suffix for reuse
      const orderNumber = cancelledOrder.orderNumber.toString()
      return orderNumber.endsWith('W') ? orderNumber.slice(0, -1) : orderNumber
    }

    // Find the highest order number for this year
    const highestOrder = await prisma.order.findFirst({
      where: {
        createdAt: {
          gte: yearStart,
          lt: yearEnd,
        },
      },
      orderBy: {
        orderNumber: 'desc',
      },
    })

    let newOrderNumber
    if (highestOrder) {
      // Extract the numeric part (remove year prefix and 'W' suffix if present)
      const orderNumberStr = highestOrder.orderNumber.toString()
      const cleanNumber = orderNumberStr.endsWith('W')
        ? orderNumberStr.slice(0, -1)
        : orderNumberStr

      const highestNumber = parseInt(cleanNumber.slice(4)) // Remove year prefix (first 4 digits)
      newOrderNumber = currentYear * 10000 + highestNumber + 1
    } else {
      // First order of the year
      newOrderNumber = currentYear * 10000 + 1
    }

    return formatOrderNumber(newOrderNumber)
  } catch (error) {
    console.error('Error generating order number:', error)
    throw new Error('Failed to generate order number')
  }
}

function formatOrderNumber(number) {
  return `${number}W`
}
