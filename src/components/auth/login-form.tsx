'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import { Eye, EyeOff, Calculator, UserPlus, LogIn } from 'lucide-react'

const loginSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(4, 'Senha deve ter pelo menos 4 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
})

type LoginFormData = z.infer<typeof loginSchema>
type RegisterFormData = z.infer<typeof registerSchema>

export function LoginForm() {
  const { login, register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isRegisterMode, setIsRegisterMode] = useState(false)

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: '',
      password: '',
    },
  })

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onLogin = (data: LoginFormData) => {
    const success = login(data.name, data.password)
    if (!success) {
      setError('Nome de usuário ou senha incorretos')
    }
  }

  const onRegister = (data: RegisterFormData) => {
    const success = register(data.name, data.email, data.password)
    if (!success) {
      setError('Usuário ou email já existe')
    }
  }

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode)
    setError('')
    loginForm.reset()
    registerForm.reset()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Calculator className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">FinanceCalc</CardTitle>
          <CardDescription>
            {isRegisterMode 
              ? 'Crie sua conta para começar a usar as calculadoras'
              : 'Faça login para acessar suas calculadoras financeiras'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isRegisterMode ? (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome de Usuário</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu nome de usuário" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Digite sua senha"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full">
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome de Usuário</FormLabel>
                      <FormControl>
                        <Input placeholder="Escolha um nome de usuário" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Digite seu email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Crie uma senha"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Confirme sua senha"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Conta
                </Button>
              </form>
            </Form>
          )}

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={toggleMode}
              className="text-sm"
            >
              {isRegisterMode 
                ? 'Já tem uma conta? Faça login'
                : 'Não tem uma conta? Registre-se'
              }
            </Button>
          </div>

          {!isRegisterMode && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center mb-2">
                Credenciais de teste:
              </p>
              <div className="text-sm font-mono text-center space-y-1">
                <div>Usuário: <span className="font-semibold">admin</span></div>
                <div>Senha: <span className="font-semibold">admin</span></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}