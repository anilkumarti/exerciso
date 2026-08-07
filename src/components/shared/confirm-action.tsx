'use client'

export function ConfirmAction({
  action,
  message,
  className,
  children,
}: {
  action: (formData: FormData) => Promise<void>
  message: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(e) => {
        if (!window.confirm(message)) e.preventDefault()
      }}
    >
      {children}
    </form>
  )
}
