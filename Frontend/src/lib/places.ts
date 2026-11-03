import { supabase } from './supabase'
import type { Place, ReferenceFrame, ShotPoint } from '../types/place'

export function resolveAssetUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (/^(?:https?:|\/\/|data:|blob:)/i.test(url)) {
    return url
  }
  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  const cleanPath = url.startsWith('/') ? url.slice(1) : url
  return `${normalizedBase}${cleanPath}`
}

export class DataAccessError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DataAccessError'
  }
}

function requireSupabase() {
  if (!supabase) {
    throw new DataAccessError(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    )
  }

  return supabase
}

export async function getPlaces(): Promise<Place[]> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('places')
    .select(
      'id, name, province, country, description, image_url, status, address, latitude, longitude',
    )
    .order('name')

  if (error) throw new DataAccessError(error.message)

  return (data ?? []).map(mapPlace)
}

export async function getPlaceById(id: string): Promise<Place | null> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('places')
    .select(
      'id, name, province, country, description, image_url, status, address, latitude, longitude',
    )
    .eq('id', id)
    .maybeSingle()

  if (error) throw new DataAccessError(error.message)

  return data ? mapPlace(data) : null
}

export async function getShotPointsByPlaceId(
  placeId: string,
): Promise<ShotPoint[]> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('shot_points')
    .select('id, place_id, name, direction, description, capture_hint, status')
    .eq('place_id', placeId)
    .order('name')

  if (error) throw new DataAccessError(error.message)

  return (data ?? []).map(mapShotPoint)
}

export async function getShotPointById(id: string): Promise<ShotPoint | null> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('shot_points')
    .select('id, place_id, name, direction, description, capture_hint, status')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new DataAccessError(error.message)

  return data ? mapShotPoint(data) : null
}

export async function getReferenceFramesByShotPointId(
  shotPointId: string,
): Promise<ReferenceFrame[]> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('reference_frames')
    .select('id, shot_point_id, name, image_url, fit, opacity, is_active')
    .eq('shot_point_id', shotPointId)
    .eq('is_active', true)
    .order('created_at')

  if (error) throw new DataAccessError(error.message)

  return (data ?? []).map(mapReferenceFrame)
}

function mapPlace(row: Record<string, unknown>): Place {
  return {
    id: row.id as string,
    name: row.name as string,
    province: row.province as string,
    country: row.country as string,
    description: row.description as string,
    image: row.image_url as string,
    status: row.status as Place['status'],
    address: row.address as string | null,
    latitude: row.latitude as number | null,
    longitude: row.longitude as number | null,
  }
}

function mapShotPoint(row: Record<string, unknown>): ShotPoint {
  return {
    id: row.id as string,
    placeId: row.place_id as string,
    name: row.name as string,
    direction: row.direction as string,
    description: row.description as string,
    captureHint: row.capture_hint as string,
    status: row.status as ShotPoint['status'],
  }
}

function mapReferenceFrame(row: Record<string, unknown>): ReferenceFrame {
  return {
    id: row.id as string,
    shotPointId: row.shot_point_id as string,
    name: row.name as string,
    imageUrl: resolveAssetUrl(row.image_url as string),
    fit: row.fit as ReferenceFrame['fit'],
    opacity: Number(row.opacity ?? 0.65),
    isActive: row.is_active as boolean,
  }
}
