"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Calculator, TrendingUp, DollarSign, Calendar, Target } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const calculatorSchema = z.object({
  initialCapital: z.number().min(0, 'Capital inicial deve ser positivo'),
  monthlyContribution: z.number().min(0, 'Aporte mensal deve ser positivo'),
  annualRate: z.number().min(0, 'Taxa deve ser positiva').max(100, 'Taxa não pode ser maior que 100%'),
  months: z.number().min(1, 'Período deve ser pelo menos 1 mês').max(600, 'Período máximo de 50 anos'),
})

type CalculatorFormData = z.infer<typeof calculatorSchema>

interface CalculationResult {
  totalInvested: number
  finalAmount: number
  totalReturn: number
  returnPercentage: number
  monthlyRate: number
}

export function InvestmentCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      initialCapital: 10000,
      monthlyContribution: 1000,
      annualRate: 12,
      months: 24,
    },
  })

  const initialCapital = watch('initialCapital')
  const monthlyContribution = watch('monthlyContribution')
  const annualRate = watch('annualRate')
  const months = watch('months')

  useEffect(() => {
    if (initialCapital && monthlyContribution && annualRate && months) {
      calculateInvestment({
        initialCapital,
        monthlyContribution,
        annualRate,
        months
      })
    }
  }, [initialCapital, monthlyContribution, annualRate, months])

  const calculateInvestment = (data: CalculatorFormData) => {
    const monthlyRate = data.annualRate / 100 / 12
    const totalInvested = data.initialCapital + (data.monthlyContribution * data.months)
    
    // Fórmula de juros compostos com aportes mensais
    const finalAmount = data.initialCapital * Math.pow(1 + monthlyRate, data.months) +
      data.monthlyContribution * ((Math.pow(1 + monthlyRate, data.months) - 1) / monthlyRate)
    
    const totalReturn = finalAmount - totalInvested
    const returnPercentage = (totalReturn / totalInvested) * 100

    setResult({
      totalInvested,
      finalAmount,
      totalReturn,
      returnPercentage,
      monthlyRate: monthlyRate * 100,
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
            <Calculator className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">💰 Calculadora de Investimentos</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Planeje seu futuro financeiro com precisão
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de Entrada */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Dados do Investimento
            </CardTitle>
            <CardDescription>
              Preencha os campos abaixo para calcular seu investimento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="initialCapital">💵 Capital Inicial (R$)</Label>
              <Input
                id="initialCapital"
                type="number"
                step="0.01"
                placeholder="10.000,00"
                {...register('initialCapital', { valueAsNumber: true })}
              />
              {errors.initialCapital && (
                <p className="text-sm text-red-500">{errors.initialCapital.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyContribution">📅 Aporte Mensal (R$)</Label>
              <Input
                id="monthlyContribution"
                type="number"
                step="0.01"
                placeholder="1.000,00"
                {...register('monthlyContribution', { valueAsNumber: true })}
              />
              {errors.monthlyContribution && (
                <p className="text-sm text-red-500">{errors.monthlyContribution.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualRate">📈 Taxa Anual (%)</Label>
              <Input
                id="annualRate"
                type="number"
                step="0.01"
                placeholder="12,00"
                {...register('annualRate', { valueAsNumber: true })}
              />
              {errors.annualRate && (
                <p className="text-sm text-red-500">{errors.annualRate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="months">⏰ Período (meses)</Label>
              <Input
                id="months"
                type="number"
                placeholder="24"
                {...register('months', { valueAsNumber: true })}
              />
              {errors.months && (
                <p className="text-sm text-red-500">{errors.months.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Resultados
            </CardTitle>
            <CardDescription>
              Projeção do seu investimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Investido</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono">
                      {formatCurrency(result.totalInvested)}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Montante Final</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400 font-mono">
                      {formatCurrency(result.finalAmount)}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rendimento Total</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono">
                    {formatCurrency(result.totalReturn)}
                  </p>
                  <Badge variant="secondary" className="mt-2 font-mono">
                    {formatPercentage(result.returnPercentage)} de rentabilidade
                  </Badge>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Taxa Mensal</p>
                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400 font-mono">
                    {formatPercentage(result.monthlyRate)}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Target className="h-4 w-4" />
                    <span>
                      Em {months} meses você terá{' '}
                      <strong className="text-green-600 dark:text-green-400 font-mono">
                        {formatCurrency(result.finalAmount)}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Preencha os campos para ver os resultados</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}