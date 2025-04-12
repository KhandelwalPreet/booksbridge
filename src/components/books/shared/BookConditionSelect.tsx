
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

interface BookConditionSelectProps {
  condition: string;
  onConditionChange: (condition: string) => void;
  label?: boolean;
  className?: string;
}

const BookConditionSelect = ({ 
  condition, 
  onConditionChange, 
  label = true,
  className = ''
}: BookConditionSelectProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label htmlFor="condition">Book Condition</Label>}
      <Select value={condition} onValueChange={onConditionChange}>
        <SelectTrigger className={!label ? "h-8" : ""}>
          <SelectValue placeholder="Select condition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="New">New</SelectItem>
          <SelectItem value="Like New">Like New</SelectItem>
          <SelectItem value="Very Good">Very Good</SelectItem>
          <SelectItem value="Good">Good</SelectItem>
          <SelectItem value="Fair">Fair</SelectItem>
          <SelectItem value="Poor">Poor</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default BookConditionSelect;
