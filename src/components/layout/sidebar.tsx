'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  X,
  CreditCard,
  BarChart3,
  Building2,
  Settings,
  PieChart,
  Wallet
} from 'lucide-react'

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { user, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'calculators', name: 'Calculadoras', icon: Calculator },
    { id: 'expenses', name: 'Meus Gastos', icon: CreditCard },
    { id: 'investments', name: 'Meus Investimentos', icon: TrendingUp },
    { id: 'profits', name: 'Meus Lucros', icon: DollarSign },
    { id: 'reports', name: 'Relatórios', icon: BarChart3 },
  ]

  return (
    <div className={`bg-background border-r border-border transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col h-screen`}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg">FinanceCalc</h1>
              <p className="text-xs text-muted-foreground">Gestão Financeira</p>
            </div>
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
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <Button
                key={item.id}
                variant={isActive ? 'default' : 'ghost'}
                className={`w-full justify-start h-10 ${isCollapsed ? 'px-2' : 'px-3'} ${
                  isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && <span>{item.name}</span>}
              </Button>
            )
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-2">
          <div className={`flex gap-2 ${isCollapsed ? 'flex-col' : ''}`}>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSectionChange('settings')}
              className={`${isCollapsed ? 'w-full px-2' : 'flex-1'}`}
            >
              <Settings className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Config</span>}
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Sair</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}