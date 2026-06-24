'use client'
import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from '@/components/ui/sheet'
import type { PropertyFilters as PropertyFiltersType } from "@/types/property"
import { PropertyFilters } from './property-filters'
import { Button } from '../ui/button'

interface PropertyFiltersProps {
  filters: PropertyFiltersType
  onFilterChange: (filters: Partial<PropertyFiltersType>) => void
  onReset: () => void
  forMobile?: boolean
}

const PropertyMobileFilter = ({ filters, onFilterChange, onReset }: PropertyFiltersProps) => {
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <>
      <nav className='fixed bottom-4 right-4 z-30 md:hidden h-16'>
        <button
          onClick={() => setMoreOpen(true)}
          className='flex flex-col items-center gap-1 px-3 py-2 text-xs text-muted-foreground transition-colors'
        >
          <SlidersHorizontal className='w-5 h-5' />
          <span>Filter</span>
        </button>
      </nav>
      <div className='h-full w-full fixed overflow-auto top-0 left-0'>
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetContent side="bottom" className="rounded-t-2xl flex flex-col flex-1 h-full overflow-auto">
            <SheetHeader>
            </SheetHeader>
            <PropertyFilters
              filters={filters}
              onFilterChange={onFilterChange}
              onReset={onReset}
              forMobile={true}
            />
            <Button
             onClick={() => setMoreOpen(false)}
             >
              Done
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

export default PropertyMobileFilter
