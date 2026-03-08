'use client'

import { useEffect, useRef } from 'react'

export default function StarfieldCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = window.innerWidth
    let h = window.innerHeight
    canvas.width = w
    canvas.height = h

    // 200 stars with z-depth for perspective effect
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * w,
      size: Math.random() * 1.6 + 0.4,
    }))

    let raf: number

    function draw() {
      ctx.clearRect(0, 0, w, h)

      for (const s of stars) {
        // Move star toward viewer
        s.z -= 1.4
        if (s.z <= 0) {
          s.x = Math.random() * w
          s.y = Math.random() * h
          s.z = w
        }

        const progress = 1 - s.z / w
        const sx = (s.x - w / 2) * (w / s.z) + w / 2
        const sy = (s.y - h / 2) * (w / s.z) + h / 2
        const sr = Math.max(0.15, progress * s.size * 2.2)
        const alpha = Math.min(0.9, progress * 1.1)

        // Blue-white tinted stars
        const blue = Math.floor(200 + progress * 55)
        ctx.beginPath()
        ctx.arc(sx, sy, sr, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${180 + Math.floor(progress * 40)},${190 + Math.floor(progress * 40)},${blue},${alpha})`
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    draw()

    const onResize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w
      canvas.height = h
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className="starfield-canvas"
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
