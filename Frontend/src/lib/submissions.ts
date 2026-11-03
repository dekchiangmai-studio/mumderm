import { supabase } from './supabase'
import type { CreateSubmissionInput, Submission } from '../types/submission'

export async function getMySubmissions(userId: string): Promise<Submission[]> {
  if (!supabase) throw new Error('Supabase is not configured.')

  const { data, error } = await supabase
    .from('submissions')
    .select(
      'id, user_id, place_id, shot_point_id, image_url, storage_provider, external_file_id, captured_at, submitted_at, latitude, longitude, gps_accuracy_meters, status, review_note, reviewed_by, reviewed_at',
    )
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    placeId: row.place_id,
    shotPointId: row.shot_point_id,
    imageUrl: row.image_url,
    storageProvider: row.storage_provider,
    externalFileId: row.external_file_id,
    capturedAt: row.captured_at,
    submittedAt: row.submitted_at,
    latitude: row.latitude,
    longitude: row.longitude,
    gpsAccuracyMeters: row.gps_accuracy_meters,
    status: row.status,
    reviewNote: row.review_note,
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
  }))
}

export async function createSubmission(
  input: CreateSubmissionInput,
): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.')

  const { error } = await supabase.from('submissions').insert({
    user_id: input.userId,
    place_id: input.placeId,
    shot_point_id: input.shotPointId,
    image_url: input.imageUrl,
    storage_provider: input.storageProvider,
    external_file_id: input.externalFileId,
    captured_at: input.capturedAt,
    status: 'pending',
  })

  if (error) throw error
}
