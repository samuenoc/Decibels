export interface Artist {
  id: string
  name: string
  wallet_address: string
  bio?: string
  photo_hash?: string // IPFS hash for later
  created_at: Date
}

export interface Song {
  id: string
  title: string
  artist_id: string
  artist_name: string
  audio_hash?: string // IPFS/Arweave hash for later
  duration?: number
  plays: number
  created_at: Date
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
