"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CheckInFormProps {
  onSubmit: (formData: FormData) => Promise<void>
}

export function CheckInForm({ onSubmit }: CheckInFormProps) {
  return (
    <form action={onSubmit} className="flex gap-2">
      <Input type="email" name="email" placeholder="Enter your email" required />
      <Button type="submit">Check In</Button>
    </form>
  )
}
