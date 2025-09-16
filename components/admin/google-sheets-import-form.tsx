"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, FileSpreadsheet, AlertCircle, CheckCircle, Eye, RefreshCw, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface PreviewData {
  name: string
  email: string
  role?: string
  organization?: string
  title?: string
  phone?: string
}

export function GoogleSheetsImportForm() {
  const [sheetId, setSheetId] = useState("")
  const [sheetName, setSheetName] = useState("Sheet1")
  const [isLoading, setIsLoading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [previewData, setPreviewData] = useState<PreviewData[]>([])
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<string[]>([])
  const [importResult, setImportResult] = useState<{
    imported: number
    skipped: number
    errors: string[]
  } | null>(null)

  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false)
  const [syncInterval, setSyncInterval] = useState("30")
  const [isSyncConfiguring, setIsSyncConfiguring] = useState(false)
  const [syncStatus, setSyncStatus] = useState<string>("")

  const extractSheetId = (url: string) => {
    // Extract sheet ID from various Google Sheets URL formats
    const patterns = [/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/, /^([a-zA-Z0-9-_]+)$/]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return url
  }

  const handlePreview = async () => {
    if (!sheetId.trim()) {
      setMessage("Please enter a Google Sheets ID or URL")
      return
    }

    setIsLoading(true)
    setMessage("")
    setErrors([])
    setPreviewData([])
    setImportResult(null)

    try {
      const extractedId = extractSheetId(sheetId.trim())

      const response = await fetch("/api/admin/users/import/google-sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sheetId: extractedId,
          sheetName: sheetName.trim() || "Sheet1",
          preview: true,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setPreviewData(result.preview || [])
        setMessage(result.message)
        if (result.errors?.length > 0) {
          setErrors(result.errors)
        }
      } else {
        setMessage(result.message || "Failed to preview Google Sheets data")
        setErrors(result.errors || [])
      }
    } catch (error) {
      setMessage("Failed to connect to Google Sheets. Please check your sheet ID and permissions.")
      setErrors(["Network error occurred"])
    } finally {
      setIsLoading(false)
    }
  }

  const handleImport = async () => {
    if (!sheetId.trim() || previewData.length === 0) {
      setMessage("Please preview the data first")
      return
    }

    setIsImporting(true)
    setMessage("")
    setImportResult(null)

    try {
      const extractedId = extractSheetId(sheetId.trim())

      const response = await fetch("/api/admin/users/import/google-sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sheetId: extractedId,
          sheetName: sheetName.trim() || "Sheet1",
          preview: false,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setImportResult({
          imported: result.imported,
          skipped: result.skipped,
          errors: result.errors || [],
        })
        setMessage(`Import completed! ${result.imported} users imported, ${result.skipped} skipped.`)
        setPreviewData([])
      } else {
        setMessage(result.message || "Failed to import users from Google Sheets")
        setErrors(result.errors || [])
      }
    } catch (error) {
      setMessage("Failed to import users. Please try again.")
      setErrors(["Network error occurred"])
    } finally {
      setIsImporting(false)
    }
  }

  const handleAutoSyncToggle = async (enabled: boolean) => {
    if (!enabled) {
      setAutoSyncEnabled(false)
      setSyncStatus("")
      return
    }

    if (!sheetId.trim()) {
      setMessage("Please enter a Google Sheets ID first")
      return
    }

    setIsSyncConfiguring(true)
    try {
      const extractedId = extractSheetId(sheetId.trim())

      const response = await fetch("/api/admin/sync/google-sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sheetId: extractedId,
          intervalMinutes: Number.parseInt(syncInterval),
        }),
      })

      const result = await response.json()

      if (result.success) {
        setAutoSyncEnabled(true)
        setSyncStatus(`Auto-sync configured: every ${syncInterval} minutes`)
        setMessage("Auto-sync has been configured successfully!")
      } else {
        setMessage(result.message || "Failed to configure auto-sync")
        setAutoSyncEnabled(false)
      }
    } catch (error) {
      setMessage("Failed to configure auto-sync")
      setAutoSyncEnabled(false)
    } finally {
      setIsSyncConfiguring(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sheetId">Google Sheets ID or URL</Label>
          <Input
            id="sheetId"
            placeholder="Enter Google Sheets ID or full URL"
            value={sheetId}
            onChange={(e) => setSheetId(e.target.value)}
          />
          <p className="text-sm text-gray-500">You can paste the full Google Sheets URL or just the sheet ID</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sheetName">Sheet Name (optional)</Label>
          <Input id="sheetName" placeholder="Sheet1" value={sheetName} onChange={(e) => setSheetName(e.target.value)} />
          <p className="text-sm text-gray-500">Name of the specific sheet/tab to import from (default: Sheet1)</p>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Auto-Sync Configuration
            </CardTitle>
            <CardDescription className="text-xs">
              Automatically import new users when they're added to your Google Sheet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm">Enable Auto-Sync</Label>
                <p className="text-xs text-gray-600">Periodically check for new users</p>
              </div>
              <Switch checked={autoSyncEnabled} onCheckedChange={handleAutoSyncToggle} disabled={isSyncConfiguring} />
            </div>

            {(autoSyncEnabled || isSyncConfiguring) && (
              <div className="space-y-2">
                <Label className="text-sm">Sync Interval</Label>
                <Select value={syncInterval} onValueChange={setSyncInterval}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">Every 15 minutes</SelectItem>
                    <SelectItem value="30">Every 30 minutes</SelectItem>
                    <SelectItem value="60">Every hour</SelectItem>
                    <SelectItem value="180">Every 3 hours</SelectItem>
                    <SelectItem value="360">Every 6 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {syncStatus && (
              <Alert className="border-green-200 bg-green-50">
                <Clock className="h-4 w-4" />
                <AlertDescription className="text-sm">{syncStatus}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button onClick={handlePreview} disabled={isLoading || !sheetId.trim()} variant="outline">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Preview Data
              </>
            )}
          </Button>

          {previewData.length > 0 && (
            <Button onClick={handleImport} disabled={isImporting}>
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Import Users
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Messages and Errors */}
      {message && (
        <Alert className={importResult ? "border-green-200 bg-green-50" : ""}>
          {importResult ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Issues found:</p>
              <ul className="list-disc list-inside space-y-1">
                {errors.slice(0, 5).map((error, index) => (
                  <li key={index} className="text-sm">
                    {error}
                  </li>
                ))}
                {errors.length > 5 && <li className="text-sm">... and {errors.length - 5} more issues</li>}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Import Results */}
      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Import Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Users Imported:</span>
              <Badge variant="default">{importResult.imported}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Users Skipped:</span>
              <Badge variant="secondary">{importResult.skipped}</Badge>
            </div>
            {importResult.errors.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-red-600 mb-2">Import Errors:</p>
                <div className="space-y-1">
                  {importResult.errors.slice(0, 3).map((error, index) => (
                    <p key={index} className="text-xs text-red-500">
                      {error}
                    </p>
                  ))}
                  {importResult.errors.length > 3 && (
                    <p className="text-xs text-red-500">... and {importResult.errors.length - 3} more errors</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preview Table */}
      {previewData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
            <CardDescription>Showing first {previewData.length} rows from your Google Sheet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Phone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role || "attendee"}</Badge>
                      </TableCell>
                      <TableCell>{user.organization || "-"}</TableCell>
                      <TableCell>{user.title || "-"}</TableCell>
                      <TableCell>{user.phone || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Google Sheets Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p className="text-sm font-medium">1. Make your Google Sheet public:</p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Open your Google Sheet</li>
              <li>• Click "Share" in the top right</li>
              <li>• Click "Change to anyone with the link"</li>
              <li>• Set permission to "Viewer"</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">2. Required columns in your sheet:</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="destructive">Name</Badge>
              <Badge variant="destructive">Email</Badge>
              <Badge variant="secondary">Role</Badge>
              <Badge variant="secondary">Organization</Badge>
              <Badge variant="secondary">Title</Badge>
              <Badge variant="secondary">Phone</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">3. Auto-Sync Feature:</p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Enable auto-sync to automatically import new users</li>
              <li>• New users added to your sheet will be imported automatically</li>
              <li>• Existing users will be skipped to avoid duplicates</li>
              <li>• QR codes will be generated and sent to new users</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
