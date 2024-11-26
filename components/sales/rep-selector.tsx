"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { SalesRep } from "@/types/sales-rep";

interface RepSelectorProps {
  salesReps: SalesRep[];
  selectedReps: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

export function RepSelector({ salesReps, selectedReps, onSelectionChange }: RepSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const toggleRep = (repId: string) => {
    const newSelection = selectedReps.includes(repId)
      ? selectedReps.filter(id => id !== repId)
      : [...selectedReps, repId];
    onSelectionChange(newSelection);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {selectedReps.length === 0 
            ? "Select sales reps..."
            : `${selectedReps.length} selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search sales reps..." />
          <CommandEmpty>No sales rep found.</CommandEmpty>
          <CommandGroup>
            {salesReps.map((rep) => (
              <CommandItem
                key={rep.id}
                onSelect={() => toggleRep(rep.id)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  {rep.name}
                  <Badge
                    variant="outline"
                    className={cn(
                      "ml-2",
                      rep.availability === "available" && "bg-green-100 text-green-800",
                      rep.availability === "tentative" && "bg-yellow-100 text-yellow-800",
                      rep.availability === "busy" && "bg-red-100 text-red-800"
                    )}
                  >
                    {rep.availability}
                  </Badge>
                </div>
                <Check
                  className={cn(
                    "h-4 w-4",
                    selectedReps.includes(rep.id) ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}