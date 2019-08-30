import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';

const HintContext = React.createContext({});

export const HintContextProvider = ({ children }) => {
  const [state, setState] = useState({
    boxes: {}
  })

  const registerRef = useCallback((id, ref) => {
    setState((prevState) => ({
      ...prevState,
      refs: {
        ...prevState.refs,
        [id]: ref
      }
    }))

    if (ref === null) {
      setState((prevState) => {
        const newRefs = {};
        Object.keys(prevState.refs).forEach(key => {
          if(key !== id) newRefs[key] = prevState.refs[key]
        })
        return {
          ...prevState,
          refs: newRefs
        }
      })
    }
  })

  return <HintContext.Provider value={[state, registerRef]}>{children}</HintContext.Provider>
}

export const useGetInsertionIndex = () => {
  const [state, _] = useContext(HintContext);
  return (x, y) => {
    const closest = Object.keys(state.refs)
      .map((key) => {
        const current = state.refs[key].current
        const rect = current.getBoundingClientRect()
        return [parseInt(key, 10), rect]
      })
      .sort(([_, rect]) => rect.top - y)[0]

    const [key, rect] = closest;

    // if (y < rect.top) {
    //   return key
    // } else if (y > rect.bottom) {
    //   return key + 1
    // } else {
    //   return null
    // }

    const mod = y > rect.top + (rect.height / 2) ? 1 : 0
    
    return key + mod
  }
}

export const useRegisterRef = (id) => {
  const [_, registerRef] = useContext(HintContext);

  const elRef = useRef(null);

  useEffect(() => {
    registerRef(id, elRef)
    return () => {
      registerRef(id, null)
    }
  }, [])

  return elRef;
}