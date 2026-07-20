export async function compressImage(file: File, maxWidth = 1600, quality = 0.8): Promise<File> {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxWidth / bitmap.width)
    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width * scale
    canvas.height = bitmap.height * scale

    const ctx = canvas.getContext('2d')!
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

    const blob: Blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality)
    )

    return new File([blob], file.name, { type: 'image/jpeg' })
}