export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface CreateSubmissionInput {
  userId: string
  placeId: string
  shotPointId: string
  imageUrl: string
  storageProvider: string
  externalFileId: string | null
  capturedAt: string
}

export interface StoredImage {
  url: string
  fileId: string | null
}

export interface Submission {
  id: string
  userId: string
  placeId: string
  shotPointId: string
  imageUrl: string | null
  storageProvider: string | null
  externalFileId: string | null
  capturedAt: string | null
  submittedAt: string
  latitude: number | null
  longitude: number | null
  gpsAccuracyMeters: number | null
  status: SubmissionStatus
  reviewNote: string | null
  reviewedBy: string | null
  reviewedAt: string | null
}
