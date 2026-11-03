<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuth } from '../lib/auth'
import { uploadImage } from '../lib/image-storage'
import {
  getPlaceById,
  getReferenceFramesByShotPointId,
  getShotPointById,
  resolveAssetUrl,
} from '../lib/places'
import { createSubmission } from '../lib/submissions'
import type { Place, ReferenceFrame, ShotPoint } from '../types/place'

const route = useRoute()
const auth = useAuth()
const place = ref<Place | null>(null)
const shotPoint = ref<ShotPoint | null>(null)
const referenceFrames = ref<ReferenceFrame[]>([])
const selectedFile = ref<InstanceType<typeof globalThis.File> | null>(null)
const previewUrl = ref('')
const videoElement = ref<InstanceType<
  typeof globalThis.HTMLVideoElement
> | null>(null)
const cameraStream = ref<InstanceType<typeof globalThis.MediaStream> | null>(
  null,
)
const cameraStatus = ref<
  'idle' | 'requesting' | 'active' | 'denied' | 'unsupported'
>('idle')
const isLoading = ref(true)
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const activeFrame = computed(() => {
  if (referenceFrames.value.length > 0) {
    return referenceFrames.value[0]
  }
  if (shotPoint.value?.id === 'tha-phae-gate-main') {
    return {
      id: 'tha-phae-gate-main-reference',
      shotPointId: 'tha-phae-gate-main',
      name: 'กรอบอ้างอิงหลัก',
      imageUrl: resolveAssetUrl('/frames/tha-phae-gate-frame.png'),
      fit: 'cover' as const,
      opacity: 0.85,
      isActive: true,
    }
  }
  return null
})

const cameraMessage = computed(() => {
  if (cameraStatus.value === 'denied') {
    return 'ไม่สามารถใช้กล้องได้ กรุณาอนุญาตกล้องใน browser หรือเลือกรูปจากคลังภาพ'
  }
  if (cameraStatus.value === 'unsupported') {
    return 'อุปกรณ์นี้ไม่รองรับกล้องบนเว็บ กรุณาเลือกรูปจากคลังภาพ'
  }
  return ''
})

function stopCamera() {
  if (videoElement.value) {
    videoElement.value.srcObject = null
  }
  cameraStream.value?.getTracks().forEach((track) => track.stop())
  cameraStream.value = null
}

async function requestCamera() {
  errorMessage.value = ''
  if (!globalThis.navigator.mediaDevices?.getUserMedia) {
    cameraStatus.value = 'unsupported'
    return
  }

  cameraStatus.value = 'requesting'
  try {
    stopCamera()
    const stream = await globalThis.navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1920 },
        height: { ideal: 1440 },
      },
    })
    cameraStream.value = stream
    cameraStatus.value = 'active'
    await nextTick()
    if (videoElement.value) {
      videoElement.value.srcObject = stream
      try {
        await videoElement.value.play()
      } catch {
        // Handled by muted playsinline attributes
      }
    }
  } catch (error) {
    cameraStatus.value = 'denied'
    errorMessage.value =
      error instanceof globalThis.DOMException &&
      error.name === 'NotAllowedError'
        ? 'คุณไม่อนุญาตให้ใช้กล้อง กรุณาเปลี่ยน permission ใน browser หรือเลือกรูปจากคลังภาพ'
        : 'ไม่สามารถเปิดกล้องได้ กรุณาเลือกรูปจากคลังภาพแทน'
  }
}

function setPreview(file: InstanceType<typeof globalThis.File>) {
  if (previewUrl.value) globalThis.URL.revokeObjectURL(previewUrl.value)
  selectedFile.value = file
  previewUrl.value = globalThis.URL.createObjectURL(file)
  stopCamera()
  cameraStatus.value = 'idle'
}

