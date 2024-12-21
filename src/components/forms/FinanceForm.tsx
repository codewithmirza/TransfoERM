import { FormWrapper } from './FormWrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

export function FinanceForm() {
  const handleSubmit = async (data: any) => {
    const response = await fetch('https://transfoerm.manwaarullahb.workers.dev/api/finance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to create finance entry');
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select name="type" required>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input type="number" name="amount" required min="0" step="0.01" />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input type="text" name="category" required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input type="text" name="description" />
        </div>
      </div>
    </FormWrapper>
  );
} 