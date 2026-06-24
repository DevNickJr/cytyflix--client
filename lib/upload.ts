import imageCompression from "browser-image-compression"
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"
import { storage } from "./firebase"

export async function compressImage(
  file: File,
  maxSizeMB = 1,
  maxWidthOrHeight = 1920
): Promise<File> {
  return imageCompression(file, {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    alwaysKeepResolution: false
  })
}

export async function uploadImage(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const compressed = await compressImage(file)
  const storageRef = ref(storage, path)
  const uploadTask = uploadBytesResumable(storageRef, compressed)

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        onProgress?.(progress)
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(url)
      }
    )
  })
}

export async function uploadImages(
  files: File[],
  pathPrefix: string,
  onProgress?: (index: number, progress: number) => void
): Promise<string[]> {
  const promises = files.map((file, index) => {
    const path = `${pathPrefix}/${Date.now()}_${index}_${file.name}`
    return uploadImage(file, path, (p) => onProgress?.(index, p))
  })
  return Promise.all(promises)
}

export async function deleteImage(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url)
    await deleteObject(storageRef)
  } catch (error) {
    console.error("Failed to delete image:", error)
  }
}
