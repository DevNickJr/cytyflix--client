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
    const [lgas, setLgas] = useState<{ name: string; cities: { name: string; latitude: number; longitude: number }[] }[]>([]);
    const [cities, setCities] = useState<{
        name: string;
        latitude: number;
        longitude: number;
    }[]>([]);

    useEffect(() => {
        if (!state) {
            return setLgas([]);
        }

        const stateFound = NIGERIAN_STATES?.find(stateF => stateF.state === state)
        setLgas(stateFound?.lgas || [])
        resetLga?.()
        resetCity?.()
        // onFilterChange({ lga: undefined })
        // onFilterChange({ city: undefined })

    }, [state])

    useEffect(() => {
        if (!lga) {
            return setCities([]);
        }

        const cities = lgas?.find(lgaF => lgaF.name == lga)
        setCities(cities?.cities || [])
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