"use client"

import { useState, useCallback } from "react"
import { useWeb3 } from "@/hooks/web3"
import { toast } from "@/hooks/use-toast"
import type { Song } from "@/lib/types"

interface UploadResult {
  success: boolean
  message: string
  songId?: number
  transactionHash?: string
}

interface UseSongUploadReturn {
  songs: Song[]
  uploadSong: (songData: Omit<Song, "id" | "created_at" | "plays" | "artist_id">) => Promise<UploadResult>
  isLoading: boolean
  error: string | null
  uploadMessage: string
  messageType: "success" | "error" | "info"
  clearMessage: () => void
}

export function useSongUpload(): UseSongUploadReturn {
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadMessage, setUploadMessage] = useState<string>("")
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info")
  const { web3, contract, walletAddress } = useWeb3()

  const uploadSong = useCallback(async (
    songData: Omit<Song, "id" | "created_at" | "plays" | "artist_id">
  ): Promise<UploadResult> => {
    setIsLoading(true)
    setError(null)
    setUploadMessage("")

    try {
      // Check if user is authenticated
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
      const userType = localStorage.getItem('userType')
      
      if (!isAuthenticated || userType !== 'artist') {
        const message = "Debes iniciar sesión como artista para subir canciones"
        setUploadMessage(message)
        setMessageType("error")
        return { success: false, message }
      }

      // Check wallet connection
      if (!walletAddress || !web3 || !contract) {
        const message = "Debes conectar tu wallet para subir canciones"
        setUploadMessage(message)
        setMessageType("error")
        return { success: false, message }
      }

      // Use the wallet address stored in localStorage
      const storedWallet = typeof window !== 'undefined' ? localStorage.getItem('walletAddressX') : null
      const actualWallet = storedWallet || walletAddress

      console.log('🎵 Uploading song to contract...')
      console.log('Artist wallet:', actualWallet)
      console.log('Song data:', songData)

      // Check if window.ethereum is available (Rabby wallet)
      if (typeof window === 'undefined' || !window.ethereum) {
        const message = "❌ Rabby wallet not connected. Please connect your wallet first."
        setUploadMessage(message)
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
        setUploadMessage(message)
        setMessageType("error")
        return { success: false, message }
      }

      // Check if artist is registered in the contract
      try {
        const isArtist = await contract.methods.isArtist(actualWallet).call()
        if (!isArtist) {
          console.log('🎨 Artist not registered, registering first...')
          setUploadMessage("🔄 Registering as artist...")
          setMessageType("info")
          
          // Create Web3 instance with wallet provider
          const walletWeb3 = new (await import('web3')).default(window.ethereum)
          const walletContract = new walletWeb3.eth.Contract(
            contract.options.jsonInterface,
            contract.options.address
          )
          
          // Register artist first
          await walletContract.methods.registerArtist()
            .send({ from: actualWallet })
            .on('transactionHash', function(hash: string){
              console.log("🔄 Artist registration submitted with hash:", hash);
              setUploadMessage("🔄 Artist registration submitted. Waiting for confirmation...");
              setMessageType("info");
            })
        }
      } catch (artistError) {
        console.error('❌ Failed to check/register artist:', artistError)
        const message = "❌ Could not verify artist registration."
        setUploadMessage(message)
        setMessageType("error")
        return { success: false, message }
      }

      // Convert price from ETH to Wei for the contract
      const priceInWei = web3.utils.toWei(songData.price.toString(), 'ether')
      
      console.log('💰 Song price:', songData.price, 'ETH')
      console.log('💰 Price in wei:', priceInWei)

      // Create Web3 instance with wallet provider for transaction
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

      setUploadMessage("🔄 Uploading song to blockchain...")
      setMessageType("info")

      // Execute uploadSong transaction
      const receipt = await walletContract.methods.uploadSong(priceInWei)
        .send({ 
          from: actualWallet,
          gasPrice: bufferedGasPrice,
          gas: '200000' // Higher gas limit for upload
        })
        .on('transactionHash', function(hash: string){
          console.log("🔄 Song upload submitted with hash:", hash);
          setUploadMessage("🔄 Song upload submitted. Waiting for confirmation...");
          setMessageType("info");
        })
        .on('receipt', function(receipt: any){
          console.log("✅ Song upload confirmed!");
        })
        .on('error', function(error: any) {
          console.error("❌ Upload error:", error);
          throw error;
        })

      console.log('✅ Song upload successful!')
      console.log('Transaction hash:', receipt.transactionHash)
      console.log('Block number:', receipt.blockNumber)

      // Get the song ID from the transaction receipt or contract
      let songId: number
      try {
        const totalSongs = await contract.methods.getTotalSongs().call()
        songId = Number(totalSongs) - 1 // Latest song ID (0-indexed)
        console.log('🎵 New song ID:', songId)
      } catch (idError) {
        console.error('Could not get song ID:', idError)
        songId = 0 // Fallback
      }

      // Create the song object for local state
      const newSong: Song = {
        ...songData,
        id: songId,
        artist_id: songId, // Use songId as artist_id for now
        plays: 0,
        created_at: new Date(),
        isPurchased: false
      }

      setSongs((prev) => [...prev, newSong])

      const message = "✅ Song uploaded successfully to blockchain!"
      setUploadMessage(message)
      setMessageType("success")
      
      return {
        success: true,
        message,
        songId,
        transactionHash: receipt.transactionHash
      }

    } catch (err: any) {
      console.error('❌ Song upload failed:', err)
      
      let message = "❌ Song upload failed. Please try again."
      
      // Handle specific error types
      if (err.code === 4001) {
        message = "❌ Transaction cancelled by user."
      } else if (err.message?.includes('insufficient funds')) {
        message = "❌ Insufficient funds for this transaction."
      } else if (err.message?.includes('gas')) {
        message = "❌ Transaction failed due to gas issues. Please try again."
      } else if (err.message?.includes('TransactionBlockTimeoutError') || err.message?.includes('timeout')) {
        message = "⏱️ Transaction is taking longer than expected. It may still be processing. Check your wallet for updates."
      } else if (err.message?.includes('nonce')) {
        message = "❌ Transaction nonce error. Please refresh and try again."
      }
      
      setError(message)
      setUploadMessage(message)
      setMessageType("error")
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }, [web3, contract, walletAddress])

  const clearMessage = useCallback(() => {
    setUploadMessage("")
    setError(null)
  }, [])

  return {
    songs,
    uploadSong,
    isLoading,
    error,
    uploadMessage,
    messageType,
    clearMessage
  }
}
