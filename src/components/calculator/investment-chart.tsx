"use client"

import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

interface InvestmentChartProps {
  initialCapital: number
  monthlyContribution: number
  annualRate: number
  months: number
}

interface ChartDataPoint {
  month: number
  totalInvested: number
  totalAmount: number
  monthlyReturn: number
}

export function InvestmentChart({ 
  initialCapital, 
  monthlyContribution, 
  annualRate, 
  months 
}: InvestmentChartProps) {
  const chartData = useMemo(() => {
    const data: ChartDataPoint[] = []
    const monthlyRate = annualRate / 100 / 12
    
    let currentAmount = initialCapital
    let totalInvested = initialCapital

    // Mês 0 (inicial)
    data.push({
      month: 0,
      totalInvested: initialCapital,
      totalAmount: initialCapital,
      monthlyReturn: 0,
    })

    for (let month = 1; month <= months; month++) {
      // Aplicar rendimento sobre o valor atual
      currentAmount = currentAmount * (1 + monthlyRate)
      
      // Adicionar aporte mensal
      currentAmount += monthlyContribution
      totalInvested += monthlyContribution

      const monthlyReturn = currentAmount - totalInvested

      data.push({
        month,
        totalInvested,
        totalAmount: currentAmount,
        monthlyReturn,
      })
    }

    return data
  }, [initialCapital, monthlyContribution, annualRate, months])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{`Mês ${label}`}</p>
          <div className="space-y-1">
            <p className="text-blue-600 dark:text-blue-400">
              <span className="font-medium">Total Investido:</span> {formatCurrency(payload[0].value)}
            </p>
            <p className="text-green-600 dark:text-green-400">
              <span className="font-medium">Montante Total:</span> {formatCurrency(payload[1].value)}
            </p>
            <p className="text-purple-600 dark:text-purple-400">
              <span className="font-medium">Rendimento:</span> {formatCurrency(payload[1].value - payload[0].value)}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          📊 Evolução do Investimento
        </CardTitle>
        <CardDescription>
          Acompanhe o crescimento do seu patrimônio ao longo do tempo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="totalInvested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="totalAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}m`}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Area
                type="monotone"
                dataKey="totalInvested"
                stackId="1"
                stroke="#3B82F6"
                fill="url(#totalInvested)"
                strokeWidth={2}
                name="Total Investido"
              />
              <Area
                type="monotone"
                dataKey="totalAmount"
                stackId="2"
                stroke="#10B981"
                fill="url(#totalAmount)"
                strokeWidth={2}
                name="Montante Total"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Total Investido</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Montante Total</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Área = Rendimento</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}