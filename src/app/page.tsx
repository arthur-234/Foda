'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { LoginForm } from '@/components/auth/login-form'
import { Sidebar } from '@/components/layout/sidebar'
import { InvestmentCalculator } from '@/components/calculator/investment-calculator'
import { CompoundInterestCalculator } from '@/components/calculator/compound-interest-calculator'
import { LoanCalculator } from '@/components/calculator/loan-calculator'
import { RetirementCalculator } from '@/components/calculator/retirement-calculator'

export default function Home() {
  const { isAuthenticated } = useAuth()
  const [activeCalculator, setActiveCalculator] = useState('investment')

  if (!isAuthenticated) {
    return <LoginForm />
  }

  const renderCalculator = () => {
    switch (activeCalculator) {
      case 'investment':
        return <InvestmentCalculator />
      case 'compound':
        return <CompoundInterestCalculator />
      case 'loan':
        return <LoanCalculator />
      case 'retirement':
        return <RetirementCalculator />
      default:
        return <InvestmentCalculator />
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        activeCalculator={activeCalculator}
        onCalculatorChange={setActiveCalculator}
      />
      
      <main className="flex-1 overflow-auto">
        <div className="h-full p-6">
          <div className="max-w-6xl mx-auto h-full">
            {renderCalculator()}
          </div>
        </div>
      </main>
    </div>
  )
}
