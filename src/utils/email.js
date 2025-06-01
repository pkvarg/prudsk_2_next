// // utils/email.js
// import nodemailer from 'nodemailer'

// class Email {
//   constructor(data, url, file) {
//     this.to = data.email
//     this.name = data.name
//     this.url = url
//     this.from = `Proud Distribution <${process.env.EMAIL_FROM}>`
//     this.data = data
//     this.file = file
//   }

//   newTransport() {
//     if (process.env.NODE_ENV === 'production') {
//       // Use SendGrid or other production email service
//       return nodemailer.createTransport({
//         service: process.env.EMAIL_SERVICE,
//         auth: {
//           user: process.env.EMAIL_USERNAME,
//           pass: process.env.EMAIL_PASSWORD,
//         },
//       })
//     }

//     // For development environment
//     return nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     })
//   }

//   // Send the actual email
//   async send(template, subject, htmlContent) {
//     // Define email options
//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject,
//       html: htmlContent,
//     }

//     // Add attachment if file exists
//     if (this.file && this.file !== '') {
//       mailOptions.attachments = [
//         {
//           filename: `invoice-${this.data.orderNumber}.pdf`,
//           path: this.file,
//         },
//       ]
//     }

//     // Create a transport and send email
//     await this.newTransport().sendMail(mailOptions)
//   }

//   async sendPaymentSuccessfullToEmail() {
//     const subject = `Potvrzení platby pro objednávku č. ${this.data.orderNumber}`

//     // Build HTML content for payment success notification
//     const htmlContent = `
//       <h2>Vaše platba byla úspěšně přijata!</h2>
//       <p>Vážený/á ${this.name},</p>
//       <p>Děkujeme za Vaši platbu za objednávku č. ${this.data.orderNumber}.</p>
//       <h3>Detaily objednávky:</h3>
//       <ul>
//         ${Object.keys(this.data)
//           .filter((key) => !isNaN(key))
//           .map((key) => `<li>${this.data[key]}</li>`)
//           .join('')}
//       </ul>
//       <p>Celková cena: ${this.data.totalPrice} Kč</p>
//       <p>Způsob platby: ${this.data.paymentMethod}</p>
//       <p>Dodací adresa: ${this.data.addressinfo}</p>
//       ${this.data.note ? `<p>Poznámka: ${this.data.note}</p>` : ''}

//       <p>Vaši objednávku začneme zpracovávat okamžitě a bude odeslána v nejbližším možném termínu.</p>
//       <p>Děkujeme za Váš nákup!</p>
//       <p>S pozdravem,<br>Tým Proud Distribution</p>
//     `

//     await this.send('paymentSuccessful', subject, htmlContent)
//   }

//   async sendOrderToEmail() {
//     const subject = `Vaše objednávka č. ${this.data.orderNumber} byla přijata`

//     // Build HTML content based on order data
//     const htmlContent = `
//       <h2>Děkujeme za Vaši objednávku!</h2>
//       <p>Vážený/á ${this.name},</p>
//       <p>Vaše objednávka č. ${this.data.orderNumber} byla úspěšně přijata.</p>
//       <h3>Detaily objednávky:</h3>
//       <ul>
//         ${Object.keys(this.data)
//           .filter((key) => !isNaN(key))
//           .map((key) => `<li>${this.data[key]}</li>`)
//           .join('')}
//       </ul>
//       <p>Celková cena: ${this.data.totalPrice} Kč</p>
//       <p>Způsob platby: ${this.data.paymentMethod}</p>
//       <p>Dodací adresa: ${this.data.addressinfo}</p>
//       <p>Fakturační údaje: ${this.data.billinginfo}</p>
//       ${this.data.note ? `<p>Poznámka: ${this.data.note}</p>` : ''}
//       <p>V příloze najdete fakturu k Vaší objednávce.</p>
//       <p>Děkujeme za Váš nákup!</p>
//       <p>S pozdravem,<br>Tým Proud Distribution</p>
//     `

//     await this.send('orderConfirmation', subject, htmlContent)
//   }

//   async sendOrderCzBankTransferToEmail() {
//     const subject = `Vaše objednávka č. ${this.data.orderNumber} byla přijata - platba převodem`

//     // Build HTML content for Czech bank transfer orders
//     const htmlContent = `
//       <h2>Děkujeme za Vaši objednávku!</h2>
//       <p>Vážený/á ${this.name},</p>
//       <p>Vaše objednávka č. ${this.data.orderNumber} byla úspěšně přijata.</p>
//       <h3>Detaily objednávky:</h3>
//       <ul>
//         ${Object.keys(this.data)
//           .filter((key) => !isNaN(key))
//           .map((key) => `<li>${this.data[key]}</li>`)
//           .join('')}
//       </ul>
//       <p>Celková cena: ${this.data.totalPrice} Kč</p>
//       <p>Způsob platby: Bankovním převodem</p>
//       <p>Dodací adresa: ${this.data.addressinfo}</p>
//       <p>Fakturační údaje: ${this.data.billinginfo}</p>
//       ${this.data.note ? `<p>Poznámka: ${this.data.note}</p>` : ''}

