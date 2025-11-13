import React, { useCallback, useState } from 'react'
import { Upload, X, Image } from 'lucide-react'
import { useAvatarStore } from '../store/avatarStore'

export function ImageUploader() {
  const { referenceImage, setReferenceImage } = useAvatarStore()
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setReferenceImage(result)
      }
      reader.readAsDataURL(file)
    }
  }, [setReferenceImage])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  const removeImage = useCallback(() => {
    setReferenceImage(null)
  }, [setReferenceImage])

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Image className="w-5 h-5" />
        참조 이미지 업로드 (선택사항)
      </h3>
      
      {referenceImage ? (
        <div className="relative">
          <img
            src={referenceImage}
            alt="참조 이미지"
            className="w-full h-48 object-cover rounded-lg shadow-md"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="mt-3 text-sm text-gray-600">
            이 이미지를 참조하여 아바타가 생성됩니다.
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
            isDragging
              ? 'border-primary-400 bg-primary-50'
              : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            이미지를 드래그하거나 클릭하여 업로드
          </p>
          <p className="text-sm text-gray-500">
            JPG, PNG, GIF 파일 지원 (최대 10MB)
          </p>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      )}
    </div>
  )
}
