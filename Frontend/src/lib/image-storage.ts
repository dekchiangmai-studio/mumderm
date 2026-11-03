import { supabase } from './supabase'
import type { StoredImage } from '../types/submission'

const uploadUrl = import.meta.env.VITE_GAS_UPLOAD_URL
const maxFileSize = 8 * 1024 * 1024
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

function requireUploadUrl() {
  if (!uploadUrl) {
    throw new Error('ยังไม่ได้ตั้งค่า VITE_GAS_UPLOAD_URL')
  }
  return uploadUrl
}

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('ไม่สามารถอ่านไฟล์ภาพได้'))
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') {
        reject(new Error('รูปแบบไฟล์ภาพไม่ถูกต้อง'))
        return
      }
      resolve(result.split(',')[1] ?? '')
    }
    reader.readAsDataURL(file)
  })
}

export async function uploadImage(
  file: File,
  metadata: { placeId: string; shotPointId: string; capturedAt: string },
): Promise<StoredImage> {
  if (!allowedTypes.has(file.type)) {
    throw new Error('รองรับเฉพาะไฟล์ JPG, PNG หรือ WebP')
  }
  if (file.size > maxFileSize) {
    throw new Error('ไฟล์ภาพต้องมีขนาดไม่เกิน 8 MB')
  }

  if (!supabase) throw new Error('Supabase is not configured.')
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session?.access_token) throw new Error('กรุณาเข้าสู่ระบบอีกครั้ง')

  const response = await fetch(requireUploadUrl(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessToken: session.access_token,
      placeId: metadata.placeId,
      shotPointId: metadata.shotPointId,
      capturedAt: metadata.capturedAt,
      fileName: file.name,
      mimeType: file.type,
      data: await readAsBase64(file),
    }),
  })

  const payload = (await response.json()) as {
    ok?: boolean
    error?: string
    url?: string
    fileId?: string
  }

  if (!response.ok || !payload.ok || !payload.url) {
    throw new Error(payload.error ?? 'อัปโหลดภาพไม่สำเร็จ')
  }

  return { url: payload.url, fileId: payload.fileId ?? null }
}
