import React, { useRef, useEffect } from 'react'

class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.timestamp = 0
  }
}

const Mousetrail = (props) => {
  const {
    height = 0,
    width = 0,
    color = 'rgb(152,236,60)',
    lineWidth = 4,
    maxAge = 160,
    ...other
  } = props

  const canvasRef = useRef(null)
  const pointsRef = useRef([])
  const requestRef = useRef()
  const starttimeRef = useRef(null)

  useEffect(() => {
    const handleMovement = ({ clientX, clientY }) => {
      if (!canvasRef?.current) {
        return
      }

      const x = clientX - canvasRef.current.offsetLeft
      const y = clientY - canvasRef.current.offsetTop

      const point = new Point(x, y)
      pointsRef.current.push(point)
    }

    document.addEventListener('mousemove', handleMovement)

    return () => window.removeEventListener('mousemove', handleMovement)
  }, [])

  useEffect(() => {
    const animate = (timestamp) => {
      if (!canvasRef?.current) {
        return
      }

      if (!starttimeRef.current) {
        starttimeRef.current = timestamp
      }

      const ctx = canvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      for (let i = 0; i < pointsRef.current.length; i++) {
        const currentPoint = pointsRef.current[i]
        let previousPoint

        if (pointsRef.current[i - 1] !== undefined) {
          previousPoint = pointsRef.current[i - 1]
        } else {
          previousPoint = currentPoint
        }

        if (!currentPoint.timestamp) {
          currentPoint.timestamp = timestamp
        }

        const elapsed = timestamp - currentPoint.timestamp

        if (elapsed > maxAge) {
          pointsRef.current.shift()
        } else {
          ctx.lineJoin = 'round'
          ctx.lineWidth = lineWidth

          ctx.strokeStyle = color

          ctx.beginPath()

          ctx.moveTo(previousPoint.x, previousPoint.y)
          ctx.lineTo(currentPoint.x, currentPoint.y)

          ctx.stroke()
          ctx.closePath()
        }
      }

      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(requestRef.current)
  }, [color, lineWidth, maxAge])

  return (
    <canvas {...other} ref={canvasRef} height={height} width={width}></canvas>
  )
}

export default Mousetrail
