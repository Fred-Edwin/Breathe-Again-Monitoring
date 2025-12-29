interface SkeletonProps {
    className?: string
    width?: string
    height?: string
}

export default function Skeleton({ className = '', width, height }: SkeletonProps) {
    const style = {
        width: width || '100%',
        height: height || '20px',
    }

    return <div className={`skeleton ${className}`} style={style} />
}

// Preset skeleton components
export function SkeletonCard() {
    return (
        <div className="card">
            <Skeleton height="24px" className="mb-4" />
            <Skeleton height="48px" className="mb-2" />
            <Skeleton height="16px" width="60%" />
        </div>
    )
}

export function SkeletonMetric() {
    return (
        <div className="card">
            <Skeleton height="20px" width="40%" className="mb-3" />
            <Skeleton height="40px" width="50%" className="mb-2" />
            <Skeleton height="16px" width="30%" />
        </div>
    )
}