function captureFromCamera() {
  if (!videoElement.value || cameraStatus.value !== 'active') return
  const video = videoElement.value
  const canvas = globalThis.document.createElement('canvas')
  canvas.width = video.videoWidth || 1280
  canvas.height = video.videoHeight || 720
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  canvas.toBlob(
    (blob) => {
      if (!blob) {
        errorMessage.value = 'ไม่สามารถบันทึกภาพจากกล้องได้'
        return
      }
      const file = new globalThis.File([blob], `capture-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      })
      setPreview(file)
    },
    'image/jpeg',
    0.92,
  )
}

function clearPreview() {
  if (previewUrl.value) globalThis.URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
  selectedFile.value = null
}

function onFileChange(event: globalThis.Event) {
  const input = event.target as globalThis.HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  errorMessage.value = ''
  successMessage.value = ''
  setPreview(file)
  input.value = ''
}

async function loadCaptureContext() {
  const placeId = route.params.placeId as string
  const shotPointId = route.params.shotPointId as string
  try {
    const [loadedPlace, loadedShotPoint] = await Promise.all([
      getPlaceById(placeId),
      getShotPointById(shotPointId),
    ])
    if (!loadedPlace || !loadedShotPoint) {
      errorMessage.value = 'ไม่พบข้อมูลจุดถ่ายนี้'
      return
    }
    if (loadedShotPoint.placeId !== loadedPlace.id) {
      errorMessage.value = 'จุดถ่ายนี้ไม่ได้อยู่ในสถานที่ที่เลือก'
      return
    }
    place.value = loadedPlace
    shotPoint.value = loadedShotPoint
    referenceFrames.value = await getReferenceFramesByShotPointId(shotPointId)
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'ไม่สามารถโหลดข้อมูลจุดถ่ายได้'
  } finally {
    isLoading.value = false
  }
}

async function submitImage() {
  if (!selectedFile.value || !place.value || !shotPoint.value || !auth.user)
    return
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''
  const capturedAt = new Date().toISOString()

  try {
    const storedImage = await uploadImage(selectedFile.value, {
      placeId: place.value.id,
      shotPointId: shotPoint.value.id,
      capturedAt,
    })
    await createSubmission({
      userId: auth.user.id,
      placeId: place.value.id,
      shotPointId: shotPoint.value.id,
      imageUrl: storedImage.url,
      storageProvider: 'google-drive',
      externalFileId: storedImage.fileId,
      capturedAt,
    })
    successMessage.value = 'ส่งภาพเรียบร้อยแล้ว สถานะปัจจุบันคือรอตรวจสอบ'
    clearPreview()
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'ส่งภาพไม่สำเร็จ กรุณาลองอีกครั้ง'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(loadCaptureContext)
onBeforeUnmount(() => {
  stopCamera()
  clearPreview()
})
</script>

<template>
  <div
    v-if="isLoading"
    class="section-shell page-view empty-state"
    aria-live="polite"
  >
    <span class="empty-state__mark">...</span>
    <h1>กำลังเตรียมกล้อง</h1>
  </div>
  <div
    v-else-if="errorMessage && !place"
    class="section-shell page-view empty-state"
    role="alert"
  >
    <span class="empty-state__mark">!</span>
    <h1>เปิดจุดถ่ายไม่สำเร็จ</h1>
    <p>{{ errorMessage }}</p>
    <RouterLink
      class="text-link"
      :to="`/places/${route.params.placeId}/shot-points/${route.params.shotPointId}`"
    >
      กลับไปที่จุดถ่าย
    </RouterLink>
  </div>
  <div
    v-else-if="place && shotPoint"
    class="section-shell page-view capture-page"
  >
    <RouterLink
      class="back-link back-link--dark"
      :to="`/places/${place.id}/shot-points/${shotPoint.id}`"
    >
      ← {{ shotPoint.name }}
    </RouterLink>
    <div class="page-intro capture-page__intro">
      <p class="eyebrow">Field capture</p>
      <h1>ส่งภาพมุมนี้</h1>
      <p>{{ shotPoint.captureHint }}</p>
    </div>

    <div
      class="capture-stage"
      :class="{
        'capture-stage--empty': !previewUrl && cameraStatus !== 'active',
      }"
    >
      <video
        v-show="!previewUrl && cameraStatus === 'active'"
        ref="videoElement"
        class="capture-stage__video"
        autoplay
        muted
        playsinline
        webkit-playsinline
      ></video>
      <img v-if="previewUrl" :src="previewUrl" alt="ภาพตัวอย่างที่เลือก" />
      <div v-else-if="cameraStatus !== 'active'" class="capture-stage__empty">
        <span class="empty-state__mark">◎</span>
        <p>กด "เปิดกล้องเล็งถ่ายภาพ" ด้านล่าง เพื่อดูภาพซ้อนและถ่ายภาพ</p>
      </div>
      <img
        v-if="activeFrame && (previewUrl || cameraStatus === 'active')"
        class="capture-stage__overlay"
        :src="resolveAssetUrl(activeFrame.imageUrl)"
        :alt="`${activeFrame.name} overlay`"
        :style="{ objectFit: activeFrame.fit, opacity: activeFrame.opacity }"
      />
      <span
        v-if="previewUrl || cameraStatus === 'active'"
        class="capture-stage__guide"
        aria-hidden="true"
      ></span>
    </div>

    <div class="capture-actions">
      <button
        v-if="cameraStatus !== 'active' && !previewUrl"
        class="primary-button"
        type="button"
        :disabled="cameraStatus === 'requesting'"
        @click="requestCamera"
      >
        <span aria-hidden="true">◉</span>
        {{
          cameraStatus === 'requesting'
            ? 'กำลังขอใช้กล้อง...'
            : 'เปิดกล้องเล็งถ่ายภาพ'
        }}
      </button>
      <button
        v-if="cameraStatus === 'active'"
        class="primary-button"
        type="button"
        @click="captureFromCamera"
      >
        <span aria-hidden="true">●</span>
        ถ่ายภาพ
      </button>
      <label v-if="!previewUrl" class="quiet-button capture-actions__file">
        <span aria-hidden="true">◎</span>
        เลือกรูปจากคลังภาพ
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          @change="onFileChange"
        />
      </label>
      <button
        v-if="previewUrl"
        class="quiet-button"
        type="button"
        :disabled="isSubmitting"
        @click="clearPreview"
      >
        ถ่าย / เลือกใหม่
      </button>
      <button
        v-if="previewUrl"
        class="primary-button"
        type="button"
        :disabled="isSubmitting"
        @click="submitImage"
      >
        {{ isSubmitting ? 'กำลังส่งภาพ...' : 'ส่งภาพนี้' }}
      </button>
    </div>
    <p v-if="cameraMessage" class="capture-page__camera-note" role="status">
      {{ cameraMessage }}
    </p>
    <p v-if="errorMessage" class="form-error" role="alert">
      {{ errorMessage }}
    </p>
    <p v-if="successMessage" class="form-success" role="status">
      {{ successMessage }}
    </p>
    <p class="capture-page__note">
      รองรับ JPG, PNG และ WebP ขนาดไม่เกิน 8 MB · ภาพจะถูกส่งเป็นสถานะรอตรวจสอบ
    </p>
    <RouterLink v-if="successMessage" class="text-link" to="/my-submissions"
      >ดูภาพที่ส่งแล้ว</RouterLink
    >
  </div>
</template>
