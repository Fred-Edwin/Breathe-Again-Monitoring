import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/layout/Layout'
import { SkeletonCard } from './components/ui/Skeleton'

// Lazy load pages for code splitting
const Overview = lazy(() => import('./pages/Overview'))
const ZonesList = lazy(() => import('./pages/ZonesList'))
const ZoneDetail = lazy(() => import('./pages/ZoneDetail'))
const InsightsCenter = lazy(() => import('./pages/InsightsCenter'))

// Create a client with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 30000, // Poll every 30s
      staleTime: 25000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

// Loading fallback component
function PageLoader() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <Suspense fallback={<PageLoader />}>
                  <Overview />
                </Suspense>
              }
            />
            <Route
              path="zones"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ZonesList />
                </Suspense>
              }
            />
            <Route
              path="zones/:id"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ZoneDetail />
                </Suspense>
              }
            />
            <Route
              path="insights"
              element={
                <Suspense fallback={<PageLoader />}>
                  <InsightsCenter />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
