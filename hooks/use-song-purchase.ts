"use client"

import { useState, useCallback, useEffect } from "react"
import { useWeb3 } from "@/hooks/web3"
import { getArbitrumBalance } from "@/utils/arbitrumBalance"
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
    // Get listener wallet from localStorage (same as rest of app)
    const listenerWallet = typeof window !== 'undefined' ? localStorage.getItem('walletAddressX') : null

    if (!listenerWallet) {
      console.log('No listener wallet address available')
      return false
    }

    try {
      const balanceResult = await getArbitrumBalance(listenerWallet)
      const balanceEth = parseFloat(balanceResult.eth)

      console.log(`🔍 checkBalance function:`)
      console.log(`   - Wallet: ${listenerWallet}`)
      console.log(`   - Balance: ${balanceEth} ETH`)
      console.log(`   - Required: ${requiredAmount} ETH`)
      console.log(`   - Has sufficient: ${balanceEth >= requiredAmount}`)

      return balanceEth >= requiredAmount
    } catch (error) {
      console.error('Error checking balance:', error)
      return false
    }
  }, [])

  const purchaseSong = useCallback(async (
    songId: number,
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

      // Use the connected wallet address from useWeb3 hook
      if (!walletAddress || !web3 || !contract) {
        const message = "Debes conectar tu wallet para realizar compras"
        setPurchaseMessage(message)
        setMessageType("error")
        return { success: false, message }
      }

      // Use the wallet address stored in localStorage (same as the rest of the app)
      const storedWallet = typeof window !== 'undefined' ? localStorage.getItem('walletAddressX') : null
      const actualWallet = storedWallet || walletAddress

      console.log('🔍 Debug info:')
      console.log('walletAddress from hook:', walletAddress)
      console.log('storedWallet from localStorage:', storedWallet)
      console.log('actualWallet being used:', actualWallet)

      // Check if song is already purchased
      if (purchasedSongs.has(songId.toString())) {
        const message = "Ya has comprado esta canción"
        setPurchaseMessage(message)
        setMessageType("info")
        return { success: false, message }
      }

      // Comprehensive balance check including gas costs
      try {
        console.log('🔍 Checking balance for wallet:', actualWallet)
        console.log('🔍 Price parameter:', price, 'type:', typeof price)

        const balanceResult = await getArbitrumBalance(actualWallet)
        const currentBalance = parseFloat(balanceResult.eth)
        const estimatedGasCost = 0.002 // Conservative estimate for gas costs in ETH
        const totalRequired = price + estimatedGasCost

        console.log(`💰 Balance check details:`)
        console.log(`   - Current balance: ${currentBalance} ETH`)
        console.log(`   - Song price: ${price} ETH`)
        console.log(`   - Gas estimate: ${estimatedGasCost} ETH`)
        console.log(`   - Total required: ${totalRequired} ETH`)
        console.log(`   - Balance === 0: ${currentBalance === 0}`)
        console.log(`   - Balance < required: ${currentBalance < totalRequired}`)

        if (currentBalance === 0) {
          const message = `❌ Wallet has no funds. Please add Arbitrum Sepolia ETH to your wallet: ${actualWallet}`
          setPurchaseMessage(message)
          setMessageType("error")
          return { success: false, message }
        }

        if (currentBalance < totalRequired) {
          const message = `❌ Insufficient balance. Need ${totalRequired.toFixed(4)} ETH (${price} + ~${estimatedGasCost} gas), have ${currentBalance.toFixed(4)} ETH`
          setPurchaseMessage(message)
          setMessageType("error")
          return { success: false, message }
        }
      } catch (balanceError) {
        console.error('Balance check error:', balanceError)
        const message = "❌ Unable to verify balance. Please check your wallet connection."
        setPurchaseMessage(message)
        setMessageType("error")
        return { success: false, message }
      }

      // Execute real blockchain transaction
      console.log(`🔄 Executing real purchase: Song ${songId} for ${price} ETH`)
      console.log(`From listener: ${walletAddress}`)
      console.log(`To artist: ${artistWallet}`)
      console.log('Using contract:', contract.options.address)

      // Convert price from ETH to Wei for the transaction
      const priceInWei = web3.utils.toWei(price.toString(), 'ether')

      // Check if window.ethereum is available (Rabby wallet)
      if (typeof window === 'undefined' || !window.ethereum) {
        const message = "❌ Rabby wallet not connected. Please connect your wallet first."
        setPurchaseMessage(message)
        setMessageType("error")
        return { success: false, message }
      }

      // Check and switch to Arbitrum Sepolia network if needed
      const targetChainId = '0x66eee' // 421614 in hex
      try {
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' })
        console.log('🌐 Current network:', currentChainId, 'Target:', targetChainId)

        if (currentChainId !== targetChainId) {
          console.log('🔄 Adding and switching to Arbitrum Sepolia...')
          // First add the network, then switch to it
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: targetChainId,
              chainName: 'Arbitrum Sepolia',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
              blockExplorerUrls: ['https://sepolia.arbiscan.io/'],
            }],
          })
        }
      } catch (networkError) {
        console.error('❌ Network switching failed:', networkError)
        const message = "❌ Please switch to Arbitrum Sepolia network in your wallet."
        setPurchaseMessage(message)
        setMessageType("error")
        return { success: false, message }
      }

      // First check total songs in contract
      let totalSongs
      try {
        totalSongs = await contract.methods.getTotalSongs().call()
        console.log('🎵 Total songs in contract:', totalSongs.toString())
      } catch (error) {
        console.error('❌ Failed to get total songs:', error)
        const message = "❌ Could not check contract songs."
        setPurchaseMessage(message)
        setMessageType("error")
        return { success: false, message }
      }

      // Check if contract has any songs
      if (Number(totalSongs) === 0) {
        const message = "❌ No songs available in contract. Upload songs first."
        setPurchaseMessage(message)
        setMessageType("error")
        return { success: false, message }
      }

      // Use the actual songId parameter (convert to BigInt for uint256)
      const songIdNumber = BigInt(songId)
      console.log('🎵 Attempting to purchase song ID:', songIdNumber.toString())
      console.log('🎵 Song ID type:', typeof songIdNumber)

      // Verify song ID is within range
      if (songIdNumber >= BigInt(totalSongs)) {
        const message = `❌ Song ID ${songIdNumber} doesn't exist. Available: 0-${Number(totalSongs) - 1}`
        setPurchaseMessage(message)
        setMessageType("error")
        return { success: false, message }
      }

      console.log('💰 Song price:', price, 'ETH')
      console.log('💰 Price in wei:', priceInWei)

      // Execute transaction directly without gas estimation (let Rabby handle it)
      console.log('🔄 Executing transaction with Rabby wallet...')

      // Create Web3 instance with wallet provider
      const walletWeb3 = new (await import('web3')).default(window.ethereum)
      const walletContract = new walletWeb3.eth.Contract(
        contract.options.jsonInterface,
        contract.options.address
      )

      // Get current gas price and add buffer
      const gasPrice = await walletWeb3.eth.getGasPrice()
      const bufferedGasPrice = Math.floor(Number(gasPrice) * 1.2).toString()

      console.log('⛽ Gas configuration:')
      console.log('   - Base gas price:', gasPrice)
      console.log('   - Buffered gas price:', bufferedGasPrice)

      const receipt = await walletContract.methods.playSong(songIdNumber)
        .send({
          from: actualWallet,
          value: priceInWei, // Use the provided price
          gasPrice: bufferedGasPrice,
          gas: '100000' // Set explicit gas limit
        })
        .on('transactionHash', function (hash: string) {
          console.log("🔄 Transaction submitted with hash:", hash);
          setPurchaseMessage("🔄 Transaction submitted. Waiting for confirmation...");
          setMessageType("info");
        })
        .on('receipt', function (receipt: any) {
          console.log("✅ Transaction confirmed!");
        })
        .on('error', function (error: any) {
          console.error("❌ Transaction error:", error);
          throw error;
        })

      console.log('✅ Transaction successful!')
      console.log('Transaction hash:', receipt.transactionHash)
      console.log('Block number:', receipt.blockNumber)

      // Mark song as purchased locally
      const newPurchasedSongs = new Set(purchasedSongs)
      newPurchasedSongs.add(songId.toString())
      setPurchasedSongs(newPurchasedSongs)

      // Save to localStorage
      try {
        localStorage.setItem('purchasedSongs', JSON.stringify(Array.from(newPurchasedSongs)))
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }

      const message = "✅ Purchase successful"
      setPurchaseMessage(message)
      setMessageType("success")
      return {
        success: true,
        message,
        transactionHash: receipt.transactionHash
      }

    } catch (error: any) {
      console.error('❌ Purchase failed:', error)

      let message = "❌ Purchase failed. Please try again."

      // Handle specific error types
      if (error.code === 4001) {
        message = "❌ Transaction cancelled by user."
      } else if (error.message?.includes('insufficient funds')) {
        message = "❌ Insufficient funds for this transaction."
      } else if (error.message?.includes('gas')) {
        message = "❌ Transaction failed due to gas issues. Please try again."
      } else if (error.message?.includes('TransactionBlockTimeoutError') || error.message?.includes('timeout')) {
        message = "⏱️ Transaction is taking longer than expected. It may still be processing. Check your wallet for updates."
      } else if (error.message?.includes('nonce')) {
        message = "❌ Transaction nonce error. Please refresh and try again."
      }

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
  const isSongPurchased = useCallback((songId: number): boolean => {
    return purchasedSongs.has(songId.toString())
  }, [purchasedSongs])

  // Initialize purchased songs on mount
  useEffect(() => {
    loadPurchasedSongs()
  }, [loadPurchasedSongs])

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