// components/FormContainer.jsx
const FormContainer = ({ children }) => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md px-4 py-8 bg-white shadow-md rounded-lg">{children}</div>
    </div>
  )
}

export default FormContainer
