'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, ChevronLeft, ChevronRight } from 'lucide-react'

interface VideoPlayerProps {
  src: string
  title: string
  onComplete?: () => void
  onProgress?: (progress: number) => void
  resumeKey?: string
}

export default function VideoPlayer({ src, title, onComplete, onProgress, resumeKey }: VideoPlayerProps) {
  const isYouTube = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(src)
  const toYouTubeEmbed = (url: string) => {
    try {
      const u = new URL(url)
      // youtu.be/<id>
      if (u.hostname.includes('youtu.be')) {
        const id = u.pathname.replace('/', '')
        return `https://www.youtube.com/embed/${id}`
      }
      // youtube.com/watch?v=<id>
      if (u.searchParams.has('v')) {
        const id = u.searchParams.get('v') || ''
        return `https://www.youtube.com/embed/${id}`
      }
      // Already embed or other path
      if (u.pathname.startsWith('/embed/')) return url
      return url
    } catch {
      return url
    }
  }

  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [videoduration, setVideoDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const lastSavedRef = useRef(0)
  const storageKey = `video_progress:${resumeKey || src}`

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => {
      setCurrentTime(video.currentTime)
      const progressPercent = (video.currentTime / video.duration) * 100
      setProgress(progressPercent)
      onProgress?.(progressPercent)

      // Persist progress every ~5s
      if (!isYouTube) {
        if (video.currentTime - lastSavedRef.current >= 5) {
          try {
            localStorage.setItem(storageKey, JSON.stringify({ time: video.currentTime, duration: video.duration, updatedAt: Date.now() }))
            lastSavedRef.current = video.currentTime
          } catch {}
        }
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onComplete?.()
      try { localStorage.removeItem(storageKey) } catch {}
    }

    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration)
      if (!isYouTube) {
        try {
          const raw = localStorage.getItem(storageKey)
          if (raw) {
            const saved = JSON.parse(raw) as { time?: number; duration?: number }
            if (typeof saved.time === 'number' && saved.time > 0 && saved.time < video.duration - 2) {
              video.currentTime = saved.time
            }
          }
        } catch {}
      }
    }

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [onComplete, onProgress, isYouTube, storageKey])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const time = (parseFloat(e.target.value) / 100) * video.duration
    video.currentTime = time
    setCurrentTime(time)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = parseFloat(e.target.value)
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const skip = (seconds: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds))
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Note: saved progress is cleared by the 'ended' event's onComplete handler

  return (
    <div 
      className="relative bg-gradient-to-br from-green-950 via-emerald-900 to-teal-900 rounded-2xl overflow-hidden group border border-emerald-800/40 shadow-2xl"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Media Element */}
      {isYouTube ? (
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          <iframe
            src={toYouTubeEmbed(src)}
            title={title}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full"
        poster="/api/placeholder/800/450"
        onClick={togglePlay}
          controls={false}
      />
      )}

      {/* Video Overlay */}
      {!isYouTube && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <button
            onClick={togglePlay}
            className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200 transform hover:scale-110"
          >
            <Play className="w-8 h-8 text-gray-800 ml-1" />
          </button>
        </div>
      )}

      {/* Controls */}
      {!isYouTube && (
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-950/90 to-transparent p-4 transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 bg-emerald-800/60 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #10b981 ${progress}%, #064e3b ${progress}%, #064e3b 100%)`
            }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-green-300 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            {/* Skip Buttons */}
            <button
              onClick={() => skip(-10)}
              className="text-white hover:text-green-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => skip(10)}
              className="text-white hover:text-green-300 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Time Display */}
            <span className="text-green-100 text-sm">
              {formatTime(currentTime)} / {formatTime(videoduration)}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="text-white hover:text-green-300 transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-emerald-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-green-300 transition-colors"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Video Title */}
      <div className="absolute top-4 left-4">
        <h3 className="text-white text-lg font-semibold bg-emerald-900/70 backdrop-blur px-3 py-1 rounded">
          {title}
        </h3>
      </div>

      {/* Progress Indicator */}
      {!isYouTube && (
      <div className="absolute top-4 right-4">
        <div className="bg-emerald-900/70 backdrop-blur px-3 py-1 rounded text-green-100 text-sm">
          {Math.round(progress)}% Complete
        </div>
        </div>
      )}

      {/* Ambient animated accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-10 w-24 h-24 bg-green-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -right-10 bottom-10 w-28 h-28 bg-emerald-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }}></div>
      </div>
    </div>
  )
}
