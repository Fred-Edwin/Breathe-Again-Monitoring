import { useZones } from '../hooks/useZones'
import ZoneCard from '../components/cards/ZoneCard'
import PageHero from '../components/ui/PageHero'
import { SkeletonCard } from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'

export default function ZonesList() {
    const { data: zones, isLoading, error, refetch } = useZones()

    // Loading state
    if (isLoading) {
        return (
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Zones</h1>
                    <p className="text-gray-600 mb-8">Browse all monitoring zones</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Zones</h1>
                    <ErrorState onRetry={refetch} />
                </div>
            </div>
        )
    }

    return (
        <div>
            <PageHero
                image="/images/hero/hero_vertical_garden_1767170354992.png"
                title="Zones"
                subtitle={`${zones?.length || 0} monitoring zones across all gardens`}
                height="30vh"
                overlay="gradient"
            />

            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Zones</h1>
                    <p className="text-gray-600 mb-8">
                        Browse all monitoring zones ({zones?.length || 0} total)
                    </p>

                    {zones && zones.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {zones.map((zone) => (
                                <ZoneCard key={zone.id} zone={zone} />
                            ))}
                        </div>
                    ) : (
                        <div className="card text-center py-12">
                            <p className="text-gray-500">No zones found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
