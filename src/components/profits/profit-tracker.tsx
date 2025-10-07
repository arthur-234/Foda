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
  Target,
  Calendar,
  Filter
} from "lucide-react"

interface Profit {
  id: string
  source: string
  type: string
  amount: number
  date: string
  description: string
}

export function ProfitTracker() {
  const [profits, setProfits] = useState<Profit[]>([])
  const [newProfit, setNewProfit] = useState({
    source: "",
    type: "",
    amount: "",
    date: "",
    description: ""
  })
  const [filterType, setFilterType] = useState<string>("all")
  const [filterMonth, setFilterMonth] = useState<string>("all")

  // Carregar dados do localStorage
  useEffect(() => {
    const savedProfits = localStorage.getItem("profits")
    if (savedProfits) {
      setProfits(JSON.parse(savedProfits))
    }
  }, [])

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem("profits", JSON.stringify(profits))
  }, [profits])

  const addProfit = () => {
    if (newProfit.source && newProfit.type && newProfit.amount) {
      const profit: Profit = {
        id: Date.now().toString(),
        source: newProfit.source,
        type: newProfit.type,
        amount: parseFloat(newProfit.amount),
        date: newProfit.date || new Date().toISOString().split('T')[0],
        description: newProfit.description
      }
      
      setProfits([...profits, profit])
      setNewProfit({
        source: "",
        type: "",
        amount: "",
        date: "",
        description: ""
      })
    }
  }

  const removeProfit = (id: string) => {
    setProfits(profits.filter(profit => profit.id !== id))
  }

  const getFilteredProfits = () => {
    let filtered = profits

    if (filterType !== "all") {
      filtered = filtered.filter(profit => profit.type === filterType)
    }

    if (filterMonth !== "all") {
      filtered = filtered.filter(profit => {
        const profitMonth = new Date(profit.date).getMonth() + 1
        return profitMonth.toString() === filterMonth
      })
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const calculateTotalProfits = () => {
    return getFilteredProfits().reduce((total, profit) => total + profit.amount, 0)
  }

  const calculateMonthlyAverage = () => {
    const filteredProfits = getFilteredProfits()
    if (filteredProfits.length === 0) return 0

    const months = new Set(filteredProfits.map(profit => 
      new Date(profit.date).toISOString().slice(0, 7)
    ))
    
    return calculateTotalProfits() / months.size
  }

  const getProfitsByType = () => {
    const filtered = getFilteredProfits()
    const byType: { [key: string]: number } = {}
    
    filtered.forEach(profit => {
      byType[profit.type] = (byType[profit.type] || 0) + profit.amount
    })
    
    return byType
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dividendos': return <DollarSign className="h-4 w-4" />
      case 'vendas': return <TrendingUp className="h-4 w-4" />
      case 'juros': return <Target className="h-4 w-4" />
      case 'bonus': return <BarChart3 className="h-4 w-4" />
      case 'outros': return <PieChart className="h-4 w-4" />
      default: return <DollarSign className="h-4 w-4" />
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'dividendos': return 'bg-green-100 text-green-800'
      case 'vendas': return 'bg-blue-100 text-blue-800'
      case 'juros': return 'bg-purple-100 text-purple-800'
      case 'bonus': return 'bg-orange-100 text-orange-800'
      case 'outros': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'dividendos': return 'Dividendos'
      case 'vendas': return 'Vendas'
      case 'juros': return 'Juros'
      case 'bonus': return 'Bônus'
      case 'outros': return 'Outros'
      default: return type
    }
  }

  const profitsByType = getProfitsByType()

  return (
    <div className="space-y-6">
      {/* Resumo dos Lucros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Lucros</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {calculateTotalProfits().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Mensal</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {calculateMonthlyAverage().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Registros</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getFilteredProfits().length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lucros por Tipo */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Tipo</CardTitle>
          <CardDescription>
            Análise dos seus lucros por categoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(profitsByType).length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Nenhum lucro registrado ainda.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(profitsByType).map(([type, amount]) => (
                <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(type)}
                    <span className="font-medium">{getTypeLabel(type)}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {((amount / calculateTotalProfits()) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Adicionar Novo Lucro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Registrar Lucro
          </CardTitle>
          <CardDescription>
            Adicione um novo lucro ao seu histórico
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">Fonte</Label>
              <Input
                id="source"
                placeholder="Ex: PETR4, Freelance, Venda"
                value={newProfit.source}
                onChange={(e) => setNewProfit({...newProfit, source: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={newProfit.type} onValueChange={(value) => setNewProfit({...newProfit, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dividendos">Dividendos</SelectItem>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="juros">Juros</SelectItem>
                  <SelectItem value="bonus">Bônus</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="150.00"
                value={newProfit.amount}
                onChange={(e) => setNewProfit({...newProfit, amount: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={newProfit.date}
                onChange={(e) => setNewProfit({...newProfit, date: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Input
              id="description"
              placeholder="Detalhes sobre este lucro..."
              value={newProfit.description}
              onChange={(e) => setNewProfit({...newProfit, description: e.target.value})}
            />
          </div>

          <Button onClick={addProfit} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Registrar Lucro
          </Button>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Filtrar por Tipo</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="dividendos">Dividendos</SelectItem>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="juros">Juros</SelectItem>
                  <SelectItem value="bonus">Bônus</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Filtrar por Mês</Label>
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os meses</SelectItem>
                  <SelectItem value="1">Janeiro</SelectItem>
                  <SelectItem value="2">Fevereiro</SelectItem>
                  <SelectItem value="3">Março</SelectItem>
                  <SelectItem value="4">Abril</SelectItem>
                  <SelectItem value="5">Maio</SelectItem>
                  <SelectItem value="6">Junho</SelectItem>
                  <SelectItem value="7">Julho</SelectItem>
                  <SelectItem value="8">Agosto</SelectItem>
                  <SelectItem value="9">Setembro</SelectItem>
                  <SelectItem value="10">Outubro</SelectItem>
                  <SelectItem value="11">Novembro</SelectItem>
                  <SelectItem value="12">Dezembro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Lucros */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Lucros</CardTitle>
          <CardDescription>
            Seus lucros registrados em ordem cronológica
          </CardDescription>
        </CardHeader>
        <CardContent>
          {getFilteredProfits().length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum lucro encontrado com os filtros aplicados.</p>
              <p className="text-sm">Registre seu primeiro lucro acima.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {getFilteredProfits().map((profit) => (
                <div key={profit.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(profit.type)}
                      <div>
                        <h3 className="font-semibold">{profit.source}</h3>
                        <Badge className={getTypeBadgeColor(profit.type)}>
                          {getTypeLabel(profit.type)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="font-bold text-green-600 text-lg">
                          R$ {profit.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(profit.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeProfit(profit.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {profit.description && (
                    <>
                      <Separator className="my-3" />
                      <p className="text-sm text-muted-foreground">{profit.description}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}