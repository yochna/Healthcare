import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

export const usePatientFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    
    const filters = {
        status: searchParams.get("status") || "",
        urgency: searchParams.get("urgency") || "",
        page: parseInt(searchParams.get("page")) || 1,
        limit: parseInt(searchParams.get("limit")) || 10
    };

    
    const setFilter = useCallback((key, value) => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            if(value) {
                params.set(key, value);
            } else {
                params.delete(key); 
            }
            
            if(key !== "page") params.set("page", "1");
            return params;
        });
    }, [setSearchParams]);

   
    const resetFilters = useCallback(() => {
        setSearchParams({});
    }, [setSearchParams]);

    return { filters, setFilter, resetFilters };
};