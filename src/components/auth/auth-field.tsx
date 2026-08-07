'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface AuthFieldProps {
  id: string
  name: string
  label: string
  type?: string
  placeholder?: string
  autoComplete?: string
  errors?: string[]
  required?: boolean
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  defaultValue?: string
}

export function AuthField({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  autoComplete,
  errors,
  required,
  inputMode,
  defaultValue,
}: AuthFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        inputMode={inputMode}
        defaultValue={defaultValue}
        aria-invalid={errors && errors.length > 0 ? true : undefined}
        aria-describedby={errors?.length ? `${id}-error` : undefined}
        className={cn('h-12 text-base', errors?.length && 'border-destructive')}
      />
      {errors?.map((e) => (
        <p key={e} id={`${id}-error`} className="text-xs text-destructive">
          {e}
        </p>
      ))}
    </div>
  )
}
