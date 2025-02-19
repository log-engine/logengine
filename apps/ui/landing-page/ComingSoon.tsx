import React, { useState } from 'react'
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Search, Check } from 'lucide-react'

const ComingSoon: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your backend
    console.log('Submitted email:', email)
    setIsSubmitted(true)
    setEmail('')
  }

  return (
    <div className="flex flex-col min-h-screen font-mono bg-gray-100 dark:bg-gray-900">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <a href="#" className="flex items-center justify-center">
          <Search className="h-6 w-6 mr-2 text-primary" />
          <span className="font-bold text-xl">logengine.io</span>
        </a>
      </header>
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
            Powerful Log Management<br />Coming Soon
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Simplify your log analysis, enhance your application insights, and boost your development workflow with logengine.io
          </p>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="max-w-sm"
              />
              <Button type="submit">Join the Waiting List</Button>
            </form>
          ) : (
            <div className="flex items-center justify-center text-green-600 dark:text-green-400">
              <Check className="mr-2" />
              <span>Thank you for joining our waiting list!</span>
            </div>
          )}
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center">
              <Search className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Advanced Search</h3>
              <p className="text-gray-600 dark:text-gray-400">Find the logs you need quickly and efficiently</p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="h-12 w-12 mb-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Real-time Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400">Get instant insights with real-time log analysis</p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="h-12 w-12 mb-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Secure Access</h3>
              <p className="text-gray-600 dark:text-gray-400">Role-based access control for your logs</p>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-gray-500 dark:text-gray-400">
        <p>© 2023 logengine.io. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default ComingSoon

