export type PlaceStatus = 'active' | 'coming-soon' | 'archived'
export type ShotPointStatus = 'active' | 'coming-soon' | 'archived'

export interface Place {
  id: string
  name: string
  province: string
  country: string
  description: string
  image: string
  status: PlaceStatus
  address: string | null
  latitude: number | null
  longitude: number | null
}

export interface ShotPoint {
  id: string
  placeId: string
  name: string
  direction: string
  description: string
  captureHint: string
  status: ShotPointStatus
}

export interface ReferenceFrame {
  id: string
  shotPointId: string
  name: string
  imageUrl: string
  fit: 'contain' | 'cover'
  opacity: number
  isActive: boolean
}
