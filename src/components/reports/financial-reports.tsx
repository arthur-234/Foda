"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart as PieChartIcon,
  BarChart3,
  Calendar
} from "lucide-react"

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
}

interface Investment {
  id: string
  name: string
  type: string
  quantity: number
  purchasePrice: number
  currentPrice: number
  purchaseDate: string
}

interface Profit {
  id: string
  source: string
  type: string
  amount: number
  date: string
  description: string
}

export function FinancialReports() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])
  const [profits, setProfits] = useState<Profit[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<string>("6")

  // Carregar dados do localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses")
    const savedInvestments = localStorage.getItem("investments")
    const savedProfits = localStorage.getItem("profits")
    
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses))
    if (savedInvestments) setInvestments(JSON.parse(savedInvestments))
    if (savedProfits) setProfits(JSON.parse(savedProfits))
  }, [])

  // Cores para os gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  // Dados para gráfico de gastos por categoria
  const getExpensesByCategory = () => {
    const categoryTotals: { [key: string]: number } = {}
    
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
    })
    
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount
    }))
  }

  // Dados para gráfico de investimentos por tipo
  const getInvestmentsByType = () => {
    const typeTotals: { [key: string]: number } = {}
    
    investments.forEach(investment => {
      const currentValue = investment.quantity * investment.currentPrice
      const typeLabel = investment.type === 'acao' ? 'Ações' :
                       investment.type === 'fii' ? 'FIIs' :
                       investment.type === 'renda-fixa' ? 'Renda Fixa' :
                       investment.type === 'cripto' ? 'Criptomoedas' : investment.type
      
      typeTotals[typeLabel] = (typeTotals[typeLabel] || 0) + currentValue
    })
    
    return Object.entries(typeTotals).map(([type, value]) => ({
      name: type,
      value: value
    }))
  }

  // Dados para gráfico de lucros por tipo
  const getProfitsByType = () => {
    const typeTotals: { [key: string]: number } = {}
    
    profits.forEach(profit => {
      const typeLabel = profit.type === 'dividendos' ? 'Dividendos' :
                       profit.type === 'vendas' ? 'Vendas' :
                       profit.type === 'juros' ? 'Juros' :
                       profit.type === 'bonus' ? 'Bônus' : 'Outros'
      
      typeTotals[typeLabel] = (typeTotals[typeLabel] || 0) + profit.amount
    })
    
    return Object.entries(typeTotals).map(([type, amount]) => ({
      name: type,
      value: amount
    }))
  }

  // Dados para gráfico de evolução mensal
  const getMonthlyEvolution = () => {
    const monthsToShow = parseInt(selectedPeriod)
    const monthlyData: { [key: string]: { gastos: number, lucros: number, investimentos: number } } = {}
    
    // Inicializar meses
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = date.toISOString().slice(0, 7)
      const monthLabel = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
      monthlyData[monthKey] = { gastos: 0, lucros: 0, investimentos: 0 }
    }
    
    // Somar gastos
    expenses.forEach(expense => {
      const monthKey = expense.date.slice(0, 7)
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].gastos += expense.amount
      }
    })
    
    // Somar lucros
    profits.forEach(profit => {
      const monthKey = profit.date.slice(0, 7)
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].lucros += profit.amount
      }
    })
    
    // Somar investimentos (valor investido no mês)
    investments.forEach(investment => {
      const monthKey = investment.purchaseDate.slice(0, 7)
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].investimentos += investment.quantity * investment.purchasePrice
      }
    })
    
    return Object.entries(monthlyData).map(([monthKey, data]) => {
      const date = new Date(monthKey + '-01')
      const monthLabel = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
      return {
        month: monthLabel,
        gastos: data.gastos,
        lucros: data.lucros,
        investimentos: data.investimentos,
        saldo: data.lucros - data.gastos
      }
    })
  }

  // Calcular totais
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalProfits = profits.reduce((sum, profit) => sum + profit.amount, 0)
  const totalInvestments = investments.reduce((sum, inv) => sum + (inv.quantity * inv.currentPrice), 0)
  const totalInvested = investments.reduce((sum, inv) => sum + (inv.quantity * inv.purchasePrice), 0)
  const totalGainLoss = totalInvestments - totalInvested

  const expensesByCategory = getExpensesByCategory()
  const investmentsByType = getInvestmentsByType()
  const profitsByType = getProfitsByType()
  const monthlyEvolution = getMonthlyEvolution()

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gastos</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lucros</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalProfits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Investido</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {totalInvestments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Líquido</CardTitle>
            {(totalProfits - totalExpenses) >= 0 ? 
              <TrendingUp className="h-4 w-4 text-green-500" /> : 
              <TrendingDown className="h-4 w-4 text-red-500" />
            }
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(totalProfits - totalExpenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {(totalProfits - totalExpenses).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controle de Período */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Período de Análise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Últimos 3 meses</SelectItem>
              <SelectItem value="6">Últimos 6 meses</SelectItem>
              <SelectItem value="12">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Evolução Mensal */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução Mensal</CardTitle>
          <CardDescription>
            Acompanhe a evolução dos seus gastos, lucros e investimentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={monthlyEvolution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [
                  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                  ''
                ]}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="lucros" 
                stackId="1" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.6}
                name="Lucros"
              />
              <Area 
                type="monotone" 
                dataKey="gastos" 
                stackId="2" 
                stroke="#EF4444" 
                fill="#EF4444" 
                fillOpacity={0.6}
                name="Gastos"
              />
              <Line 
                type="monotone" 
                dataKey="saldo" 
                stroke="#8884D8" 
                strokeWidth={3}
                name="Saldo"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráficos de Distribuição */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gastos por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Gastos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [
                      `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                      'Valor'
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum gasto registrado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Investimentos por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Investimentos por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {investmentsByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={investmentsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {investmentsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [
                      `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                      'Valor'
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum investimento registrado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lucros por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Lucros por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profitsByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={profitsByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [
                      `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                      'Valor'
                    ]}
                  />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum lucro registrado
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}