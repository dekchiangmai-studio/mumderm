<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuth } from '../lib/auth'
import { uploadImage } from '../lib/image-storage'
import {
  getPlaceById,
  getReferenceFramesByShotPointId,
  getShotPointById,
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

const activeFrame = computed(() => referenceFrames.value[0] ?? null)

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
    cameraStream.value = await globalThis.navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: 'environment' } },
    })
    cameraStatus.value = 'active'
    if (videoElement.value) videoElement.value.srcObject = cameraStream.value
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
  const canvas = globalThis.document.createElement('canvas')
  canvas.width = videoElement.value.videoWidth
  canvas.height = videoElement.value.videoHeight
  canvas.getContext('2d')?.drawImage(videoElement.value, 0, 0)
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
        v-if="!previewUrl && cameraStatus === 'active'"
        ref="videoElement"
        class="capture-stage__video"
        autoplay
        muted
        playsinline
      ></video>
      <img v-if="previewUrl" :src="previewUrl" alt="ภาพตัวอย่างที่เลือก" />
      <div v-else-if="cameraStatus !== 'active'" class="capture-stage__empty">
        <span class="empty-state__mark">◎</span>
        <p>เลือกภาพจากกล้องหรือคลังภาพเพื่อเริ่ม</p>
      </div>
      <img
        v-if="(previewUrl || cameraStatus === 'active') && activeFrame"
        class="capture-stage__overlay"
        :src="activeFrame.imageUrl"
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
            : 'อนุญาตใช้กล้อง'
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
      <label class="primary-button capture-actions__file">
        <span aria-hidden="true">◎</span>
        ถ่ายภาพ / เลือกรูป
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
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
        เลือกใหม่
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
