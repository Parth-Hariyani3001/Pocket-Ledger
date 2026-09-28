import { Link } from "react-router-dom"

interface AuthFormFooterProps {
  pathTo: string
  destination: string
  message: string
}

function AuthFormFooter({ pathTo, destination, message }: AuthFormFooterProps) {
  return (
    <p className="site-auth-switch">
      {message}{" "}
      <Link to={pathTo}>{destination}</Link>
    </p>
  )
}

export default AuthFormFooter
