import { useSearchParams } from "react-router-dom"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface Option {
  label: string
  value: string
}

interface SegmentedFilterProps {
  paramKey: string
  defaultValue: string
  options: Option[]
}

function SegmentedFilter({
  paramKey,
  defaultValue,
  options,
}: SegmentedFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeValue = searchParams.get(paramKey) ?? defaultValue

  function updateSearchParam(value: string) {
    const params = new URLSearchParams(searchParams)

    if (value === defaultValue) {
      params.delete(paramKey)
    } else {
      params.set(paramKey, value)
    }

    params.delete("page")
    setSearchParams(params)
  }

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      spacing={0}
      value={activeValue}
      onValueChange={(value) => {
        if (value) updateSearchParam(value)
      }}
    >
      {options.map((opt) => (
        <ToggleGroupItem key={opt.value} value={opt.value}>
          {opt.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export default SegmentedFilter
