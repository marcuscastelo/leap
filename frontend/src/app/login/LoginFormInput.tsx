import { InputHTMLAttributes } from 'react'
import { cn } from '~/lib/cn'

export function LoginFormInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const className =
    'text-center bg-slate-700 border border-slate-900 rounded p-2 focus:placeholder-transparent'

  return <input {...props} className={cn(className, props.className)}></input>
}
