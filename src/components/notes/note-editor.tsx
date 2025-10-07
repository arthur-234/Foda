'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Save,
  Search,
  Tag,
  Calendar,
  Clock
} from 'lucide-react'

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
  category: string
}

export function NoteEditor() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: '',
    category: 'pessoal'
  })

  // Carregar notas do localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  // Salvar notas no localStorage
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const categories = [
    { value: 'pessoal', label: 'Pessoal', color: 'bg-blue-100 text-blue-800' },
    { value: 'trabalho', label: 'Trabalho', color: 'bg-green-100 text-green-800' },
    { value: 'financeiro', label: 'Financeiro', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'ideias', label: 'Ideias', color: 'bg-purple-100 text-purple-800' },
    { value: 'estudos', label: 'Estudos', color: 'bg-red-100 text-red-800' }
  ]

  const handleCreateNote = () => {
    if (!newNote.title.trim()) return

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: newNote.category
    }

    setNotes(prev => [note, ...prev])
    setNewNote({ title: '', content: '', tags: '', category: 'pessoal' })
    setSelectedNote(note)
  }

  const handleUpdateNote = () => {
    if (!selectedNote) return

    setNotes(prev => prev.map(note => 
      note.id === selectedNote.id 
        ? { ...selectedNote, updatedAt: new Date().toISOString() }
        : note
    ))
    setIsEditing(false)
  }

  const handleDeleteNote = (noteId: string) => {
    if (confirm('Tem certeza que deseja excluir esta nota?')) {
      setNotes(prev => prev.filter(note => note.id !== noteId))
      if (selectedNote?.id === noteId) {
        setSelectedNote(null)
      }
    }
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getCategoryStyle = (category: string) => {
    const cat = categories.find(c => c.value === category)
    return cat?.color || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Minhas Notas</h2>
          <p className="text-muted-foreground">Organize suas ideias e pensamentos</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar notas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Notas */}
        <div className="lg:col-span-1 space-y-4">
          {/* Criar Nova Nota */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nova Nota
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Título da nota..."
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="category">Categoria</Label>
                <select
                  id="category"
                  value={newNote.category}
                  onChange={(e) => setNewNote(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  placeholder="tag1, tag2, tag3..."
                  value={newNote.tags}
                  onChange={(e) => setNewNote(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="content">Conteúdo</Label>
                <textarea
                  id="content"
                  placeholder="Escreva sua nota aqui..."
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full p-2 border rounded-md h-24 resize-none"
                />
              </div>

              <Button onClick={handleCreateNote} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Criar Nota
              </Button>
            </CardContent>
          </Card>

          {/* Lista de Notas Existentes */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredNotes.map(note => (
              <Card 
                key={note.id} 
                className={`cursor-pointer transition-colors ${
                  selectedNote?.id === note.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedNote(note)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium truncate">{note.title}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteNote(note.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getCategoryStyle(note.category)}>
                      {categories.find(c => c.value === note.category)?.label}
                    </Badge>
                  </div>

                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {note.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {note.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{note.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground truncate">
                    {note.content || 'Sem conteúdo'}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(note.updatedAt)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Visualizador/Editor de Nota */}
        <div className="lg:col-span-2">
          {selectedNote ? (
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {isEditing ? (
                      <Input
                        value={selectedNote.title}
                        onChange={(e) => setSelectedNote(prev => 
                          prev ? { ...prev, title: e.target.value } : null
                        )}
                        className="text-lg font-semibold"
                      />
                    ) : (
                      <CardTitle>{selectedNote.title}</CardTitle>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <Button onClick={handleUpdateNote}>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Criado: {formatDate(selectedNote.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Atualizado: {formatDate(selectedNote.updatedAt)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryStyle(selectedNote.category)}>
                    {categories.find(c => c.value === selectedNote.category)?.label}
                  </Badge>
                </div>

                {selectedNote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedNote.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Separator />

                {isEditing ? (
                  <textarea
                    value={selectedNote.content}
                    onChange={(e) => setSelectedNote(prev => 
                      prev ? { ...prev, content: e.target.value } : null
                    )}
                    className="w-full p-4 border rounded-md h-64 resize-none"
                    placeholder="Escreva o conteúdo da sua nota aqui..."
                  />
                ) : (
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">
                      {selectedNote.content || 'Esta nota não possui conteúdo.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Selecione uma nota</h3>
                <p className="text-muted-foreground">
                  Escolha uma nota da lista ao lado para visualizar ou editar
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}