//       <h3>Platební údaje:</h3>
//       <p>Číslo účtu: ${process.env.BANK_ACCOUNT_NUMBER}</p>
//       <p>Variabilní symbol: ${this.data.orderNumber}</p>
//       <p>Částka k úhradě: ${this.data.totalPrice} Kč</p>

//       <p>V příloze najdete fakturu k Vaší objednávce.</p>
//       <p>Zboží bude odesláno po připsání platby na náš účet.</p>
//       <p>Děkujeme za Váš nákup!</p>
//       <p>S pozdravem,<br>Tým Proud Distribution</p>
//     `

//     await this.send('orderConfirmationBankTransfer', subject, htmlContent)
//   }

//   async sendOrderNotCzToEmail() {
//     const subject = `Your order #${this.data.orderNumber} has been received - bank transfer`

//     // Build HTML content for international orders
//     const htmlContent = `
//       <h2>Thank you for your order!</h2>
//       <p>Dear ${this.name},</p>
//       <p>Your order #${this.data.orderNumber} has been successfully received.</p>
//       <h3>Order details:</h3>
//       <ul>
//         ${Object.keys(this.data)
//           .filter((key) => !isNaN(key))
//           .map((key) => `<li>${this.data[key]}</li>`)
//           .join('')}
//       </ul>
//       <p>Total price: ${this.data.totalPrice} CZK</p>
//       <p>Payment method: Bank transfer</p>
//       <p>Shipping address: ${this.data.addressinfo}</p>
//       <p>Billing details: ${this.data.billinginfo}</p>
//       ${this.data.note ? `<p>Note: ${this.data.note}</p>` : ''}

//       <h3>Payment details:</h3>
//       <p>IBAN: ${process.env.BANK_IBAN}</p>
//       <p>SWIFT/BIC: ${process.env.BANK_SWIFT}</p>
//       <p>Variable symbol: ${this.data.orderNumber}</p>
//       <p>Amount to pay: ${this.data.totalPrice} CZK</p>

//       <p>We will send you the invoice after confirmation of your order by our team.</p>
//       <p>Products will be shipped after your payment is credited to our account.</p>
//       <p>Thank you for your purchase!</p>
//       <p>Best regards,<br>Proud Distribution Team</p>
//     `

//     await this.send('orderConfirmationInternational', subject, htmlContent)
//   }

//   async sendOrderNotCzAdminOnlyToEmail() {
//     const subject = `New international order #${this.data.orderNumber} - admin notification`

//     // Build HTML content for admin notifications about international orders
//     const htmlContent = `
//       <h2>New International Order Received</h2>
//       <p>Order #${this.data.orderNumber} has been received from ${this.name}.</p>
//       <h3>Order details:</h3>
//       <ul>
//         ${Object.keys(this.data)
//           .filter((key) => !isNaN(key))
//           .map((key) => `<li>${this.data[key]}</li>`)
//           .join('')}
//       </ul>
//       <p>Total price: ${this.data.totalPrice} CZK</p>
//       <p>Payment method: ${this.data.paymentMethod}</p>
//       <p>Shipping address: ${this.data.addressinfo}</p>
//       <p>Billing details: ${this.data.billinginfo}</p>
//       ${this.data.note ? `<p>Note: ${this.data.note}</p>` : ''}

//       <p>Please review this international order and prepare for processing.</p>
//     `

//     // Override recipient to admin email
//     const originalTo = this.to
//     this.to = process.env.ADMIN_EMAIL

//     await this.send('adminOrderNotification', subject, htmlContent)

//     // Restore original recipient
//     this.to = originalTo
//   }

//   async sendLowStoragePiecesWarningEmail() {
//     const subject = `Low Stock Alert: ${this.data.name}`

//     // Build HTML content for low stock warning
//     const htmlContent = `
//       <h2>Low Stock Warning</h2>
//       <p>Product: ${this.data.name}</p>
//       <p>Current stock level: ${this.data.countInStock}</p>
//       <p>This product has fallen below the threshold of 10 items in stock.</p>
//       <p>Please consider restocking this item soon.</p>
//     `

//     // Send to admin email
//     const originalTo = this.to
//     this.to = process.env.ADMIN_EMAIL

//     await this.send('lowStockWarning', subject, htmlContent)

//     // Restore original recipient
//     this.to = originalTo
//   }

//   async sendDeliveredNotificationEmail() {
//     const subject = `Vaše objednávka č. ${this.data.orderNumber} byla odeslána`

