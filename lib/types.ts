export interface Artist {
  id: string
  name: string
  wallet_address: string
  bio?: string
  photo_hash?: string // IPFS hash for later
  created_at: Date
}

export interface Song {
  id: number
  title: string
  artist_id: number
  artist_name: string
  artist_wallet: string
  price: number // Price in ETH
  audio_hash?: string // IPFS/Arweave hash for later
  duration?: number
  plays: number
  created_at: Date
  isPurchased?: boolean
}

export interface PlaybackState {
  currentSong: Song | null
  isPlaying: boolean
  isLoading: boolean
  progress: number
}

export interface UserRole {
  type: "listener" | "artist"
  artist_id?: string
}
