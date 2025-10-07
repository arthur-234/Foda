'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useAuth } from '@/contexts/auth-context'
import { 
  Calculator, 
  PiggyBank, 
  TrendingUp, 
  DollarSign, 
  Home,
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react'

interface SidebarProps {
  activeCalculator: string
  onCalculatorChange: (calculator: string) => void
}

export function Sidebar({ activeCalculator, onCalculatorChange }: SidebarProps) {
  const { user, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const calculators = [
    { id: 'investment', name: 'Investimentos', icon: TrendingUp },
    { id: 'compound', name: 'Juros Compostos', icon: PiggyBank },
    { id: 'loan', name: 'Financiamentos', icon: DollarSign },
    { id: 'retirement', name: 'Aposentadoria', icon: Calculator },
  ]

  return (
    <div className={`bg-background border-r border-border transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col h-screen`}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">FinanceCalc</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-2">
        <nav className="space-y-1">
          {calculators.map((calc) => {
            const Icon = calc.icon
            return (
              <Button
                key={calc.id}
                variant={activeCalculator === calc.id ? 'default' : 'ghost'}
                className={`w-full justify-start gap-3 ${isCollapsed ? 'px-2' : 'px-3'}`}
                onClick={() => onCalculatorChange(calc.id)}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span>{calc.name}</span>}
              </Button>
            )
          })}
        </nav>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className="space-y-2">
          {/* User Info */}
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className={`flex gap-2 ${isCollapsed ? 'flex-col' : ''}`}>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className={`${isCollapsed ? 'w-full px-2' : 'flex-1'}`}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Sair</span>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}