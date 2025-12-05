import { useEffect, useRef, useState } from 'react'

export function useScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold])

  return { ref, isVisible }
}

export function useMultipleScrollAnimations(count: number, threshold = 0.1) {
  const refs = useRef<(HTMLElement | null)[]>(Array(count).fill(null))
  const [visibleItems, setVisibleItems] = useState<boolean[]>(Array(count).fill(false))

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    refs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleItems(prev => {
                const newState = [...prev]
                newState[index] = true
                return newState
              })
              observer.unobserve(entry.target)
            }
          },
          { threshold }
        )
        observer.observe(ref)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [count, threshold])

  return { refs, visibleItems }
}
