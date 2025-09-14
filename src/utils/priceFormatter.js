// Utility function to format prices with comma as decimal separator (Slovak format)
export const formatPrice = (price) => {
  if (price === null || price === undefined) return '0,00 €'
  
  // Convert to number and format to 2 decimal places, then replace dot with comma
  return parseFloat(price).toFixed(2).replace('.', ',') + ' €'
}

export default formatPrice