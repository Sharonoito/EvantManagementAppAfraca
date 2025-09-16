"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, X } from "lucide-react"

interface ImportResult {
  success: boolean
  message: string
  imported: number
  skipped: number
  errors: string[]
  preview?: any[]
}

export function ImportForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [preview, setPreview] = useState<any[] | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
      setPreview(null)
    }
  }

  const handlePreview = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(25)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("preview", "true")

    try {
      setUploadProgress(50)
      const response = await fetch("/api/admin/users/import", {
        method: "POST",
        body: formData,
      })

      setUploadProgress(75)
      const data = await response.json()

      if (data.success) {
        setPreview(data.preview)
      } else {
        setResult({
          success: false,
          message: data.message,
          imported: 0,
          skipped: 0,
          errors: data.errors || [],
        })
      }
      setUploadProgress(100)
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to preview file",
        imported: 0,
        skipped: 0,
        errors: ["Network error occurred"],
      })
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(25)

    const formData = new FormData()
    formData.append("file", file)

    try {
      setUploadProgress(50)
      const response = await fetch("/api/admin/users/import", {
        method: "POST",
        body: formData,
      })

      setUploadProgress(75)
      const data = await response.json()
      setResult(data)
      setUploadProgress(100)

      if (data.success) {
        setFile(null)
        setPreview(null)
        // Reset file input
        const fileInput = document.getElementById("file-upload") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to import users",
        imported: 0,
        skipped: 0,
        errors: ["Network error occurred"],
      })
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor="file-upload">Select File</Label>
        <div className="flex items-center gap-4">
          <Input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            disabled={isUploading}
            className="flex-1"
          />
          {file && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileSpreadsheet className="h-4 w-4" />
              {file.name}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Processing...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handlePreview} disabled={!file || isUploading} variant="outline">
          Preview Data
        </Button>
        <Button onClick={handleImport} disabled={!file || isUploading}>
          <Upload className="h-4 w-4 mr-2" />
          Import Users
        </Button>
      </div>

      {/* Preview Table */}
      {preview && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Data Preview</h3>
            <Badge variant="outline">{preview.length} rows found</Badge>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preview.slice(0, 10).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.name || "-"}</TableCell>
                    <TableCell>{row.email || "-"}</TableCell>
                    <TableCell>{row.role || "attendee"}</TableCell>
                    <TableCell>{row.organization || "-"}</TableCell>
                    <TableCell>
                      {row.name && row.email ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Valid
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          <X className="h-3 w-3 mr-1" />
                          Invalid
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {preview.length > 10 && (
            <p className="text-sm text-muted-foreground text-center">
              Showing first 10 rows of {preview.length} total rows
            </p>
          )}
        </div>
      )}

      {/* Import Result */}
      {result && (
        <Alert
          className={
            result.success
              ? "border-green-200 bg-green-50 dark:bg-green-950"
              : "border-red-200 bg-red-50 dark:bg-red-950"
          }
        >
          {result.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">{result.message}</p>
              {result.success && (
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600">✓ {result.imported} imported</span>
                  {result.skipped > 0 && <span className="text-yellow-600">⚠ {result.skipped} skipped</span>}
                </div>
              )}
              {result.errors.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Errors:</p>
                  <ul className="text-sm space-y-1">
                    {result.errors.map((error, index) => (
                      <li key={index} className="text-red-600">
                        • {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
