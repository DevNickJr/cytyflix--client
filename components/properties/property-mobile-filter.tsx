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
      <nav draggable className='fixed bottom-4 right-4 z-30 md:hidden h-16'>
        <button
          onClick={() => setMoreOpen(true)}
          className='flex flex-col items-center gap-1 px-4 justify-center aspect-square bg-primary text-primary-foreground rounded-full text-xs shadow-md shadow-primary/50 hover:shadow-lg hover:shadow-primary/50 transition-shadow'
        >
          <SlidersHorizontal className='w-5 h-5' />
          {/* <span>Filter</span> */}
        </button>
      </nav>
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
    </>
  )
}

export default PropertyMobileFilter
