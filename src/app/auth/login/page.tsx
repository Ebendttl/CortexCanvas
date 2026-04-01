'use client'

import { login } from '../actions'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white">Welcome Back</h2>
        <p className="text-zinc-400 text-sm mt-1">Sign in to your account</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-500/10 border border-green-500/50 p-3 rounded-lg text-green-500 text-sm text-center">
          {message}
        </div>
      )}

      <form action={login} className="space-y-4">
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
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-zinc-400" htmlFor="password">
              Password
            </label>
            <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
              Forgot password?
            </a>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium py-2 rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
        >
          Sign In
        </motion.button>
      </form>

      <div className="text-center pt-2">
        <p className="text-zinc-500 text-sm">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-8 text-zinc-500">Loading login...</div>}>
      <LoginForm />
    </Suspense>
  )
}
