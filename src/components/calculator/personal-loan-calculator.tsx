'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { DollarSign, Calculator, TrendingDown } from 'lucide-react'

export function PersonalLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [results, setResults] = useState<{
    monthlyPayment: number
    totalPayment: number
    totalInterest: number
  } | null>(null)

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount)
    const monthlyRate = parseFloat(interestRate) / 100 / 12
    const numberOfPayments = parseInt(loanTerm)

    if (principal <= 0 || monthlyRate <= 0 || numberOfPayments <= 0) {
      alert('Por favor, insira valores válidos')
      return
    }

    // Fórmula PMT para calcular pagamento mensal
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    
    const totalPayment = monthlyPayment * numberOfPayments
    const totalInterest = totalPayment - principal

    setResults({
      monthlyPayment,
      totalPayment,
      totalInterest
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <DollarSign className="h-8 w-8 mr-3" />
          Calculadora de Empréstimo Pessoal
        </h1>
        <p className="text-muted-foreground">
          Calcule as parcelas e o custo total do seu empréstimo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados do Empréstimo</CardTitle>
            <CardDescription>
              Insira as informações do empréstimo que deseja simular
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loanAmount">Valor do Empréstimo (R$)</Label>
              <Input
                id="loanAmount"
                type="number"
                placeholder="Ex: 50000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Taxa de Juros Anual (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                placeholder="Ex: 12.5"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loanTerm">Prazo (meses)</Label>
              <Input
                id="loanTerm"
                type="number"
                placeholder="Ex: 24"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
              />
            </div>

            <Button onClick={calculateLoan} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calcular Empréstimo
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
            <CardDescription>
              Resumo do seu empréstimo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Parcela Mensal
                      </span>
                      <DollarSign className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {formatCurrency(results.monthlyPayment)}
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        Total a Pagar
                      </span>
                      <Calculator className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {formatCurrency(results.totalPayment)}
                    </p>
                  </div>

                  <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-red-700 dark:text-red-300">
                        Total de Juros
                      </span>
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    </div>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                      {formatCurrency(results.totalInterest)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold">Resumo:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Valor emprestado: {formatCurrency(parseFloat(loanAmount))}</li>
                    <li>• Taxa de juros: {interestRate}% ao ano</li>
                    <li>• Prazo: {loanTerm} meses</li>
                    <li>• Custo efetivo total: {((results.totalInterest / parseFloat(loanAmount)) * 100).toFixed(2)}%</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Preencha os dados para ver os resultados
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}