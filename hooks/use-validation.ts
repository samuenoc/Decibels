"use client"

import { useState, useCallback } from "react"
import { useAuth } from "@/components/auth/auth-provider"

export function useValidation() {
    const { isAuthenticated, isWalletConnected, isLoading } = useAuth()
    const [showValidationModal, setShowValidationModal] = useState(false)

    const validateAccess = useCallback(() => {
        if (isLoading) {
            return false
        }

        if (!isWalletConnected) {
            setShowValidationModal(true)
            return false
        }

        if (!isAuthenticated) {
            setShowValidationModal(true)
            return false
        }

        return true
    }, [isAuthenticated, isWalletConnected, isLoading])

    const closeValidationModal = useCallback(() => {
        setShowValidationModal(false)
    }, [])

    const handleValidationSuccess = useCallback(() => {
        setShowValidationModal(false)
    }, [])

    return {
        validateAccess,
        showValidationModal,
        closeValidationModal,
        handleValidationSuccess,
        isAuthenticated,
        isWalletConnected,
        isLoading
    }
}
