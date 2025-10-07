'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Calendar,
  Clock,
  AlertCircle,
  Filter,
  Search,
  Target
} from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'baixa' | 'media' | 'alta'
  dueDate: string
  category: string
  createdAt: string
  completedAt?: string
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'media' as const,
    dueDate: '',
    category: 'pessoal'
  })

  // Carregar tarefas do localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Salvar tarefas no localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const priorities = [
    { value: 'baixa', label: 'Baixa', color: 'bg-green-100 text-green-800' },
    { value: 'media', label: 'Média', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'alta', label: 'Alta', color: 'bg-red-100 text-red-800' }
  ]

  const categories = [
    { value: 'pessoal', label: 'Pessoal', color: 'bg-blue-100 text-blue-800' },
    { value: 'trabalho', label: 'Trabalho', color: 'bg-green-100 text-green-800' },
    { value: 'financeiro', label: 'Financeiro', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'estudos', label: 'Estudos', color: 'bg-purple-100 text-purple-800' },
    { value: 'saude', label: 'Saúde', color: 'bg-pink-100 text-pink-800' }
  ]

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      category: newTask.category,
      createdAt: new Date().toISOString()
    }

    setTasks(prev => [task, ...prev])
    setNewTask({
      title: '',
      description: '',
      priority: 'media',
      dueDate: '',
      category: 'pessoal'
    })
  }

  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : undefined
          }
        : task
    ))
  }

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      setTasks(prev => prev.filter(task => task.id !== taskId))
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'pending' && !task.completed) ||
      (filter === 'completed' && task.completed)
    
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const getPriorityStyle = (priority: string) => {
    const p = priorities.find(p => p.value === priority)
    return p?.color || 'bg-gray-100 text-gray-800'
  }

  const getCategoryStyle = (category: string) => {
    const cat = categories.find(c => c.value === category)
    return cat?.color || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
  }

  const isDueToday = (dueDate: string) => {
    if (!dueDate) return false
    return new Date(dueDate).toDateString() === new Date().toDateString()
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => !t.completed && isOverdue(t.dueDate)).length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciador de Tarefas</h2>
          <p className="text-muted-foreground">Organize e acompanhe suas tarefas</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Concluídas</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Square className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Atrasadas</p>
                <p className="text-2xl font-bold">{stats.overdue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Criar Nova Tarefa */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nova Tarefa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="task-title">Título</Label>
                <Input
                  id="task-title"
                  placeholder="Título da tarefa..."
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="task-description">Descrição</Label>
                <textarea
                  id="task-description"
                  placeholder="Descrição da tarefa..."
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded-md h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="task-priority">Prioridade</Label>
                  <select
                    id="task-priority"
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full p-2 border rounded-md"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="task-category">Categoria</Label>
                  <select
                    id="task-category"
                    value={newTask.category}
                    onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="task-due-date">Data de Vencimento</Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>

              <Button onClick={handleCreateTask} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Criar Tarefa
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Tarefas */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filtros */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todas
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Pendentes
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Concluídas
            </Button>
          </div>

          {/* Lista de Tarefas */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTasks.map(task => (
              <Card 
                key={task.id} 
                className={`transition-all ${
                  task.completed ? 'opacity-75' : ''
                } ${
                  isOverdue(task.dueDate) && !task.completed ? 'border-red-200 bg-red-50' : ''
                } ${
                  isDueToday(task.dueDate) && !task.completed ? 'border-yellow-200 bg-yellow-50' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleTask(task.id)}
                      className="mt-1"
                    >
                      {task.completed ? (
                        <CheckSquare className="h-5 w-5 text-green-600" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </Button>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {task.description && (
                        <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getPriorityStyle(task.priority)}>
                          {priorities.find(p => p.value === task.priority)?.label}
                        </Badge>
                        
                        <Badge className={getCategoryStyle(task.category)}>
                          {categories.find(c => c.value === task.category)?.label}
                        </Badge>

                        {task.dueDate && (
                          <Badge 
                            variant="outline" 
                            className={`flex items-center gap-1 ${
                              isOverdue(task.dueDate) && !task.completed ? 'border-red-500 text-red-700' : ''
                            } ${
                              isDueToday(task.dueDate) && !task.completed ? 'border-yellow-500 text-yellow-700' : ''
                            }`}
                          >
                            <Calendar className="h-3 w-3" />
                            {formatDate(task.dueDate)}
                            {isOverdue(task.dueDate) && !task.completed && (
                              <AlertCircle className="h-3 w-3 text-red-500" />
                            )}
                          </Badge>
                        )}
                      </div>

                      {task.completed && task.completedAt && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <CheckSquare className="h-3 w-3" />
                          Concluída em {formatDate(task.completedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredTasks.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma tarefa encontrada</h3>
                  <p className="text-muted-foreground">
                    {filter === 'all' 
                      ? 'Crie sua primeira tarefa para começar!'
                      : `Não há tarefas ${filter === 'pending' ? 'pendentes' : 'concluídas'}.`
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}