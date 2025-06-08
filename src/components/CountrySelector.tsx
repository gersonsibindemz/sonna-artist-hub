
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { countries } from "@/data/countries";
import type { Country } from "@/types/auth";

interface CountrySelectorProps {
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
  onPhoneChange: (phone: string) => void;
  phoneValue: string;
  className?: string;
}

const CountrySelector = ({ 
  selectedCountry, 
  onCountryChange, 
  onPhoneChange, 
  phoneValue,
  className 
}: CountrySelectorProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("flex", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[130px] justify-between bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="text-sm">{selectedCountry.dialCode}</span>
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Procurar país..." />
            <CommandEmpty>Nenhum país encontrado.</CommandEmpty>
            <CommandGroup className="max-h-[200px] overflow-auto">
              {countries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={`${country.name} ${country.dialCode}`}
                  onSelect={() => {
                    onCountryChange(country);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCountry.code === country.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="mr-3 text-lg">{country.flag}</span>
                  <div className="flex flex-col">
                    <span>{country.name}</span>
                    <span className="text-sm text-gray-500">{country.dialCode}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      <Input
        type="tel"
        value={phoneValue}
        onChange={(e) => onPhoneChange(e.target.value)}
        className="flex-1 ml-2 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
        placeholder="123 456 789"
      />
    </div>
  );
};

export default CountrySelector;
