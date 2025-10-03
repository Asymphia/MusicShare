import { type ChangeEvent, useCallback, useMemo, useState } from "react"
import useDebounce from "./useDebounce"

type FilterFn<T> = (item: T, query: string) => boolean

export interface useDynamicSearchOptions {
    initialQuery?: string
    debounceMs?: number
    displayLimit?: number | null
}

const useDynamicSearch = <T>(
    data: T[] | undefined | null,
    filterFn: FilterFn<T>,
    options: useDynamicSearchOptions = {}
) => {
    const { initialQuery = "", debounceMs = 150, displayLimit = 50 } = options

    const [searchQuery, setSearchQuery] = useState<string>(initialQuery)
    const debouncedSearchQuery = useDebounce(searchQuery, debounceMs)

    const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }, [])

    const filteredData = useMemo(() => {
        if(!data || !Array.isArray(data)) return [] as T[]

        const q = String(debouncedSearchQuery || "").trim()
        if(!q) return data

        const lower = q.toLowerCase()

        return data.filter(item => {
            try {
                return filterFn(item, lower)
            } catch {
                return false
            }
        })
    }, [data, debouncedSearchQuery, filterFn])

    const displayedData = useMemo(() => {
        if(displayLimit === null || displayLimit === undefined) return filteredData
        return filteredData.slice(0, displayLimit)
    }, [displayLimit, filteredData])

    return {
        searchQuery,
        handleSearchChange,
        filteredData,
        displayedData
    }
}

export default useDynamicSearch