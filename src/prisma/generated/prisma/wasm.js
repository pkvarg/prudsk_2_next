
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  password: 'password',
  isRegistered: 'isRegistered',
  registerToken: 'registerToken',
  isAdmin: 'isAdmin',
  isAssistant: 'isAssistant',
  isSubscribed: 'isSubscribed',
  isUnsubscribed: 'isUnsubscribed',
  googleId: 'googleId',
  passwordChangedAt: 'passwordChangedAt',
  passwordResetToken: 'passwordResetToken',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AudioScalarFieldEnum = {
  id: 'id',
  audioTitle: 'audioTitle',
  mp3file: 'mp3file',
  category: 'category',
  subcategory: 'subcategory',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId'
};

exports.Prisma.CounterScalarFieldEnum = {
  id: 'id',
  visitorsCount: 'visitorsCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BannerScalarFieldEnum = {
  id: 'id',
  bannerTitle: 'bannerTitle',
  image: 'image',
  category: 'category',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  orderNumber: 'orderNumber',
  paymentMethod: 'paymentMethod',
  taxPrice: 'taxPrice',
  shippingPrice: 'shippingPrice',
  totalPrice: 'totalPrice',
  isPaid: 'isPaid',
  paidAt: 'paidAt',
  isDelivered: 'isDelivered',
  deliveredAt: 'deliveredAt',
  isCancelled: 'isCancelled',
  isCancelledOrderNumberUsed: 'isCancelledOrderNumberUsed',
  initPaymentId: 'initPaymentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  orderItems: 'orderItems',
  shippingAddress: 'shippingAddress',
  paymentResult: 'paymentResult',
  discounts: 'discounts',
  userId: 'userId'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  name: 'name',
  image: 'image',
  author: 'author',
  category: 'category',
  description: 'description',
  excerpt: 'excerpt',
  rating: 'rating',
  numReviews: 'numReviews',
  price: 'price',
  countInStock: 'countInStock',
  catalog: 'catalog',
  weight: 'weight',
  related: 'related',
  related2: 'related2',
  related3: 'related3',
  discount: 'discount',
  discountedPrice: 'discountedPrice',
  tags: 'tags',
  language: 'language',
  binding: 'binding',
  pages: 'pages',
  isbn: 'isbn',
  year: 'year',
  searchName: 'searchName',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  name: 'name',
  rating: 'rating',
  comment: 'comment',
  isAcknowledged: 'isAcknowledged',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId',
  productId: 'productId'
};

exports.Prisma.FavoriteScalarFieldEnum = {
  id: 'id',
  favoriteOf: 'favoriteOf',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  productId: 'productId'
};

exports.Prisma.VideoScalarFieldEnum = {
  id: 'id',
  videoTitle: 'videoTitle',
  code: 'code',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};


exports.Prisma.ModelName = {
  User: 'User',
  Audio: 'Audio',
  Counter: 'Counter',
  Banner: 'Banner',
  Order: 'Order',
  Product: 'Product',
  Review: 'Review',
  Favorite: 'Favorite',
  Video: 'Video'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
