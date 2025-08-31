"use client"

import { useState, useCallback, useEffect } from "react"
import { useWeb3 } from "@/hooks/web3"
import { getArbitrumBalanceRobust } from "@/utils/arbitrumBalance"
import { toast } from "@/hooks/use-toast"

interface PurchaseResult {
  success: boolean
  message: string
  transactionHash?: string
}

export function useSongPurchase() {
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [purchasedSongs, setPurchasedSongs] = useState<Set<string>>(new Set())
  const [purchaseMessage, setPurchaseMessage] = useState<string>("")
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info")
  const { web3, contract, walletAddress } = useWeb3()

  const checkBalance = useCallback(async (requiredAmount: number): Promise<boolean> => {
    if (!walletAddress) {
      console.log('No wallet address available')
      return false
    }

    try {
      const balanceResult = await getArbitrumBalanceRobust(walletAddress)
      console.log(`Current balance: ${balanceResult.eth} ETH, Required: ${requiredAmount} ETH`)
      return balanceResult.eth >= requiredAmount
    } catch (error) {
      console.error('Error checking balance:', error)
      return false
    }
  }, [walletAddress])

  const purchaseSong = useCallback(async (
    songId: string,
    artistWallet: string,
    price: number
  ): Promise<PurchaseResult> => {
    setIsPurchasing(true)
    setPurchaseMessage("")

    try {
      // Check if user is authenticated
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
      if (!isAuthenticated) {
        const message = "Debes iniciar sesión para comprar canciones"
        setPurchaseMessage(message)
        setMessageType("error")
        return { success: false, message }
      }

      // Check wallet connection
      if (!walletAddress || !web3 || !contract) {
        const message = "Debes conectar tu wallet para realizar compras"
        setPurchaseMessage(message)
        setMessageType("error")
        return { success: false, message }
      }

      // Check if song is already purchased
      if (purchasedSongs.has(songId)) {
        const message = "Ya has comprado esta canción"
        setPurchaseMessage(message)
        setMessageType("info")
        return { success: false, message }
      }

      // Check wallet balance using existing smart contract integration
      const hasBalance = await checkBalance(price)
      if (!hasBalance) {
        const message = "Insufficient funds in wallet"
        setPurchaseMessage(message)
        setMessageType("error")
        return { success: false, message }
      }

      // Simulate purchase transaction using existing contract
      console.log(`Purchasing song ${songId} for ${price} ETH to artist ${artistWallet}`)
      console.log('Using contract:', contract.options.address)
      
      // Add artificial delay to simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mark song as purchased
      const newPurchasedSongs = new Set(purchasedSongs)
      newPurchasedSongs.add(songId)
      setPurchasedSongs(newPurchasedSongs)
      
      // Save to localStorage
      try {
        localStorage.setItem('purchasedSongs', JSON.stringify(Array.from(newPurchasedSongs)))
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }

      const message = "Purchase successful"
      setPurchaseMessage(message)
      setMessageType("success")
      return { success: true, message }

    } catch (error) {
      console.error('Purchase error:', error)
      const message = "Error durante la compra. Inténtalo de nuevo"
      setPurchaseMessage(message)
      setMessageType("error")
      return { success: false, message }
    } finally {
      setIsPurchasing(false)
    }
  }, [purchasedSongs, web3, contract, checkBalance])

  // Load purchased songs from localStorage on hook initialization
  const loadPurchasedSongs = useCallback(() => {
    try {
      const stored = localStorage.getItem('purchasedSongs')
      if (stored) {
        const purchasedArray = JSON.parse(stored)
        setPurchasedSongs(new Set(purchasedArray))
      }
    } catch (error) {
      console.error('Error loading purchased songs:', error)
    }
  }, [])

  // Check if a song is purchased
  const isSongPurchased = useCallback((songId: string): boolean => {
    return purchasedSongs.has(songId)
  }, [purchasedSongs])

  return {
    purchaseSong,
    isPurchasing,
    purchasedSongs,
    isSongPurchased,
    loadPurchasedSongs,
    checkBalance,
    purchaseMessage,
    messageType,
    clearMessage: () => setPurchaseMessage("")
  }
}
