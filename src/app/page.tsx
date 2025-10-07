'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { LoginForm } from '@/components/auth/login-form'
import { Sidebar } from '@/components/layout/sidebar'
import { InvestmentCalculator } from '@/components/calculator/investment-calculator'
import { CompoundInterestCalculator } from '@/components/calculator/compound-interest-calculator'
import { LoanCalculator } from '@/components/calculator/loan-calculator'
import { RetirementCalculator } from '@/components/calculator/retirement-calculator'
import { PersonalLoanCalculator } from '@/components/calculator/personal-loan-calculator'
import { RealEstateCalculator } from '@/components/calculator/real-estate-calculator'
import { ExpenseTracker } from '@/components/expenses/expense-tracker'
import { InvestmentPortfolio } from '@/components/investments/investment-portfolio'
import { ProfitTracker } from '@/components/profits/profit-tracker'
import { FinancialReports } from '@/components/reports/financial-reports'
import { NotesOrganizer } from '@/components/notes/notes-organizer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { clearAllData } from '@/lib/clear-data'
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Calculator,
  CreditCard,
  BarChart3,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  FileText
} from 'lucide-react'

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  const [activeSection, setActiveSection] = useState('dashboard')

  if (!isAuthenticated) {
    return <LoginForm />
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bem-vindo, {user?.name}!</h1>
          <p className="text-muted-foreground">Aqui está um resumo das suas finanças</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
                clearAllData()
                window.location.reload()
              }
            }}
          >
            Limpar Dados
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.231,89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +20.1% em relação ao mês passado
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucros</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 12.234,56</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +15.3% este mês
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 3.456,78</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                +5.2% este mês
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patrimônio</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 54.009,67</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +18.7% este ano
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Button 
          variant="outline" 
          className="h-20 flex-col"
          onClick={() => setActiveSection('calculators')}
        >
          <Calculator className="h-6 w-6 mb-2" />
          Calculadoras
        </Button>
        <Button 
          variant="outline" 
          className="h-20 flex-col"
          onClick={() => setActiveSection('expenses')}
        >
          <CreditCard className="h-6 w-6 mb-2" />
          Adicionar Gasto
        </Button>
        <Button 
          variant="outline" 
          className="h-20 flex-col"
          onClick={() => setActiveSection('investments')}
        >
          <TrendingUp className="h-6 w-6 mb-2" />
          Novo Investimento
        </Button>
        <Button 
          variant="outline" 
          className="h-20 flex-col"
          onClick={() => setActiveSection('reports')}
        >
          <BarChart3 className="h-6 w-6 mb-2" />
          Ver Relatórios
        </Button>
        <Button 
          variant="outline" 
          className="h-20 flex-col"
          onClick={() => setActiveSection('notes')}
        >
          <FileText className="h-6 w-6 mb-2" />
          Notas & Tarefas
        </Button>
      </div>
    </div>
  )

  const renderCalculators = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Calculadoras Financeiras</h1>
        <p className="text-muted-foreground">Ferramentas para planejar seus investimentos e finanças</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection('investment')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Calculadora de Investimentos
            </CardTitle>
            <CardDescription>
              Calcule o crescimento dos seus investimentos ao longo do tempo
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection('compound')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Juros Compostos
            </CardTitle>
            <CardDescription>
              Veja o poder dos juros compostos nos seus investimentos
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection('loan')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Financiamentos
            </CardTitle>
            <CardDescription>
              Calcule parcelas e juros de financiamentos
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection('retirement')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Aposentadoria
            </CardTitle>
            <CardDescription>
              Planeje sua aposentadoria com segurança
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection('personal-loan')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Empréstimo Pessoal
            </CardTitle>
            <CardDescription>
              Simule empréstimos pessoais e calcule parcelas
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection('real-estate')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Financiamento Imobiliário
            </CardTitle>
            <CardDescription>
              Calcule o financiamento do seu imóvel
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )

  const renderExpenses = () => <ExpenseTracker />

  const renderInvestments = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Meus Investimentos</h2>
      <InvestmentPortfolio />
    </div>
  )

  const renderProfits = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Meus Lucros</h2>
      <ProfitTracker />
    </div>
  )

  const renderReports = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Relatórios Financeiros</h2>
      <FinancialReports />
    </div>
  )

  const renderNotes = () => <NotesOrganizer />

  const renderCalculator = () => {
    switch (activeSection) {
      case 'investment':
        return <InvestmentCalculator />
      case 'compound':
        return <CompoundInterestCalculator />
      case 'loan':
        return <LoanCalculator />
      case 'retirement':
        return <RetirementCalculator />
      case 'personal-loan':
        return <PersonalLoanCalculator />
      case 'real-estate':
        return <RealEstateCalculator />
      default:
        return <InvestmentCalculator />
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard()
      case 'calculators':
        return renderCalculators()
      case 'expenses':
        return renderExpenses()
      case 'investments':
        return renderInvestments()
      case 'profits':
        return renderProfits()
      case 'reports':
        return renderReports()
      case 'notes':
        return renderNotes()
      case 'investment':
      case 'compound':
      case 'loan':
      case 'retirement':
      case 'personal-loan':
      case 'real-estate':
        return renderCalculator()
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <main className="flex-1 overflow-hidden">
        <div className="h-full p-6">
          <div className="max-w-7xl mx-auto h-full overflow-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  )
}
