import NIGERIAN_STATES from '@/app/places.json'
import { useEffect, useState } from 'react';

export function usePlaces({
    city,
    lga,
    state,
    resetLga,
    resetCity,
}: {
    state?: string; 
    lga?: string; 
    city?: string; 
    resetLga: () => void;
    resetCity: () => void;
}) {
    const [lgas, setLgas] = useState<{ name: string; wards: { name: string; latitude: number; longitude: number}[]}[]>([]);
    const [cities, setCities] = useState<{
        name: string;
        latitude: number;
        longitude: number;
    }[]>([]);

    useEffect(() => {
        if (!state) setLgas([]);

        const lgas = NIGERIAN_STATES?.find(stateF => stateF.state === state)
        setLgas(lgas?.lgas || [])
        resetLga?.()
        resetCity?.()
        // onFilterChange({ lga: undefined })
        // onFilterChange({ city: undefined })
        
    }, [state])

    useEffect(() => {
        if (!lga) setCities([]);

        const cities = lgas?.find(lgaF => lgaF.name == lga)
        setCities(cities?.wards || [])
        resetCity?.()
    }, [lga])
    

    return {
        cities,
        lgas,
        states: NIGERIAN_STATES,
        city,
        lga,
        state
    }
}