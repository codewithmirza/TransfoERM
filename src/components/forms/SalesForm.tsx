import { FormWrapper } from './FormWrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export function SalesForm() {
  const handleSubmit = async (data: any) => {
    const response = await fetch('https://transfoerm.manwaarullahb.workers.dev/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to create sales entry');
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="customerName">Customer Name</Label>
          <Input type="text" name="customerName" required />
        </div>
        <div>
          <Label htmlFor="orderType">Order Type</Label>
          <Select name="orderType" required>
            <option value="retail">Retail</option>
            <option value="wholesale">Wholesale</option>
            <option value="online">Online</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input type="number" name="amount" required min="0" step="0.01" />
        </div>
        <div>
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select name="paymentMethod" required>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="transfer">Bank Transfer</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea name="notes" />
        </div>
      </div>
    </FormWrapper>
  );
} 