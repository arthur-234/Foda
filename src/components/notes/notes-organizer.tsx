'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { NoteEditor } from './note-editor'
import { TaskManager } from './task-manager'
import { 
  FileText, 
  CheckSquare, 
  BarChart3,
  Calendar,
  Target,
  Clock
} from 'lucide-react'

type ActiveTab = 'overview' | 'notes' | 'tasks'

export function NotesOrganizer() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview')

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Organizador Pessoal</h2>
        <p className="text-muted-foreground">Gerencie suas notas, tarefas e mantenha-se organizado</p>
      </div>

      {/* Cards de Navegação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setActiveTab('notes')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              Minhas Notas
            </CardTitle>
            <CardDescription>
              Organize suas ideias, pensamentos e informações importantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Funcionalidades:</p>
                <ul className="text-sm space-y-1">
                  <li>• Criar e editar notas</li>
                  <li>• Categorizar por assunto</li>
                  <li>• Sistema de tags</li>
                  <li>• Busca avançada</li>
                </ul>
              </div>
              <Button>
                Acessar Notas
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setActiveTab('tasks')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-6 w-6 text-green-600" />
              Gerenciador de Tarefas
            </CardTitle>
            <CardDescription>
              Organize suas tarefas e acompanhe seu progresso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Funcionalidades:</p>
                <ul className="text-sm space-y-1">
                  <li>• Criar e gerenciar tarefas</li>
                  <li>• Definir prioridades</li>
                  <li>• Datas de vencimento</li>
                  <li>• Acompanhar progresso</li>
                </ul>
              </div>
              <Button>
                Gerenciar Tarefas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Notas</p>
                <p className="text-2xl font-bold">
                  {typeof window !== 'undefined' 
                    ? JSON.parse(localStorage.getItem('notes') || '[]').length 
                    : 0
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Tarefas</p>
                <p className="text-2xl font-bold">
                  {typeof window !== 'undefined' 
                    ? JSON.parse(localStorage.getItem('tasks') || '[]').length 
                    : 0
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Tarefas Concluídas</p>
                <p className="text-2xl font-bold">
                  {typeof window !== 'undefined' 
                    ? JSON.parse(localStorage.getItem('tasks') || '[]').filter((t: any) => t.completed).length 
                    : 0
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Tarefas Pendentes</p>
                <p className="text-2xl font-bold">
                  {typeof window !== 'undefined' 
                    ? JSON.parse(localStorage.getItem('tasks') || '[]').filter((t: any) => !t.completed).length 
                    : 0
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dicas de Produtividade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Dicas de Produtividade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">📝 Para Notas Eficazes:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use títulos descritivos e claros</li>
                <li>• Organize por categorias temáticas</li>
                <li>• Adicione tags para facilitar a busca</li>
                <li>• Revise e atualize regularmente</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">✅ Para Gestão de Tarefas:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Defina prioridades claras</li>
                <li>• Estabeleça prazos realistas</li>
                <li>• Divida tarefas grandes em menores</li>
                <li>• Celebre as conquistas!</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'notes':
        return <NoteEditor />
      case 'tasks':
        return <TaskManager />
      default:
        return renderOverview()
    }
  }

  return (
    <div className="space-y-6">
      {/* Navegação */}
      {activeTab !== 'overview' && (
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Visão Geral
          </Button>
          <Button
            variant={activeTab === 'notes' ? 'default' : 'outline'}
            onClick={() => setActiveTab('notes')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Notas
          </Button>
          <Button
            variant={activeTab === 'tasks' ? 'default' : 'outline'}
            onClick={() => setActiveTab('tasks')}
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            Tarefas
          </Button>
        </div>
      )}

      {/* Conteúdo */}
      {renderContent()}
    </div>
  )
}