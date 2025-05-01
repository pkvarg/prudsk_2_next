// components/Loader.js
const Loader = () => {
  return (
    <div className="flex justify-center items-center my-5">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default Loader
