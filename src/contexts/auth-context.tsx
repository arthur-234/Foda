'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface UserData {
  calculations: any[]
  preferences: any
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (name: string, password: string) => boolean
  register: (name: string, email: string, password: string) => boolean
  logout: () => void
  saveUserData: (data: UserData) => void
  getUserData: () => UserData
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Criar usuário admin padrão se não existir
    const users = JSON.parse(localStorage.getItem('users') || '{}')
    if (!users['admin']) {
      users['admin'] = {
        name: 'admin',
        email: 'admin@admin.com',
        password: 'admin',
        createdAt: new Date().toISOString()
      }
      localStorage.setItem('users', JSON.stringify(users))
    }

    // Verificar se há usuário logado
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = (name: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '{}')
    const userData = users[name]
    
    if (userData && userData.password === password) {
      const user = {
        id: name,
        name: userData.name,
        email: userData.email,
      }
      
      setUser(user)
      setIsAuthenticated(true)
      localStorage.setItem('currentUser', JSON.stringify(user))
      return true
    }
    
    return false
  }

  const register = (name: string, email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '{}')
    
    // Verificar se usuário já existe
    if (users[name]) {
      return false
    }
    
    // Verificar se email já existe
    const existingUser = Object.values(users).find((u: any) => u.email === email)
    if (existingUser) {
      return false
    }
    
    // Criar novo usuário
    users[name] = {
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    }
    
    localStorage.setItem('users', JSON.stringify(users))
    
    // Fazer login automaticamente
    const user = {
      id: name,
      name,
      email,
    }
    
    setUser(user)
    setIsAuthenticated(true)
    localStorage.setItem('currentUser', JSON.stringify(user))
    
    return true
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('currentUser')
  }

  const saveUserData = (data: UserData) => {
    if (user) {
      localStorage.setItem(`userData_${user.id}`, JSON.stringify(data))
    }
  }

  const getUserData = (): UserData => {
    if (user) {
      const data = localStorage.getItem(`userData_${user.id}`)
      if (data) {
        return JSON.parse(data)
      }
    }
    
    return {
      calculations: [],
      preferences: {}
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout,
      saveUserData,
      getUserData,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}