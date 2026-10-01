import { useEffect, useRef, useState } from "react"

export function usePlayOnView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [play, setPlay] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlay(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setPlay(true)
        observer.disconnect()
      },
      { threshold: 0.28 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, play }
}
