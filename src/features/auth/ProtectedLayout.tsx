import { Navigate } from "react-router-dom"

import FullPage from "@/components/FullPage"
import { Spinner } from "@/components/ui/spinner"
import { useUser } from "./useUser"

interface ProtectedLayoutProps {
  children: React.ReactNode
}

function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isAuthenticated, isLoading } = useUser()

  if (isLoading) {
    return (
      <FullPage>
        <Spinner className="size-8" />
      </FullPage>
    )
  }

  if (!isAuthenticated) return <Navigate to="/landing" />

  return children
}

export default ProtectedLayout
