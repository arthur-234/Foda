'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const loanSchema = z.object({
  loanAmount: z.number().min(1000, 'Valor do empréstimo deve ser maior que R$ 1.000'),
  interestRate: z.number().min(0.1, 'Taxa deve ser maior que 0'),
  loanTerm: z.number().min(1, 'Prazo deve ser maior que 0'),
})

type LoanFormData = z.infer<typeof loanSchema>

interface LoanResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  monthlyRate: number
}

export function LoanCalculator() {
  const [result, setResult] = useState<LoanResult | null>(null)

  const form = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      loanAmount: 200000,
      interestRate: 8.5,
      loanTerm: 240,
    },
  })

  const loanAmount = form.watch('loanAmount')
  const interestRate = form.watch('interestRate')
  const loanTerm = form.watch('loanTerm')

  useEffect(() => {
    if (loanAmount && interestRate && loanTerm) {
      calculateLoan({
        loanAmount,
        interestRate,
        loanTerm
      })
    }
  }, [loanAmount, interestRate, loanTerm])

  const calculateLoan = (data: LoanFormData) => {
    const monthlyRate = data.interestRate / 100 / 12
    const monthlyPayment = (data.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, data.loanTerm)) /
      (Math.pow(1 + monthlyRate, data.loanTerm) - 1)
    
    const totalPayment = monthlyPayment * data.loanTerm
    const totalInterest = totalPayment - data.loanAmount

    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest,
      monthlyRate: monthlyRate * 100,
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
        <h1 className="text-3xl font-bold">Calculadora de Financiamentos</h1>
        <p className="text-muted-foreground">
          Calcule as parcelas e custos do seu financiamento
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados do Financiamento</CardTitle>
            <CardDescription>
              Informe os dados do seu financiamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-4">
                <FormField
                  control={form.control}
                  name="loanAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor do Financiamento (R$)</FormLabel>
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
                  name="interestRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taxa de Juros Anual (%)</FormLabel>
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

                <FormField
                  control={form.control}
                  name="loanTerm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prazo (meses)</FormLabel>
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
              </form>
            </Form>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Resultados</CardTitle>
              <CardDescription>
                Detalhes do seu financiamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Parcela Mensal</p>
                  <p className="text-2xl font-bold font-mono text-red-600">
                    {formatCurrency(result.monthlyPayment)}
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total a Pagar</p>
                  <p className="text-xl font-semibold font-mono">
                    {formatCurrency(result.totalPayment)}
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total de Juros</p>
                  <p className="text-xl font-semibold font-mono text-orange-600">
                    {formatCurrency(result.totalInterest)}
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Taxa Mensal</p>
                  <p className="text-xl font-semibold font-mono">
                    {result.monthlyRate.toFixed(3)}%
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