"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useId } from "react";

export function FormField({
  children,
  className,
  description,
}: {
  children: React.ReactNode;
  className?: string;
  description?: string;
}) {
  return (
    <div className={cn("mb-4 space-y-2", className)}>
      {children}
      {description ? (
        <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}) {
  return (
    <FormField className={className}>
      <Label className="text-sm font-medium">{label}</Label>
      <Select value={value} onValueChange={(v) => v && onChange(v as T)}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}

export function SwitchField({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  description?: string;
}) {
  const id = useId();

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border px-4 py-3">
      <div className="min-w-0 space-y-0.5">
        <Label htmlFor={id} className="text-sm font-medium leading-snug">
          {label}
        </Label>
        {description ? (
          <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} className="mt-0.5 shrink-0" />
    </div>
  );
}

export function SwitchFieldGroup({
  legend,
  description,
  children,
}: {
  legend: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="mb-4 space-y-2">
      <legend className="text-sm font-medium">{legend}</legend>
      {description ? (
        <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
      <div className="space-y-2">{children}</div>
    </fieldset>
  );
}

export function SliderField({
  label,
  value,
  onChange,
  min = 1,
  max = 5,
  displayValue,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  displayValue?: string | number;
}) {
  return (
    <FormField>
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-sm font-medium text-muted-foreground">
          {displayValue ?? value}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={1}
        value={[value]}
        onValueChange={(values) => {
          const next = Array.isArray(values) ? values[0] : values;
          onChange(next ?? min);
        }}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>低</span>
        <span>高</span>
      </div>
    </FormField>
  );
}

export function MultiSelectField({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <FormField>
      <Label>{label}</Label>
      <ToggleGroup
        multiple
        variant="outline"
        spacing={2}
        value={selected}
        onValueChange={(values) => onChange(values)}
        className="flex w-full flex-wrap justify-start"
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option}
            value={option}
            className="rounded-full px-3 data-pressed:bg-primary data-pressed:text-primary-foreground"
          >
            {option}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </FormField>
  );
}

export { Input };
