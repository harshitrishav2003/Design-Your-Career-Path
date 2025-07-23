// import { SignIn } from '@clerk/clerk-react'
import React from 'react'
import { SignIn } from "@/components/custom/Signin"
function SignInPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
    <div className="w-full max-w-sm md:max-w-3xl">
      <SignIn />
    </div>
  </div>
  )
}

export default SignInPage