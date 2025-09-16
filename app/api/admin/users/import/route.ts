import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/db"
import * as XLSX from "xlsx"

interface UserRow {
  name?: string
  email?: string
  role?: string
  organization?: string
  title?: string
  phone?: string
  dietary_restrictions?: string
  accessibility_needs?: string
  networking_interests?: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const isPreview = formData.get("preview") === "true"

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file provided",
        },
        { status: 400 },
      )
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    let workbook: XLSX.WorkBook

    try {
      // Parse Excel or CSV file
      if (file.name.endsWith(".csv")) {
        const csvData = buffer.toString("utf-8")
        workbook = XLSX.read(csvData, { type: "string" })
      } else {
        workbook = XLSX.read(buffer, { type: "buffer" })
      }
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to parse file. Please ensure it's a valid Excel or CSV file.",
          errors: ["Invalid file format"],
        },
        { status: 400 },
      )
    }

    // Get first worksheet
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // Convert to JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

    if (rawData.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "File must contain at least a header row and one data row",
          errors: ["Insufficient data"],
        },
        { status: 400 },
      )
    }

    // Parse headers and data
    const headers = rawData[0].map((h: any) => String(h).toLowerCase().trim())
    const dataRows = rawData.slice(1)

    // Map headers to expected fields
    const fieldMapping: { [key: string]: string } = {
      name: "name",
      "full name": "name",
      email: "email",
      "email address": "email",
      role: "role",
      organization: "organization",
      company: "organization",
      title: "title",
      "job title": "title",
      phone: "phone",
      "phone number": "phone",
      "dietary restrictions": "dietary_restrictions",
      dietary: "dietary_restrictions",
      "accessibility needs": "accessibility_needs",
      accessibility: "accessibility_needs",
      "networking interests": "networking_interests",
      interests: "networking_interests",
    }

    // Process rows
    const processedData: UserRow[] = []
    const errors: string[] = []

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i]
      const rowNum = i + 2 // +2 because we start from row 2 (after header)

      if (!row || row.every((cell: any) => !cell)) {
        continue // Skip empty rows
      }

      const userData: UserRow = {}

      // Map data based on headers
      headers.forEach((header, index) => {
        const mappedField = fieldMapping[header]
        if (mappedField && row[index]) {
          userData[mappedField as keyof UserRow] = String(row[index]).trim()
        }
      })

      // Validate required fields
      if (!userData.name || !userData.email) {
        errors.push(`Row ${rowNum}: Missing required fields (name and email)`)
        continue
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(userData.email)) {
        errors.push(`Row ${rowNum}: Invalid email format`)
        continue
      }

      // Set default role
      if (!userData.role) {
        userData.role = "attendee"
      }

      // Validate role
      const validRoles = ["admin", "organizer", "attendee"]
      if (!validRoles.includes(userData.role.toLowerCase())) {
        userData.role = "attendee"
      }

      processedData.push(userData)
    }

    // If preview mode, return processed data
    if (isPreview) {
      return NextResponse.json({
        success: true,
        preview: processedData.slice(0, 50), // Limit preview to 50 rows
        message: `Found ${processedData.length} valid rows`,
        errors: errors.slice(0, 10), // Limit errors in preview
      })
    }

    // Import users to database
    let imported = 0
    let skipped = 0
    const importErrors: string[] = []

    for (const userData of processedData) {
      try {
        // Check if user already exists
        const existingUser = await getUserByEmail(userData.email!)
        if (existingUser) {
          skipped++
          continue
        }

        // Create user
        await createUser({
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          email: userData.email!,
          name: userData.name!,
          role: userData.role?.toLowerCase() || "attendee",
          organization: userData.organization,
          title: userData.title,
          phone: userData.phone,
          dietary_restrictions: userData.dietary_restrictions,
          accessibility_needs: userData.accessibility_needs,
          networking_interests: userData.networking_interests
            ? userData.networking_interests.split(",").map((s) => s.trim())
            : [],
        })

        imported++
      } catch (error) {
        importErrors.push(`Failed to import ${userData.email}: ${error}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import completed successfully`,
      imported,
      skipped,
      errors: [...errors, ...importErrors],
    })
  } catch (error) {
    console.error("Import error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error during import",
        imported: 0,
        skipped: 0,
        errors: ["Server error occurred"],
      },
      { status: 500 },
    )
  }
}
