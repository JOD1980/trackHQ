'use client'

import { useState } from 'react'
import { Download, Upload, FileText, Calendar, Database, X } from 'lucide-react'
import { storageService } from '../lib/storage'
import { authService } from '../lib/auth'

interface DataExportProps {
  isOpen: boolean
  onClose: () => void
}

export default function DataExport({ isOpen, onClose }: DataExportProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleExportData = async () => {
    setIsExporting(true)
    setMessage(null)

    try {
      const authState = authService.getAuthState()
      const data = storageService.exportAllData()
      
      // Add metadata
      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        user: authState.user ? {
          name: authState.user.name,
          email: authState.user.email
        } : null,
        data
      }

      // Create downloadable file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      })
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      const fileName = `trackhq-backup-${new Date().toISOString().split('T')[0]}.json`
      link.download = fileName
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setMessage({ 
        type: 'success', 
        text: `Data exported successfully! Downloaded as ${fileName}` 
      })
    } catch (error) {
      console.error('Export failed:', error)
      setMessage({ 
        type: 'error', 
        text: 'Failed to export data. Please try again.' 
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/json') {
      setImportFile(file)
      setMessage(null)
    } else {
      setMessage({ 
        type: 'error', 
        text: 'Please select a valid JSON backup file.' 
      })
    }
  }

  const handleImportData = async () => {
    if (!importFile) return

    setIsImporting(true)
    setMessage(null)

    try {
      const fileContent = await importFile.text()
      const importData = JSON.parse(fileContent)

      // Validate file structure
      if (!importData.data || !importData.version) {
        throw new Error('Invalid backup file format')
      }

      // Confirm import
      const workoutCount = importData.data.workouts?.length || 0
      const templateCount = importData.data.templates?.length || 0
      
      const confirmMessage = `This will import ${workoutCount} workouts and ${templateCount} templates. This will merge with your existing data. Continue?`
      
      if (!confirm(confirmMessage)) {
        setIsImporting(false)
        return
      }

      // Import data
      await storageService.importAllData(importData.data)

      setMessage({ 
        type: 'success', 
        text: `Successfully imported ${workoutCount} workouts and ${templateCount} templates!` 
      })
      
      setImportFile(null)
      
      // Reset file input
      const fileInput = document.getElementById('import-file') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      
    } catch (error) {
      console.error('Import failed:', error)
      setMessage({ 
        type: 'error', 
        text: 'Failed to import data. Please check the file format.' 
      })
    } finally {
      setIsImporting(false)
    }
  }

  const getDataStats = () => {
    const data = storageService.exportAllData()
    return {
      workouts: data.workouts.length,
      templates: data.templates.length,
      totalSize: new Blob([JSON.stringify(data)]).size
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!isOpen) return null

  const stats = getDataStats()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Data Backup & Export</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          {/* Data Statistics */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Your Data
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Workouts:</span>
                <span className="font-medium">{stats.workouts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Templates:</span>
                <span className="font-medium">{stats.templates}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Size:</span>
                <span className="font-medium">{formatBytes(stats.totalSize)}</span>
              </div>
            </div>
          </div>

          {/* Export Section */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Download all your workouts, templates, and preferences as a backup file.
            </p>
            <button
              onClick={handleExportData}
              disabled={isExporting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-3 rounded-lg flex items-center justify-center"
            >
              {isExporting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </div>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Export All Data
                </>
              )}
            </button>
          </div>

          {/* Import Section */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Restore data from a previously exported backup file.
            </p>
            
            <div className="space-y-3">
              <input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {importFile && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    <strong>Selected:</strong> {importFile.name} ({formatBytes(importFile.size)})
                  </p>
                </div>
              )}
              
              <button
                onClick={handleImportData}
                disabled={!importFile || isImporting}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg flex items-center justify-center"
              >
                {isImporting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Importing...
                  </div>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Warning */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-700">
              <strong>⚠️ Important:</strong> Keep your backup files safe! Import will merge with existing data, not replace it.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
