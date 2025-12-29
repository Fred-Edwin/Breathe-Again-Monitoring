import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import installationsRouter from './routes/installations';
import gardensRouter from './routes/gardens';
import zonesRouter from './routes/zones';
import metricsRouter from './routes/metrics';
import { startMockDataGenerator, stopMockDataGenerator } from './jobs/mockDataGenerator';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/installations', installationsRouter);
app.use('/api/gardens', gardensRouter);
app.use('/api/zones', zonesRouter);
app.use('/api/metrics', metricsRouter);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🌿 API endpoints:`);
    console.log(`   - GET http://localhost:${PORT}/api/installations`);
    console.log(`   - GET http://localhost:${PORT}/api/gardens`);
    console.log(`   - GET http://localhost:${PORT}/api/zones`);
    console.log(`   - GET http://localhost:${PORT}/api/metrics`);

    // Start mock data generator
    startMockDataGenerator();
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n🛑 SIGTERM received, shutting down gracefully...');
    stopMockDataGenerator();
    server.close(() => {
        console.log('✓ Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n🛑 SIGINT received, shutting down gracefully...');
    stopMockDataGenerator();
    server.close(() => {
        console.log('✓ Server closed');
        process.exit(0);
    });
});
