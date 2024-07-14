'use client'

import { loginAction } from '~/server/actions/auth'
import { LoginFormInput } from './LoginFormInput'
import { LoginFormButton } from './LoginFormButton'
import { useFormState } from 'react-dom'

export function LoginForm() {
  const [state, action, pending] = useFormState(loginAction, {
    errors: {},
  })

  return (
    <div className="p-5">
      <form action={action}>
        <div>
          <div className="flex flex-col items-center space-y-1">
            <LoginFormInput
              name="email"
              className="w-64"
              type="text"
              placeholder="Username"
              disabled={pending}
            />
            {state.errors?.email && (
              <div className="text-red-500 text-sm">{state.errors.email}</div>
            )}
            <LoginFormInput
              name="password"
              className="w-64"
              type="password"
              placeholder="Password"
              disabled={pending}
            />
            {state.errors?.password && (
              <div className="text-red-500 text-sm">
                {state.errors.password}
              </div>
            )}
            <LoginFormButton className="w-64" type="submit">
              {pending ? 'Loading...' : 'Login'}
            </LoginFormButton>
          </div>
        </div>
      </form>
    </div>
  )
}
