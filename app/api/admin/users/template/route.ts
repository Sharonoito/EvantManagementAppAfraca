import { type NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get("format") || "xlsx"

  // Template data
  const templateData = [
    [
      "Name",
      "Email",
      "Role",
      "Organization",
      "Title",
      "Phone",
      "Dietary Restrictions",
      "Accessibility Needs",
      "Networking Interests",
    ],
    [
      "John Doe",
      "john.doe@example.com",
      "attendee",
      "ABC Corp",
      "Manager",
      "+1234567890",
      "Vegetarian",
      "None",
      "Finance, Technology",
    ],
    [
      "Jane Smith",
      "jane.smith@example.com",
      "organizer",
      "XYZ Ltd",
      "Director",
      "+0987654321",
      "None",
      "Wheelchair access",
      "Agriculture, Policy",
    ],
  ]

  // Create workbook
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.aoa_to_sheet(templateData)

  // Set column widths
  worksheet["!cols"] = [
    { width: 15 }, // Name
    { width: 25 }, // Email
    { width: 12 }, // Role
    { width: 20 }, // Organization
    { width: 15 }, // Title
    { width: 15 }, // Phone
    { width: 20 }, // Dietary Restrictions
    { width: 20 }, // Accessibility Needs
    { width: 25 }, // Networking Interests
  ]

  XLSX.utils.book_append_sheet(workbook, worksheet, "Users")

  if (format === "csv") {
    // Generate CSV
    const csv = XLSX.utils.sheet_to_csv(worksheet)

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="user_import_template.csv"',
      },
    })
  } else {
    // Generate Excel
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="user_import_template.xlsx"',
      },
    })
  }
}
