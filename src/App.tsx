import { lazy, Suspense } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import AppLayout from "./components/AppLayout"
import ProtectedLayout from "./features/auth/ProtectedLayout"

const Login = lazy(() => import("./pages/Login"))
const Signup = lazy(() => import("./pages/Signup"))
const Landing = lazy(() => import("./pages/Landing"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const Categories = lazy(() => import("./pages/Categories"))
const Transactions = lazy(() => import("./pages/Transactions"))
const Budget = lazy(() => import("./pages/Budget"))
const Debts = lazy(() => import("./pages/Debts"))
const Positions = lazy(() => import("./pages/Positions"))

const STALE_TIME = 200
const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME * 1000,
    },
  },
})

function App() {
  return (
    <TooltipProvider>
      <QueryClientProvider client={client}>
        <ReactQueryDevtools initialIsOpen={false} />
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-[100dvh] bg-background" />}>
            <Routes>
              <Route path="/landing" element={<Landing />} />
              <Route path="/signin" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/"
                element={
                  <ProtectedLayout>
                    <AppLayout />
                  </ProtectedLayout>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="categories" element={<Categories />} />
                <Route path="budget" element={<Budget />} />
                <Route path="debts" element={<Debts />} />
                <Route path="positions" element={<Positions />} />
                <Route path="transactions" element={<Transactions />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </QueryClientProvider>
    </TooltipProvider>
  )
}

export default App
