'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, X, Edit, Trash2, Save } from 'lucide-react'
import { storageService, SavedTemplate } from '../lib/storage'
import { Exercise } from '../data/exercises'

interface TemplateManagerProps {
  isOpen: boolean
  onClose: () => void
  onLoadTemplate: (template: SavedTemplate) => void
  currentExercises: Array<{
    exercise: Exercise
    variation?: string
    sets?: number
    reps?: number
    weight?: number
    time?: number
    distance?: number
    notes?: string
  }>
}

export default function TemplateManager({ 
  isOpen, 
  onClose, 
  onLoadTemplate, 
  currentExercises 
}: TemplateManagerProps) {
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState('')
  const [newTemplateDescription, setNewTemplateDescription] = useState('')
  const [editingTemplate, setEditingTemplate] = useState<SavedTemplate | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadTemplates()
    }
  }, [isOpen])

  const loadTemplates = () => {
    const templates = storageService.getTemplates()
    setSavedTemplates(templates)
  }

  const filteredTemplates = savedTemplates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSaveTemplate = async () => {
    if (!newTemplateName.trim()) return

    try {
      const template: SavedTemplate = {
        id: editingTemplate?.id || storageService.generateId(),
        name: newTemplateName,
        description: newTemplateDescription,
        exercises: currentExercises.map(ex => ({
          exerciseId: ex.exercise.id,
          exerciseName: ex.exercise.name,
          variation: ex.variation,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          time: ex.time,
          distance: ex.distance,
          notes: ex.notes || ''
        })),
        createdAt: editingTemplate?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await storageService.saveTemplate(template)
      loadTemplates()
      setShowSaveModal(false)
      setNewTemplateName('')
      setNewTemplateDescription('')
      setEditingTemplate(null)
    } catch (error) {
      console.error('Failed to save template:', error)
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        await storageService.deleteTemplate(templateId)
        loadTemplates()
      } catch (error) {
        console.error('Failed to delete template:', error)
      }
    }
  }

  const handleEditTemplate = (template: SavedTemplate) => {
    setEditingTemplate(template)
    setNewTemplateName(template.name)
    setNewTemplateDescription(template.description)
    setShowSaveModal(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Workout Templates</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSaveModal(true)}
                disabled={currentExercises.length === 0}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1 rounded-lg text-sm flex items-center"
              >
                <Save className="h-4 w-4 mr-1" />
                Save Current
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          {/* Search */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <p className="text-lg font-medium mb-2">No templates found</p>
              <p className="text-sm">
                {searchQuery ? 'Try a different search term' : 'Save your first workout template to get started'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className="p-1 text-gray-400 hover:text-blue-600 rounded"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">{template.exercises.length} exercises</p>
                    <div className="space-y-1">
                      {template.exercises.slice(0, 3).map((ex, index) => (
                        <div key={index} className="text-xs text-gray-600">
                          • {ex.exerciseName} {ex.variation && `(${ex.variation})`}
                        </div>
                      ))}
                      {template.exercises.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{template.exercises.length - 3} more exercises
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(template.updatedAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => onLoadTemplate(template)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Load Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Template Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingTemplate ? 'Edit Template' : 'Save Template'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder="e.g., Upper Body Strength"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={newTemplateDescription}
                    onChange={(e) => setNewTemplateDescription(e.target.value)}
                    placeholder="Brief description of this workout..."
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    This template will include {currentExercises.length} exercises:
                  </p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {currentExercises.map((ex, index) => (
                      <div key={index} className="text-xs text-gray-600">
                        • {ex.exercise.name} {ex.variation && `(${ex.variation})`}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowSaveModal(false)
                    setNewTemplateName('')
                    setNewTemplateDescription('')
                    setEditingTemplate(null)
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTemplate}
                  disabled={!newTemplateName.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg"
                >
                  {editingTemplate ? 'Update' : 'Save'} Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
