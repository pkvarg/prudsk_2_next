'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Product = ({ product }) => {
  return (
    <div className="my-3 p-3 flex flex-col h-full">
      {/* Product Card */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full group">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-t-lg">
          <Link href={`/product/${product.id}`}>
            <div className="relative w-full h-64 md:h-72 bg-gray-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              {/* Discount badge */}
              {product.discount > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                  -{product.discount}%
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Product Name */}
          <Link href={`/product/${product.id}`} className="no-underline">
            <h3 className="text-[#071e46] font-bold text-lg mb-3 hover:text-[#9b7d57] transition-colors duration-200 line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Product Price */}
          <div className="mt-auto pt-2">
            {product.discount ? (
              <div className="space-y-1">
                {/* Discount label */}
                <div className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                  Sleva {product.discount}%
                </div>
                {/* Discounted price */}
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-[#071e46]">
                    {product.discountedPrice} Kč
                  </span>
                  <span className="text-sm text-gray-500 line-through">{product.price} Kč</span>
                </div>
              </div>
            ) : (
              <div className="text-xl font-semibold text-[#071e46] capitalize">
                {product.price} Kč
              </div>
            )}
          </div>

          {/* Additional product info (optional) */}
          {product.author && (
            <div className="mt-2 text-sm text-[#9b7d57]">Autor: {product.author}</div>
          )}

          {product.category && (
            <div className="mt-1 text-xs text-gray-500 uppercase tracking-wide">
              {product.category}
            </div>
          )}
        </div>

        {/* Hover overlay for quick actions */}
        {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 rounded-lg pointer-events-none"></div> */}
      </div>
    </div>
  )
}

export default Product
