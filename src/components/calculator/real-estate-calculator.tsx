'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Home, Calculator, TrendingUp, DollarSign } from 'lucide-react'

export function RealEstateCalculator() {
  const [propertyValue, setPropertyValue] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [results, setResults] = useState<{
    loanAmount: number
    monthlyPayment: number
    totalPayment: number
    totalInterest: number
    downPaymentPercentage: number
  } | null>(null)

  const calculateFinancing = () => {
    const property = parseFloat(propertyValue)
    const down = parseFloat(downPayment)
    const monthlyRate = parseFloat(interestRate) / 100 / 12
    const numberOfPayments = parseInt(loanTerm) * 12

    if (property <= 0 || down < 0 || monthlyRate <= 0 || numberOfPayments <= 0) {
      alert('Por favor, insira valores válidos')
      return
    }

    if (down >= property) {
      alert('A entrada não pode ser maior ou igual ao valor do imóvel')
      return
    }

    const loanAmount = property - down
    const downPaymentPercentage = (down / property) * 100

    // Fórmula PMT para calcular pagamento mensal
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    
    const totalPayment = monthlyPayment * numberOfPayments
    const totalInterest = totalPayment - loanAmount

    setResults({
      loanAmount,
      monthlyPayment,
      totalPayment,
      totalInterest,
      downPaymentPercentage
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
          <Home className="h-8 w-8 mr-3" />
          Calculadora de Financiamento Imobiliário
        </h1>
        <p className="text-muted-foreground">
          Simule o financiamento do seu imóvel e planeje sua compra
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados do Financiamento</CardTitle>
            <CardDescription>
              Insira as informações do imóvel e financiamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="propertyValue">Valor do Imóvel (R$)</Label>
              <Input
                id="propertyValue"
                type="number"
                placeholder="Ex: 500000"
                value={propertyValue}
                onChange={(e) => setPropertyValue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="downPayment">Valor da Entrada (R$)</Label>
              <Input
                id="downPayment"
                type="number"
                placeholder="Ex: 100000"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Taxa de Juros Anual (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                placeholder="Ex: 8.5"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loanTerm">Prazo (anos)</Label>
              <Input
                id="loanTerm"
                type="number"
                placeholder="Ex: 30"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
              />
            </div>

            <Button onClick={calculateFinancing} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calcular Financiamento
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
            <CardDescription>
              Resumo do seu financiamento imobiliário
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Valor Financiado
                      </span>
                      <Home className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {formatCurrency(results.loanAmount)}
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        Parcela Mensal
                      </span>
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {formatCurrency(results.monthlyPayment)}
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        Total a Pagar
                      </span>
                      <Calculator className="h-4 w-4 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {formatCurrency(results.totalPayment)}
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                        Total de Juros
                      </span>
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {formatCurrency(results.totalInterest)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold">Resumo do Financiamento:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Valor do imóvel: {formatCurrency(parseFloat(propertyValue))}</li>
                    <li>• Entrada: {formatCurrency(parseFloat(downPayment))} ({results.downPaymentPercentage.toFixed(1)}%)</li>
                    <li>• Taxa de juros: {interestRate}% ao ano</li>
                    <li>• Prazo: {loanTerm} anos ({parseInt(loanTerm) * 12} parcelas)</li>
                    <li>• Custo total do financiamento: {((results.totalInterest / results.loanAmount) * 100).toFixed(2)}%</li>
                  </ul>
                </div>

                <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Dica:</strong> Uma entrada maior reduz o valor das parcelas e o total de juros pagos.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
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