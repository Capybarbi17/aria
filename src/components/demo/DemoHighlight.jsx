import { useDemo } from '../../contexts/DemoContext'

export default function DemoHighlight({ id, children, className = '' }) {
  const { active, step } = useDemo()
  const highlighted = active && step?.highlight === id

  return (
    <div
      data-demo={id}
      className={`relative transition ${className} ${
        highlighted
          ? 'z-30 rounded-xl ring-4 ring-indigo-400 ring-offset-2 ring-offset-white'
          : ''
      }`}
    >
      {children}
    </div>
  )
}
