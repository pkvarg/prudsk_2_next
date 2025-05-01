// components/Message.js
const Message = ({ variant, children }) => {
  // Define variants with corresponding Tailwind classes
  const variantClasses = {
    danger: 'bg-red-100 text-red-700 border-red-300',
    success: 'bg-green-100 text-green-700 border-green-300',
    info: 'bg-blue-100 text-blue-700 border-blue-300',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  }

  // Select the appropriate class or use info as default
  const alertClass = variantClasses[variant] || variantClasses.info

  return <div className={`p-4 mb-4 border rounded-md ${alertClass}`}>{children}</div>
}

export default Message
