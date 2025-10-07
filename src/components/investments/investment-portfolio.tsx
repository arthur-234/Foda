"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  DollarSign, 
  PieChart,
  BarChart3,
  Target
} from "lucide-react"

interface Investment {
  id: string
  name: string
  type: string
  quantity: number
  purchasePrice: number
  currentPrice: number
  purchaseDate: string
}

export function InvestmentPortfolio() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [newInvestment, setNewInvestment] = useState({
    name: "",
    type: "",
    quantity: "",
    purchasePrice: "",
    currentPrice: "",
    purchaseDate: ""
  })

  // Carregar dados do localStorage
  useEffect(() => {
    const savedInvestments = localStorage.getItem("investments")
    if (savedInvestments) {
      setInvestments(JSON.parse(savedInvestments))
    }
  }, [])

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem("investments", JSON.stringify(investments))
  }, [investments])

  const addInvestment = () => {
    if (newInvestment.name && newInvestment.type && newInvestment.quantity && 
        newInvestment.purchasePrice && newInvestment.currentPrice) {
      const investment: Investment = {
        id: Date.now().toString(),
        name: newInvestment.name,
        type: newInvestment.type,
        quantity: parseFloat(newInvestment.quantity),
        purchasePrice: parseFloat(newInvestment.purchasePrice),
        currentPrice: parseFloat(newInvestment.currentPrice),
        purchaseDate: newInvestment.purchaseDate || new Date().toISOString().split('T')[0]
      }
      
      setInvestments([...investments, investment])
      setNewInvestment({
        name: "",
        type: "",
        quantity: "",
        purchasePrice: "",
        currentPrice: "",
        purchaseDate: ""
      })
    }
  }

  const removeInvestment = (id: string) => {
    setInvestments(investments.filter(inv => inv.id !== id))
  }

  const calculateTotalValue = () => {
    return investments.reduce((total, inv) => total + (inv.quantity * inv.currentPrice), 0)
  }

  const calculateTotalInvested = () => {
    return investments.reduce((total, inv) => total + (inv.quantity * inv.purchasePrice), 0)
  }

  const calculateTotalGainLoss = () => {
    return calculateTotalValue() - calculateTotalInvested()
  }

  const calculateGainLossPercentage = () => {
    const invested = calculateTotalInvested()
    if (invested === 0) return 0
    return ((calculateTotalGainLoss() / invested) * 100)
  }

  const getInvestmentGainLoss = (investment: Investment) => {
    const currentValue = investment.quantity * investment.currentPrice
    const investedValue = investment.quantity * investment.purchasePrice
    return currentValue - investedValue
  }

  const getInvestmentGainLossPercentage = (investment: Investment) => {
    const investedValue = investment.quantity * investment.purchasePrice
    if (investedValue === 0) return 0
    return ((getInvestmentGainLoss(investment) / investedValue) * 100)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'acao': return <TrendingUp className="h-4 w-4" />
      case 'fii': return <BarChart3 className="h-4 w-4" />
      case 'renda-fixa': return <Target className="h-4 w-4" />
      case 'cripto': return <DollarSign className="h-4 w-4" />
      default: return <PieChart className="h-4 w-4" />
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'acao': return 'bg-blue-100 text-blue-800'
      case 'fii': return 'bg-green-100 text-green-800'
      case 'renda-fixa': return 'bg-purple-100 text-purple-800'
      case 'cripto': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Resumo do Portfólio */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {calculateTotalValue().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {calculateTotalInvested().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganho/Perda</CardTitle>
            {calculateTotalGainLoss() >= 0 ? 
              <TrendingUp className="h-4 w-4 text-green-600" /> : 
              <TrendingDown className="h-4 w-4 text-red-600" />
            }
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${calculateTotalGainLoss() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {calculateTotalGainLoss().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rentabilidade</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${calculateGainLossPercentage() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {calculateGainLossPercentage().toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Adicionar Novo Investimento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Investimento
          </CardTitle>
          <CardDescription>
            Registre um novo investimento no seu portfólio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Ativo</Label>
              <Input
                id="name"
                placeholder="Ex: PETR4, ITUB4, HASH11"
                value={newInvestment.name}
                onChange={(e) => setNewInvestment({...newInvestment, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={newInvestment.type} onValueChange={(value) => setNewInvestment({...newInvestment, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acao">Ação</SelectItem>
                  <SelectItem value="fii">FII</SelectItem>
                  <SelectItem value="renda-fixa">Renda Fixa</SelectItem>
                  <SelectItem value="cripto">Criptomoeda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="100"
                value={newInvestment.quantity}
                onChange={(e) => setNewInvestment({...newInvestment, quantity: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Preço de Compra</Label>
              <Input
                id="purchasePrice"
                type="number"
                step="0.01"
                placeholder="25.50"
                value={newInvestment.purchasePrice}
                onChange={(e) => setNewInvestment({...newInvestment, purchasePrice: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPrice">Preço Atual</Label>
              <Input
                id="currentPrice"
                type="number"
                step="0.01"
                placeholder="28.75"
                value={newInvestment.currentPrice}
                onChange={(e) => setNewInvestment({...newInvestment, currentPrice: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Data da Compra</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={newInvestment.purchaseDate}
                onChange={(e) => setNewInvestment({...newInvestment, purchaseDate: e.target.value})}
              />
            </div>
          </div>

          <Button onClick={addInvestment} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Investimento
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Investimentos */}
      <Card>
        <CardHeader>
          <CardTitle>Meus Investimentos</CardTitle>
          <CardDescription>
            Acompanhe o desempenho dos seus investimentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {investments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum investimento cadastrado ainda.</p>
              <p className="text-sm">Adicione seu primeiro investimento acima.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {investments.map((investment) => (
                <div key={investment.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(investment.type)}
                      <div>
                        <h3 className="font-semibold">{investment.name}</h3>
                        <Badge className={getTypeBadgeColor(investment.type)}>
                          {investment.type === 'acao' && 'Ação'}
                          {investment.type === 'fii' && 'FII'}
                          {investment.type === 'renda-fixa' && 'Renda Fixa'}
                          {investment.type === 'cripto' && 'Criptomoeda'}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeInvestment(investment.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Quantidade</p>
                      <p className="font-medium">{investment.quantity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Preço Médio</p>
                      <p className="font-medium">R$ {investment.purchasePrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Preço Atual</p>
                      <p className="font-medium">R$ {investment.currentPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Valor Total</p>
                      <p className="font-medium">
                        R$ {(investment.quantity * investment.currentPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Ganho/Perda</p>
                      <p className={`font-semibold ${getInvestmentGainLoss(investment) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        R$ {getInvestmentGainLoss(investment).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        {' '}
                        ({getInvestmentGainLossPercentage(investment).toFixed(2)}%)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Data da Compra</p>
                      <p className="font-medium">
                        {new Date(investment.purchaseDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}