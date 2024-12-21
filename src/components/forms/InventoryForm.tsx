import { FormWrapper } from './FormWrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export function InventoryForm() {
  const handleSubmit = async (data: any) => {
    const response = await fetch('https://transfoerm.manwaarullahb.workers.dev/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to create inventory entry');
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Item Name</Label>
          <Input type="text" name="name" required />
        </div>
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input type="text" name="sku" required />
        </div>
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input type="number" name="quantity" required min="0" />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select name="category" required>
            <option value="raw">Raw Materials</option>
            <option value="finished">Finished Goods</option>
            <option value="supplies">Supplies</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="location">Storage Location</Label>
          <Input type="text" name="location" required />
        </div>
        <div>
          <Label htmlFor="reorderPoint">Reorder Point</Label>
          <Input type="number" name="reorderPoint" required min="0" />
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea name="notes" />
        </div>
      </div>
    </FormWrapper>
  );
} 