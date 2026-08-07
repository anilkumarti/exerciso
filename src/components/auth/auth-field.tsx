'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
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
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (visible ? 'text' : 'password') : type

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          inputMode={inputMode}
          defaultValue={defaultValue}
          aria-invalid={errors && errors.length > 0 ? true : undefined}
          aria-describedby={errors?.length ? `${id}-error` : undefined}
          className={cn('h-12 text-base', isPassword && 'pr-11', errors?.length && 'border-destructive')}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible(v => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {errors?.map((e) => (
        <p key={e} id={`${id}-error`} className="text-xs text-destructive">
          {e}
        </p>
      ))}
    </div>
  )
}
