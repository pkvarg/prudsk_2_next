'use client'
import { useState } from 'react'
import Link from 'next/link'
import useProductStore from '@/store/productStore'
import Loader from '@/app/components/Loader'
import { clearCacheHandler } from '@/app/components/ClearCacheButton'

const Message = ({ variant, children }) => {
  const baseClasses = 'p-4 rounded-md mb-4'
  const variantClasses = {
    success: 'bg-green-100 border border-green-400 text-green-700',
    error: 'bg-red-100 border border-red-400 text-red-700',
    warning: 'bg-yellow-100 border border-yellow-400 text-yellow-700',
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant] || variantClasses.error}`}>
      {children}
    </div>
  )
}

const FormContainer = ({ children }) => {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">{children}</div>
    </div>
  )
}

const CreateDiscount = () => {
  const [discount, setDiscount] = useState('')

  const [messageSuccess, setMessageSuccess] = useState(null)

  const { createDiscount, errorDiscount, loadingDiscount } = useProductStore()

  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      console.log('Submitting discount:', discount)

      await createDiscount({
        discount: discount,
      })

      console.log('discount', discount)

      if (discount > 0) {
        setMessageSuccess(`Akce vytvorená`)
      } else if (discount === 0) {
        setMessageSuccess(`Akce zrušená`)
      }
      clearCacheHandler()
    } catch (error) {
      console.error('Error creating discount:', error)
      setMessageSuccess(errorDiscount)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/admin/productlist"
        className="inline-flex items-center px-4 my-8 py-2 bg-[#2bb2e6] !text-white rounded hover:bg-[#218334] transition-colors duration-200"
      >
        Zpět
      </Link>

      <FormContainer>
        <h1 className="text-2xl font-bold text-[#071e46] mb-6">Nová akce na všechny produkty</h1>
        <div className="flex items-center justify-center h-16">{loadingDiscount && <Loader />}</div>

        {messageSuccess && <Message variant="success">{messageSuccess}</Message>}

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label
              htmlFor="discount-value"
              className="block text-sm font-medium text-[#071e46] mb-2"
            >
              Výška akce bez %. Akci možno zrušit zadáním 0.
            </label>
            <input
              id="discount-value"
              type="text"
              placeholder="sleva"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9b7d57] focus:border-[#9b7d57]"
            />
          </div>

          <button
            className="w-full bg-[#2bb2e6] text-white py-2 px-4 rounded-md transition-colors mt-5 font-medium cursor-pointer"
            type="submit"
          >
            Vytvořit
          </button>
        </form>
      </FormContainer>
    </div>
  )
}

export default CreateDiscount
