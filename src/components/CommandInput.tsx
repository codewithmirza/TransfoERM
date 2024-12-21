import { ChangeEvent, KeyboardEvent } from 'react'

interface CommandInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (command: string) => Promise<void>
}

export function CommandInput({ value, onChange, onSubmit }: CommandInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      await onSubmit(value.trim())
      onChange('')
    }
  }

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      placeholder="Type a command or speak..."
      className="w-full px-4 py-2 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Command input"
    />
  )
} 