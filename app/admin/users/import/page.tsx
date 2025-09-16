import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { ImportForm } from "@/components/admin/import-form"
import { GoogleSheetsImportForm } from "@/components/admin/google-sheets-import-form"

export default function ImportUsersPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Import Users</h1>
            <p className="text-gray-600 dark:text-gray-300">Bulk import users from Excel, CSV, or Google Sheets</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/users">Back to Users</Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Import Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Google Sheets import option */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  Import from Google Sheets
                </CardTitle>
                <CardDescription>Import users directly from a Google Sheets document</CardDescription>
              </CardHeader>
              <CardContent>
                <GoogleSheetsImportForm />
              </CardContent>
            </Card>

            {/* File Upload Option */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload File
                </CardTitle>
                <CardDescription>Select an Excel (.xlsx) or CSV file containing user data</CardDescription>
              </CardHeader>
              <CardContent>
                <ImportForm />
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            {/* Template Download */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Template
                </CardTitle>
                <CardDescription>Use our template to ensure proper formatting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full bg-transparent" variant="outline">
                  <Link href="/api/admin/users/template?format=xlsx">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel Template
                  </Link>
                </Button>
                <Button asChild className="w-full bg-transparent" variant="outline">
                  <Link href="/api/admin/users/template?format=csv">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    CSV Template
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Required Fields */}
            <Card>
              <CardHeader>
                <CardTitle>Required Fields</CardTitle>
                <CardDescription>These columns must be present in your file</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Name</span>
                    <Badge variant="destructive">Required</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email</span>
                    <Badge variant="destructive">Required</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Role</span>
                    <Badge variant="secondary">Optional</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Organization</span>
                    <Badge variant="secondary">Optional</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Title</span>
                    <Badge variant="secondary">Optional</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Phone</span>
                    <Badge variant="secondary">Optional</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Import Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Import Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Duplicate emails will be skipped during import
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    QR codes will be automatically generated for each user
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">Default role is "attendee" if not specified</AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
