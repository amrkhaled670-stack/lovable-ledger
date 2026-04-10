import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, CalendarDays, X } from "lucide-react";
import { format } from "date-fns";

interface SmartFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusOptions?: string[];
  selectedStatus?: string;
  onStatusChange?: (value: string) => void;
  dateFrom?: Date;
  dateTo?: Date;
  onDateFromChange?: (date: Date | undefined) => void;
  onDateToChange?: (date: Date | undefined) => void;
  onClear?: () => void;
}

export function SmartFilters({
  searchValue, onSearchChange,
  statusOptions, selectedStatus, onStatusChange,
  dateFrom, dateTo, onDateFromChange, onDateToChange,
  onClear,
}: SmartFiltersProps) {
  const { t } = useTranslation();
  const [showDateFilter, setShowDateFilter] = useState(false);

  const hasFilters = searchValue || selectedStatus || dateFrom || dateTo;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("common.search")}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="ps-9"
        />
      </div>

      {statusOptions && onStatusChange && (
        <Select value={selectedStatus || "all"} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t("common.filter")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.all")}</SelectItem>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Popover open={showDateFilter} onOpenChange={setShowDateFilter}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <CalendarDays className="h-4 w-4" />
            {dateFrom ? format(dateFrom, "MMM d") : t("common.from")}
            {" — "}
            {dateTo ? format(dateTo, "MMM d") : t("common.to")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="flex gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">{t("common.from")}</p>
              <Calendar mode="single" selected={dateFrom} onSelect={onDateFromChange} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">{t("common.to")}</p>
              <Calendar mode="single" selected={dateTo} onSelect={onDateToChange} />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {hasFilters && onClear && (
        <Button variant="ghost" size="sm" onClick={onClear} className="gap-1">
          <X className="h-3 w-3" />
          {t("common.clear")}
        </Button>
      )}
    </div>
  );
}
