import { ErrorBoundary, ErrorBoundaryPropsWithComponent } from 'react-error-boundary'
import c from './ErrorFallback.module.css'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'

interface ErrorFallbackProps {
  resetErrorBoundary?: () => void
}

export const ErrorFallback = ({ resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <div className={c.container}>
      <Icon name="frame_bug" className={c.icon} />
      <div className={c.text}>
        Whoops! Something went wrong with this component. Check the console for more details.
      </div>
      {resetErrorBoundary && (
        <Button onClick={resetErrorBoundary} className={c.button} type="neutral">
          Try Again
        </Button>
      )}
    </div>
  )
}

export const HedronErrorBoundary = (
  props: Omit<ErrorBoundaryPropsWithComponent, 'FallbackComponent'>,
) => {
  return <ErrorBoundary {...props} FallbackComponent={ErrorFallback} />
}
