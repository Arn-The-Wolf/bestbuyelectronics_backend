import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Country {
  code: string;
  dialCode: string;
  flag: string;
  name: string;
}

const countries: Country[] = [
  { code: "TZ", dialCode: "+255", flag: "🇹🇿", name: "Tanzania" },
  { code: "KE", dialCode: "+254", flag: "🇰🇪", name: "Kenya" },
  { code: "UG", dialCode: "+256", flag: "🇺🇬", name: "Uganda" },
  { code: "RW", dialCode: "+250", flag: "🇷🇼", name: "Rwanda" },
  { code: "ET", dialCode: "+251", flag: "🇪🇹", name: "Ethiopia" },
  { code: "SO", dialCode: "+252", flag: "🇸🇴", name: "Somalia" },
  { code: "SS", dialCode: "+211", flag: "🇸🇸", name: "South Sudan" },
  { code: "BI", dialCode: "+257", flag: "🇧🇮", name: "Burundi" },
  { code: "DJ", dialCode: "+253", flag: "🇩🇯", name: "Djibouti" },
  { code: "ER", dialCode: "+291", flag: "🇪🇷", name: "Eritrea" },
  { code: "US", dialCode: "+1", flag: "🇺🇸", name: "United States" },
  { code: "GB", dialCode: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "CA", dialCode: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "AU", dialCode: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "ZA", dialCode: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "NG", dialCode: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "GH", dialCode: "+233", flag: "🇬🇭", name: "Ghana" },
  { code: "EG", dialCode: "+20", flag: "🇪🇬", name: "Egypt" },
  { code: "IN", dialCode: "+91", flag: "🇮🇳", name: "India" },
  { code: "CN", dialCode: "+86", flag: "🇨🇳", name: "China" },
  { code: "JP", dialCode: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "DE", dialCode: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "FR", dialCode: "+33", flag: "🇫🇷", name: "France" },
  { code: "IT", dialCode: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "ES", dialCode: "+34", flag: "🇪🇸", name: "Spain" },
  { code: "BR", dialCode: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "MX", dialCode: "+52", flag: "🇲🇽", name: "Mexico" },
  { code: "AR", dialCode: "+54", flag: "🇦🇷", name: "Argentina" },
  { code: "AE", dialCode: "+971", flag: "🇦🇪", name: "United Arab Emirates" },
  { code: "SA", dialCode: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
];

interface CountryCodeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const CountryCodeSelect = ({ value, onValueChange }: CountryCodeSelectProps) => {
  // Find the country that matches the current value
  const currentCountry = countries.find(c => c.dialCode === value);
  
  // Use a unique value format: countryCode:dialCode to avoid duplicates
  const getUniqueValue = (country: Country) => `${country.code}:${country.dialCode}`;
  const getDialCodeFromValue = (uniqueValue: string) => uniqueValue.split(':')[1] || uniqueValue;
  
  // Convert current value to unique format if needed
  const currentUniqueValue = currentCountry ? getUniqueValue(currentCountry) : value;
  
  const handleValueChange = (uniqueValue: string) => {
    const dialCode = getDialCodeFromValue(uniqueValue);
    onValueChange(dialCode);
  };

  return (
    <Select value={currentUniqueValue} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Country">
          {currentCountry ? (
            <div className="flex items-center gap-2">
              <span>{currentCountry.flag}</span>
              <span className="text-sm">{currentCountry.dialCode}</span>
            </div>
          ) : (
            "Select"
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {countries.map((country) => (
          <SelectItem key={`${country.code}-${country.dialCode}`} value={getUniqueValue(country)}>
            <div className="flex items-center gap-2">
              <span>{country.flag}</span>
              <span className="text-sm">{country.dialCode}</span>
              <span className="text-sm text-muted-foreground ml-2">{country.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountryCodeSelect;

