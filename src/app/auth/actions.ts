'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { sendWelcomeEmail } from '@/lib/emails'

export async function login(formData: FormData) {
  let redirectPath: string | null = null

  try {
    const supabase = await createClient()

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
      redirectPath = `/auth/login?error=${encodeURIComponent(error.message)}`
    } else {
      redirectPath = '/dashboard'
    }
  } catch (err: any) {
    // Re-throw Next.js internal errors (redirects, notFound, etc.)
    if (err && typeof err === 'object' && 'digest' in err) {
      throw err
    }
    console.error('Login error:', err)
    redirectPath = `/auth/login?error=${encodeURIComponent(err?.message || 'An unexpected error occurred')}`
  }

  redirect(redirectPath!)
}

export async function signup(formData: FormData) {
  let redirectPath: string | null = null

  try {
    const supabase = await createClient()

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const { data: signupData, error } = await supabase.auth.signUp(data)

    if (error) {
      redirectPath = `/auth/signup?error=${encodeURIComponent(error.message)}`
    } else {
      // Send branded welcome email via Resend (non-blocking)
      if (signupData.user?.email) {
        try {
          await sendWelcomeEmail(signupData.user.email)
        } catch (emailErr) {
          console.error('Welcome email failed (non-critical):', emailErr)
        }
      }

      redirectPath = '/auth/login?message=Account created successfully! You can now sign in.'
    }
  } catch (err: any) {
    // Re-throw Next.js internal errors (redirects, notFound, etc.)
    if (err && typeof err === 'object' && 'digest' in err) {
      throw err
    }
    console.error('Signup error:', err)
    redirectPath = `/auth/signup?error=${encodeURIComponent(err?.message || 'An unexpected error occurred')}`
  }

  redirect(redirectPath!)
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

