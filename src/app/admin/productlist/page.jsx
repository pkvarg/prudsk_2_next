'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useProductStore from '../../../store/useProductStore'
import useUserStore from '../../../store/userStore'
import Loader from '../../components/Loader'

// This is a redirect page that simply redirects to page 1
const ProductListDefaultPage = () => {
  const router = useRouter()
  const { userInfo } = useUserStore()
  const { loading } = useProductStore()

  useEffect(() => {
    // Check if user is admin before redirecting
    if (!userInfo?.isAdmin) {
      router.push('/login')
    } else {
      // Redirect to page 1
      router.push('/admin/productlist/1')
    }
  }, [router, userInfo])

  return <div className="flex items-center justify-center h-screen">{loading && <Loader />}</div>
}

export default ProductListDefaultPage
