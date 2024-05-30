import { useCallback, useState } from "react"

type TState = "HOVER" | "SELECT" | "NONE"

const useHoverClick = (initial_keys?: string[], defaultState?: TState) => {
  const [state, setState] = useState<{ [key: string]: TState }>(
    initial_keys?.reduce((prev, curr) => {
      return { ...prev, [curr]: defaultState || "NONE" }
    }, {}) || {},
  )

  const addKey = useCallback((key: string, value?: TState) => {
    setState(s => {
      return { ...s, [key]: value || "NONE" }
    })
  }, [])

  const removeKey = useCallback((key: string) => {
    setState(s => {
      const filtered = Object.entries(s).filter(e => e[0] !== key)
      return filtered.reduce((prev, curr) => {
        return { ...prev, [curr[0]]: curr[1] }
      }, {})
    })
  }, [])

  const isSelfHover = useCallback(
    (key: string) => {
      const noHover = Object.values(state).reduce(
        (prev, curr) => prev && curr != "HOVER",
        true,
      )
      return noHover ? state[key] === "SELECT" : state[key] === "HOVER"
    },
    [state],
  )

  return { addKey, removeKey, isSelfHover }
}

export default useHoverClick
