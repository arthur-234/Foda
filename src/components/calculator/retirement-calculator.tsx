'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const retirementSchema = z.object({
  currentAge: z.number().min(18, 'Idade deve ser maior que 18').max(80, 'Idade deve ser menor que 80'),
  retirementAge: z.number().min(50, 'Idade de aposentadoria deve ser maior que 50').max(100, 'Idade deve ser menor que 100'),
  monthlyContribution: z.number().min(100, 'Contribuição deve ser maior que R$ 100'),
  expectedReturn: z.number().min(1, 'Retorno deve ser maior que 1%').max(30, 'Retorno deve ser menor que 30%'),
  currentSavings: z.number().min(0, 'Valor atual não pode ser negativo'),
})

type RetirementFormData = z.infer<typeof retirementSchema>

interface RetirementResult {
  yearsToRetirement: number
  totalContributions: number
  finalAmount: number
  monthlyIncome: number
  totalReturn: number
}

export function RetirementCalculator() {
  const [result, setResult] = useState<RetirementResult | null>(null)

  const form = useForm<RetirementFormData>({
    resolver: zodResolver(retirementSchema),
    defaultValues: {
      currentAge: 30,
      retirementAge: 65,
      monthlyContribution: 2000,
      expectedReturn: 8,
      currentSavings: 50000,
    },
  })

  const currentAge = form.watch('currentAge')
  const retirementAge = form.watch('retirementAge')
  const monthlyContribution = form.watch('monthlyContribution')
  const expectedReturn = form.watch('expectedReturn')
  const currentSavings = form.watch('currentSavings')

  useEffect(() => {
    if (currentAge && retirementAge && monthlyContribution && expectedReturn && currentSavings >= 0) {
      if (retirementAge > currentAge) {
        calculateRetirement({
          currentAge,
          retirementAge,
          monthlyContribution,
          expectedReturn,
          currentSavings
        })
      }
    }
  }, [currentAge, retirementAge, monthlyContribution, expectedReturn, currentSavings])

  const calculateRetirement = (data: RetirementFormData) => {
    const yearsToRetirement = data.retirementAge - data.currentAge
    const monthsToRetirement = yearsToRetirement * 12
    const monthlyRate = data.expectedReturn / 100 / 12

    // Valor futuro das economias atuais
    const futureValueCurrentSavings = data.currentSavings * Math.pow(1 + monthlyRate, monthsToRetirement)

    // Valor futuro das contribuições mensais
    const futureValueContributions = data.monthlyContribution * 
      ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate)

    const finalAmount = futureValueCurrentSavings + futureValueContributions
    const totalContributions = data.currentSavings + (data.monthlyContribution * monthsToRetirement)
    const totalReturn = finalAmount - totalContributions

    // Renda mensal assumindo 4% de saque anual (regra dos 4%)
    const monthlyIncome = finalAmount * 0.04 / 12

    setResult({
      yearsToRetirement,
      totalContributions,
      finalAmount,
      monthlyIncome,
      totalReturn,
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Calculadora de Aposentadoria</h1>
        <p className="text-muted-foreground">
          Planeje sua aposentadoria e veja quanto você precisa poupar
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
            <CardDescription>
              Configure seu perfil de aposentadoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Idade Atual</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="retirementAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Idade de Aposentadoria</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentSavings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Atual Poupado (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthlyContribution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contribuição Mensal (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedReturn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Retorno Esperado Anual (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Projeção da Aposentadoria</CardTitle>
              <CardDescription>
                Seus resultados em {result.yearsToRetirement} anos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Patrimônio Final</p>
                  <p className="text-2xl font-bold font-mono text-green-600">
                    {formatCurrency(result.finalAmount)}
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Renda Mensal Estimada</p>
                  <p className="text-xl font-semibold font-mono text-blue-600">
                    {formatCurrency(result.monthlyIncome)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Baseado na regra dos 4%
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Investido</p>
                  <p className="text-xl font-semibold font-mono">
                    {formatCurrency(result.totalContributions)}
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Ganho Total</p>
                  <p className="text-xl font-semibold font-mono text-purple-600">
                    {formatCurrency(result.totalReturn)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}