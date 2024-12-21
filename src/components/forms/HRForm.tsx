import { FormWrapper } from './FormWrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

export function HRForm() {
  const handleSubmit = async (data: any) => {
    const response = await fetch('https://transfoerm.manwaarullahb.workers.dev/api/hr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to create HR entry');
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="type">Request Type</Label>
          <Select name="type" required>
            <option value="leave">Leave Request</option>
            <option value="expense">Expense Claim</option>
            <option value="timeoff">Time Off</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input type="date" name="startDate" required />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input type="date" name="endDate" required />
        </div>
        <div>
          <Label htmlFor="reason">Reason</Label>
          <Input type="text" name="reason" required />
        </div>
      </div>
    </FormWrapper>
  );
} 