// @desc sendConfirmationEmailWithInvoice (from Admin menu)
// @desc GET /api/orders/:id/resend-confirmation
// @access Private
const sendConfirmationEmailWithInvoice = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    // array of items
    const discounts = order.discounts
    const loop = order.orderItems
    const productsCount = loop.length
    let productsObject = {}
    loop.map((item, i) => {
      if (discounts[i].discount > 0) {
        productsObject[i] =
          ' ' +
          item.qty +
          ' x ' +
          item.name +
          ' ' +
          item.price +
          ' Kč' +
          ' zľava: ' +
          discounts[i].discount +
          ' %'
      } else {
        productsObject[i] = ' ' + item.qty + ' x ' + item.name + ' ' + item.price + ' Kč' + '  '
      }
    })

    // PRODUCTS OBJECT
    productsObject.user = order.name
    productsObject.email = order.email
    productsObject.name = order.name
    productsObject.orderNumber = order.orderNumber
    productsObject.taxPrice = order.taxPrice
    productsObject.totalPrice = order.totalPrice
    productsObject.shippingPrice = order.shippingPrice
    productsObject.isPaid = order.isPaid
    productsObject.productsCount = productsCount
    productsObject.orderId = order._id
    productsObject.paymentMethod = order.paymentMethod
    productsObject.addressinfo =
      order.shippingAddress.address +
      ', ' +
      order.shippingAddress.city +
      ', ' +
      order.shippingAddress.postalCode +
      ', ' +
      order.shippingAddress.country +
      ', ' +
      order.shippingAddress.phone

    productsObject.billinginfo =
      order.shippingAddress.billingName +
      ', ' +
      order.shippingAddress.billingAddress +
      ', ' +
      order.shippingAddress.billingCity +
      ', ' +
      order.shippingAddress.billingPostalCode +
      ', ' +
      order.shippingAddress.billingCountry +
      ', ' +
      'IČO: ' +
      order.shippingAddress.billingICO
    const productsOnly = order.totalPrice - order.shippingPrice
    productsObject.productsOnlyPrice = productsOnly
    productsObject.note = order.shippingAddress.note

    const date = order.createdAt
    let dateFromJson = new Date(date)
    let day = dateFromJson.getDate()
    let month = dateFromJson.getMonth() + 1
    let year = dateFromJson.getFullYear()
    let billingDate = `${day}/${month}/${year}`
    function addMonths(numOfMonths, date) {
      date.setMonth(date.getMonth() + numOfMonths)
      // return Real DMY
      let increasedDay = date.getDate()
      let increasedMonth = date.getMonth() + 1
      let increasedYear = date.getFullYear()
      let increasedDMY = `${increasedDay}/${increasedMonth}/${increasedYear}`
      return increasedDMY
    }
    // 👇️ Add months to current Date
    const dueDate = addMonths(1, dateFromJson)
    const invoiceDetails = {
      shipping: {
        name: order.name,
        address: order.shippingAddress.address,
        city: order.shippingAddress.city,
        country: order.shippingAddress.country,
        phone: order.shippingAddress.phone,
        postalCode: order.shippingAddress.postalCode,
      },
      billing: {
        name: order.shippingAddress.billingName,
        address: order.shippingAddress.billingAddress,
        city: order.shippingAddress.billingCity,
        country: order.shippingAddress.billingCountry,
        postalCode: order.shippingAddress.billingPostalCode,
        ICO: order.shippingAddress.billingICO,
      },
      items: order.orderItems,
      discounts: order.discounts,
      paymentMethod:
        order.paymentMethod === 'Platba bankovním převodem předem'
          ? 'Bankovním převodem'
          : order.paymentMethod,
      total: order.totalPrice.toString(),
      taxPrice: order.taxPrice,
      shippingPrice: order.shippingPrice.toString(),
      orderNumber: order.orderNumber,
      header: {
        company_name: 'Adam Surjomartono – Distribuce Proud',
        company_logo: __dirname + '/utils/wwwproudbanner.png',
        company_address: 'Hnězdenská 586/16, 18100 Praha 8, Česká republika',
      },
      ico: 'IČO: 68368844',
      note: order.shippingAddress.note,
      invoice_produced_by: 'Vyhotovil: AS',

      footer: {
        text: 'Faktura zároveň slouží jako dodací list',
      },
      currency_symbol: 'Kč',
      date: {
        billing_date: billingDate,
        due_date: dueDate,
      },
    }

    date.setHours(date.getHours() + 1) // Increase the hour by 1
    const formattedDate = date.toISOString().replace(/:/g, '-').substring(0, 19) // Format the date as YYYY-MM-DDTHH-MM-SS

    niceInvoice(invoiceDetails, `invoices/${order.orderNumber}_${formattedDate}.pdf`)
    const fileTosend = `invoices/${order.orderNumber}_${formattedDate}.pdf`

    try {
      if (
        order.shippingAddress.country !== 'Česká republika' &&
        order.paymentMethod === 'Platba bankovním převodem předem'
      ) {
        await new Email(productsObject, '', '').sendOrderNotCzToEmail()
        await new Email(productsObject, '', fileTosend).sendOrderNotCzAdminOnlyToEmail()
      } else if (
        order.shippingAddress.country === 'Česká republika' &&
        order.paymentMethod === 'Platba bankovním převodem předem'
      ) {
        await new Email(productsObject, '', fileTosend).sendOrderCzBankTransferToEmail()
      } else await new Email(productsObject, '', fileTosend).sendOrderToEmail()

      res.status(201).json('Success')
    } catch (err) {
      console.error('Error sending email:', err)
      // Optionally, notify the frontend about the email issue
      res.status(500).json({
        message:
          'Objednávka byla vytvořena, ale potvrzovací e-mail obdržíte později. Brzy vás budeme informovat',
      })
    }
  } else {
    res.status(404).json({
      message: 'Objednávka nenalezena.',
    })
  }
})
