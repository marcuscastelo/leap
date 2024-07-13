import { ButtonHTMLAttributes } from 'react'
import { cn } from '~/lib/cn'

export function LoginFormButton(
  props: ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const className = 'bg-slate-800 px-4 py-2 rounded text-white'

  return <button {...props} className={cn(className, props.className)}></button>
}
