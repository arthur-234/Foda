'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  Car, 
  Home, 
  Utensils, 
  Gamepad2,
  Heart,
  GraduationCap,
  Plane,
  DollarSign
} from 'lucide-react'

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
}

const categories = [
  { id: 'food', name: 'Alimentação', icon: Utensils, color: 'bg-orange-500' },
  { id: 'transport', name: 'Transporte', icon: Car, color: 'bg-blue-500' },
  { id: 'housing', name: 'Moradia', icon: Home, color: 'bg-green-500' },
  { id: 'shopping', name: 'Compras', icon: ShoppingCart, color: 'bg-purple-500' },
  { id: 'entertainment', name: 'Entretenimento', icon: Gamepad2, color: 'bg-pink-500' },
  { id: 'health', name: 'Saúde', icon: Heart, color: 'bg-red-500' },
  { id: 'education', name: 'Educação', icon: GraduationCap, color: 'bg-indigo-500' },
  { id: 'travel', name: 'Viagens', icon: Plane, color: 'bg-cyan-500' },
  { id: 'other', name: 'Outros', icon: DollarSign, color: 'bg-gray-500' }
]

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses')
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const addExpense = () => {
    if (!description || !amount || !category) {
      alert('Por favor, preencha todos os campos')
      return
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      category,
      date
    }

    setExpenses([newExpense, ...expenses])
    setDescription('')
    setAmount('')
    setCategory('')
    setDate(new Date().toISOString().split('T')[0])
  }

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id))
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[categories.length - 1]
  }

  const getTotalByCategory = () => {
    const totals: { [key: string]: number } = {}
    expenses.forEach(expense => {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount
    })
    return totals
  }

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0)
  }

  const categoryTotals = getTotalByCategory()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <CreditCard className="h-8 w-8 mr-3" />
          Meus Gastos
        </h1>
        <p className="text-muted-foreground">
          Controle e categorize seus gastos para melhor gestão financeira
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário para adicionar gastos */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Gasto
            </CardTitle>
            <CardDescription>
              Registre um novo gasto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Ex: Almoço no restaurante"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="Ex: 25.50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center">
                        <cat.icon className="h-4 w-4 mr-2" />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <Button onClick={addExpense} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Gasto
            </Button>
          </CardContent>
        </Card>

        {/* Resumo por categoria */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Resumo por Categoria</CardTitle>
            <CardDescription>
              Total gasto: {formatCurrency(getTotalExpenses())}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const total = categoryTotals[cat.id] || 0
                const percentage = getTotalExpenses() > 0 ? (total / getTotalExpenses()) * 100 : 0
                
                return (
                  <div key={cat.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${cat.color} text-white mr-2`}>
                          <cat.icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-sm">{cat.name}</span>
                      </div>
                    </div>
                    <div className="text-lg font-bold">{formatCurrency(total)}</div>
                    <div className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}% do total
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de gastos */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Gastos</CardTitle>
          <CardDescription>
            {expenses.length} {expenses.length === 1 ? 'gasto registrado' : 'gastos registrados'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhum gasto registrado ainda. Adicione seu primeiro gasto!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => {
                const categoryInfo = getCategoryInfo(expense.category)
                const CategoryIcon = categoryInfo.icon
                
                return (
                  <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${categoryInfo.color} text-white`}>
                        <CategoryIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Badge variant="secondary">{categoryInfo.name}</Badge>
                          <span>{formatDate(expense.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-lg">{formatCurrency(expense.amount)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExpense(expense.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}