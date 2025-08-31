"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"

export function useValidation() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const validateAccess = useCallback(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
        
        if (!isAuthenticated) {
            // Redirect to listener registration (login page)
            router.push('/listener/register')
            return false
        }

        return true
    }, [router])

    return {
        validateAccess,
        isLoading
    }
}
