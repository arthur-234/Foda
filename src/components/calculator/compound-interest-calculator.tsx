'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const compoundSchema = z.object({
  principal: z.number().min(1, 'Capital inicial deve ser maior que 0'),
  rate: z.number().min(0.1, 'Taxa deve ser maior que 0'),
  time: z.number().min(1, 'Tempo deve ser maior que 0'),
  compound: z.number().min(1, 'Frequência deve ser maior que 0'),
})

type CompoundFormData = z.infer<typeof compoundSchema>

interface CompoundResult {
  finalAmount: number
  totalInterest: number
  effectiveRate: number
}

export function CompoundInterestCalculator() {
  const [result, setResult] = useState<CompoundResult | null>(null)

  const form = useForm<CompoundFormData>({
    resolver: zodResolver(compoundSchema),
    defaultValues: {
      principal: 10000,
      rate: 10,
      time: 5,
      compound: 12,
    },
  })

  const principal = form.watch('principal')
  const rate = form.watch('rate')
  const time = form.watch('time')
  const compound = form.watch('compound')

  useEffect(() => {
    if (principal && rate && time && compound) {
      calculateCompound({
        principal,
        rate,
        time,
        compound
      })
    }
  }, [principal, rate, time, compound])

  const calculateCompound = (data: CompoundFormData) => {
    const r = data.rate / 100
    const finalAmount = data.principal * Math.pow(1 + r / data.compound, data.compound * data.time)
    const totalInterest = finalAmount - data.principal
    const effectiveRate = (Math.pow(finalAmount / data.principal, 1 / data.time) - 1) * 100

    setResult({
      finalAmount,
      totalInterest,
      effectiveRate,
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
        <h1 className="text-3xl font-bold">Calculadora de Juros Compostos</h1>
        <p className="text-muted-foreground">
          Calcule o crescimento do seu dinheiro com juros compostos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Parâmetros</CardTitle>
            <CardDescription>
              Configure os valores para o cálculo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-4">
                <FormField
                  control={form.control}
                  name="principal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capital Inicial (R$)</FormLabel>
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
                  name="rate"
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
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período (anos)</FormLabel>
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
                  name="compound"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capitalização (vezes por ano)</FormLabel>
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
                Projeção do seu investimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Valor Final</p>
                  <p className="text-2xl font-bold font-mono text-green-600">
                    {formatCurrency(result.finalAmount)}
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Juros Ganhos</p>
                  <p className="text-xl font-semibold font-mono text-blue-600">
                    {formatCurrency(result.totalInterest)}
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Taxa Efetiva Anual</p>
                  <p className="text-xl font-semibold font-mono">
                    {result.effectiveRate.toFixed(2)}%
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