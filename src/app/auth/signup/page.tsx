'use client'

import { signup } from '../actions'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SignupForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white">Create Account</h2>
        <p className="text-zinc-400 text-sm mt-1">Get started with CortexCanvas today</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      <form action={signup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="name@example.com"
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
          />
          <p className="text-[10px] text-zinc-500 mt-1">
            Must be at least 8 characters with at least one number and special character.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium py-2 rounded-lg shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
        >
          Create Account
        </motion.button>
      </form>

      <div className="text-center pt-2">
        <p className="text-zinc-500 text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="text-center py-8 text-zinc-500">Loading signup...</div>}>
      <SignupForm />
    </Suspense>
  )
}