//     // Build HTML content for delivery notification
//     const htmlContent = `
//       <h2>Vaše objednávka byla odeslána!</h2>
//       <p>Vážený/á ${this.name},</p>
//       <p>Vaše objednávka č. ${this.data.orderNumber} byla odeslána.</p>
//       <h3>Detaily objednávky:</h3>
//       <ul>
//         ${
//           this.data.orderItems
//             ? this.data.orderItems
//                 .map((item) => `<li>${item.qty} x ${item.name} (${item.price} Kč)</li>`)
//                 .join('')
//             : ''
//         }
//       </ul>
//       <p>Celková cena: ${this.data.totalPrice} Kč</p>
//       <p>Dodací adresa: ${this.data.addressinfo}</p>

//       <p>Sledovací číslo zásilky a další informace můžete obdržet přímo od přepravce.</p>
//       <p>Děkujeme za Váš nákup!</p>
//       <p>S pozdravem,<br>Tým Proud Distribution</p>
//     `

//     await this.send('orderDelivered', subject, htmlContent)
//   }

//   async sendFailedPaymentNotificationgEmail() {
//     const subject = `Problém s platbou pro objednávku č. ${this.data.orderNumber}`

//     // Build HTML content for failed payment notification
//     const htmlContent = `
//       <h2>Informace o neúspěšné platbě</h2>
//       <p>Vážený/á ${this.name},</p>
//       <p>Váš pokus o platbu za objednávku č. ${this.data.orderNumber} nebyl úspěšný.</p>

//       <p>Celková cena objednávky: ${this.data.totalPrice} Kč</p>

//       <h3>Možnosti dalšího postupu:</h3>
//       <ol>
//         <li>Zkontrolujte si nastavení své platební karty pro online platby</li>
//         <li>Zkuste znovu provést platbu z Vašeho účtu v sekci objednávek</li>
//         <li>Zvolte alternativní způsob platby</li>
//         <li>Kontaktujte svou banku pro více informací o zamítnutí platby</li>
//       </ol>

//       <p>Vaše objednávka zůstává platná a čeká na dokončení platby.</p>
//       <p>V případě jakýchkoli dotazů nás kontaktujte na ${
//         process.env.SUPPORT_EMAIL || 'info@prouddistribution.cz'
//       }.</p>

//       <p>Děkujeme za pochopení,</p>
//       <p>Tým Proud Distribution</p>
//     `

//     await this.send('paymentFailed', subject, htmlContent)
//   }

//   async sendWelcome() {
//     const subject = 'Vítejte v Proud Distribution - Potvrzení registrace'

//     // Build HTML content for welcome email with registration confirmation
//     const htmlContent = `
//       <h2>Vítejte v Proud Distribution!</h2>
//       <p>Dobrý den, ${this.name},</p>
//       <p>Děkujeme za registraci na našem e-shopu. Pro dokončení registrace a aktivaci vašeho účtu prosím klikněte na tlačítko níže.</p>

//       <div style="text-align: center; margin: 30px 0;">
//         <a href="${this.url}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
//           Aktivovat účet
//         </a>
//       </div>

//       <p>Pokud tlačítko nefunguje, můžete zkopírovat následující odkaz do prohlížeče:</p>
//       <p>${this.url}</p>

//       <p>Tento odkaz je platný po dobu 24 hodin. Po této době bude nutné provést registraci znovu.</p>

//       <p>Po potvrzení registrace budete mít přístup ke všem funkcím našeho e-shopu:</p>
//       <ul>
//         <li>Správa oblíbených produktů</li>
//         <li>Sledování objednávek</li>
//         <li>Rychlejší proces nákupu</li>
//       </ul>

//       <p>Těšíme se na Vaše nákupy!</p>
//       <p>S pozdravem,<br>Tým Proud Distribution</p>
//     `

//     await this.send('welcome', subject, htmlContent)
//   }

//   async sendPaymentErrorEmail() {
//     const subject = `Chyba při zpracování platby`

//     // Build HTML content for payment error notification
//     const htmlContent = `
//       <h2>Chyba při zpracování platby</h2>
//       <p>Došlo k chybě při zpracování platby pro objednávku od uživatele: ${this.data.email}</p>

//       <h3>Detaily chyby:</h3>
//       <p>${this.data.error || 'Nespecifikovaná chyba'}</p>

//       <p>Prosím zkontrolujte systém Stripe a případně kontaktujte zákazníka.</p>

//       <p>Tento email je automaticky generován a slouží pouze pro interní účely.</p>
//     `

//     // Send to admin email
//     const originalTo = this.to
//     this.to = process.env.ADMIN_EMAIL

//     await this.send('paymentError', subject, htmlContent)

//     // Restore original recipient
//     this.to = originalTo
//   }
// }

// export default Email
