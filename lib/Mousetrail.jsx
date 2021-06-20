import { useRef, useState, useEffect } from 'react'

class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.timestamp = 0
  }
}

const Mousetrail = () => {
  const canvasEl = useRef(null)
  const requestRef = useRef()
  const pointsRef = useRef([])
  const starttimeRef = useRef(null)

  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize() // needs to be called immediately to update state in the initial render

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleMovement = ({ clientX, clientY }) => {
      if (!canvasEl.current) {
        return
      }
      const x = clientX - canvasEl.current.offsetLeft
      const y = clientY - canvasEl.current.offsetTop

      const point = new Point(x, y)
      pointsRef.current.push(point)
    }

    document.addEventListener('mousemove', handleMovement)

    return () => window.removeEventListener('mousemove', handleMovement)
  }, [])

  useEffect(() => {
    const animate = (timestamp) => {
      if (!canvasEl.current) {
        return
      } // fix
      if (!starttimeRef.current) {
        starttimeRef.current = timestamp
      }

      const ctx = canvasEl.current.getContext('2d')
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      const maxAgeMS = 160

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

        if (elapsed > maxAgeMS) {
          pointsRef.current.shift()
        } else {
          ctx.lineJoin = 'round'
          ctx.lineWidth = 4

          ctx.strokeStyle = `#f87060`

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
  }, [])

  return (
    <canvas
      ref={canvasEl}
      height={windowSize.height}
      width={windowSize.width}
      style={{ position: 'fixed', top: 0, left: 0 }}
    ></canvas>
  )
}

export default Mousetrail
