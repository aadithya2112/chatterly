"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  defaultColor?: string;
  onChange?: (color: string) => void;
}

export function ColorPicker({
  defaultColor = "#000000",
  onChange,
}: ColorPickerProps) {
  const [color, setColor] = useState(defaultColor);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className="h-10 w-10 rounded-md border"
        style={{ backgroundColor: color }}
      />
      <Input
        type="color"
        value={color}
        onChange={handleChange}
        className="h-10 w-20 p-1"
      />
      <Input
        type="text"
        value={color}
        onChange={handleChange}
        className="h-10 w-28 font-mono text-sm"
      />
    </div>
  );
}
