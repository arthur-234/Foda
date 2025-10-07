'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import { Eye, EyeOff, Calculator, UserPlus, LogIn } from 'lucide-react'

export function LoginForm() {
  const { login, register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  
  // Estados para os campos do formulário
  const [loginData, setLoginData] = useState({
    name: '',
    password: ''
  })
  
  const [registerData, setRegisterData] = useState({
    name: '',
    password: '',
    confirmPassword: ''
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!loginData.name || !loginData.password) {
      setError('Todos os campos são obrigatórios')
      return
    }
    
    const success = login(loginData.name, loginData.password)
    if (!success) {
      setError('Nome de usuário ou senha incorretos')
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!registerData.name || !registerData.password || !registerData.confirmPassword) {
      setError('Todos os campos são obrigatórios')
      return
    }
    
    if (registerData.name.length < 3) {
      setError('Nome deve ter pelo menos 3 caracteres')
      return
    }
    
    if (registerData.password.length < 4) {
      setError('Senha deve ter pelo menos 4 caracteres')
      return
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      setError('Senhas não coincidem')
      return
    }
    
    const success = register(registerData.name, `${registerData.name}@local.com`, registerData.password)
    if (!success) {
      setError('Usuário já existe')
    }
  }

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode)
    setError('')
    setLoginData({ name: '', password: '' })
    setRegisterData({ name: '', password: '', confirmPassword: '' })
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
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="login-name" className="text-sm font-medium">
                  Nome de Usuário
                </label>
                <Input
                  id="login-name"
                  type="text"
                  placeholder="Digite seu nome de usuário"
                  value={loginData.name}
                  onChange={(e) => setLoginData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="login-password" className="text-sm font-medium">
                  Senha
                </label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pr-10"
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
              </div>

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
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="register-name" className="text-sm font-medium">
                  Nome de Usuário
                </label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Digite seu nome de usuário"
                  value={registerData.name}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="register-password" className="text-sm font-medium">
                  Senha
                </label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pr-10"
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
              </div>

              <div className="space-y-2">
                <label htmlFor="register-confirm" className="text-sm font-medium">
                  Confirmar Senha
                </label>
                <Input
                  id="register-confirm"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirme sua senha"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full"
                />
              </div>

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
          )}

          <div className="mt-6 text-center">
            <Button
              type="button"
              variant="link"
              onClick={toggleMode}
              className="text-sm"
            >
              {isRegisterMode 
                ? 'Já tem uma conta? Faça login'
                : 'Não tem uma conta? Registre-se'
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}