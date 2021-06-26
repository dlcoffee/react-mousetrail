# react-mousetrail

Renders a `<canvas>` element with a mousetrail.

## Installation

```
npm i react-mousetrail
```

## Examples

### Trail for the entire page

```javascript
import { useState, useEffect } from 'react'
import Mousetrail from 'react-mousetrail'

const Layout = ({ children }) => {
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

  return (
    <>
      <div style={{ position: 'sticky', top: 0 }}>
        <Mousetrail
          height={windowSize.height}
          width={windowSize.width}
          color="#f87060"
          maxAge={160}
          style={{ position: 'fixed', top: 0, left: 0 }}
        ></Mousetrail>
      </div>

      <div style={{ position: 'relative' }}>{children}</div>
    </>
  )
}

export default Layout
```
