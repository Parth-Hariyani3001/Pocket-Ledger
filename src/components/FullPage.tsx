interface FullPageProps {
  children: React.ReactNode
}

function FullPage({ children }: FullPageProps) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background">
      {children}
    </div>
  )
}

export default FullPage
