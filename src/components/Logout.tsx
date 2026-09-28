import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useSignOut } from "@/features/auth/useSignOut"

function Logout() {
  const { signout, isLoading } = useSignOut()

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => signout()}
      disabled={isLoading}
      aria-label="Sign out"
    >
      {isLoading ? <Spinner /> : <LogOut />}
    </Button>
  )
}

export default Logout
