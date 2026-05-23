import { createContext, useCallback, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEMO_STEPS } from '../lib/demoSteps'
import { ensureDemoLogin, getDemoMeta, seedDemoData } from '../lib/demoSeed'

const DemoContext = createContext(null)

export function DemoProvider({ children }) {
  const navigate = useNavigate()
  const [active, setActive] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [meta, setMeta] = useState(() => getDemoMeta())

  const step = DEMO_STEPS[stepIndex]
  const totalSteps = DEMO_STEPS.length

  const goToStep = useCallback(
    (index) => {
      const s = DEMO_STEPS[index]
      if (!s) return
      setStepIndex(index)
      const demoMeta = getDemoMeta()
      const path =
        typeof s.path === 'function' ? s.path(demoMeta) : s.path
      if (path) navigate(path)
    },
    [navigate]
  )

  const startDemo = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const session = await ensureDemoLogin()
      const seeded = await seedDemoData(session.user.id)
      setMeta(seeded)
      setActive(true)
      setStepIndex(0)
      const firstPath =
        typeof DEMO_STEPS[0].path === 'function' ? DEMO_STEPS[0].path(seeded) : DEMO_STEPS[0].path
      navigate(firstPath)
    } catch (err) {
      setError(err.message || 'Could not start demo')
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const nextStep = useCallback(() => {
    if (stepIndex < totalSteps - 1) goToStep(stepIndex + 1)
    else endDemo()
  }, [stepIndex, totalSteps, goToStep])

  const prevStep = useCallback(() => {
    if (stepIndex > 0) goToStep(stepIndex - 1)
  }, [stepIndex, goToStep])

  const endDemo = useCallback(() => {
    setActive(false)
    setStepIndex(0)
  }, [])

  return (
    <DemoContext.Provider
      value={{
        active,
        step,
        stepIndex,
        totalSteps,
        loading,
        error,
        meta,
        startDemo,
        nextStep,
        prevStep,
        endDemo,
        goToStep,
      }}
    >
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used within DemoProvider')
  return ctx
}
