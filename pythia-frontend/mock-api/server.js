/**
 * Mock API Server for Pythia+
 *
 * Purpose: Simulates backend API for development
 * Features: Query-based search, topK filtering, minScore filtering
 * Port: 3000
 */

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('mock-api/db.json');
const middlewares = jsonServer.defaults();

// Enable CORS for Angular development server
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Add middlewares
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom search endpoint
server.get('/api/v1/search', (req, res) => {
  const { query = '', topK = 10, minScore = 0.7 } = req.query;

  // Simulate API delay (200-500ms)
  const delay = Math.floor(Math.random() * 300) + 200;

  setTimeout(() => {
    const db = router.db; // Get database
    let candidates = db.get('candidates').value();

    // Filter by query (simple keyword matching for demo)
    if (query) {
      const queryLower = query.toLowerCase();
      candidates = candidates.filter(candidate => {
        const searchFields = [
          candidate.name,
          candidate.title,
          candidate.location,
          ...candidate.technologies,
          ...candidate.skills
        ].join(' ').toLowerCase();

        return searchFields.includes(queryLower);
      });

      // Adjust match scores based on relevance (demo logic)
      candidates = candidates.map(candidate => {
        const titleMatch = candidate.title.toLowerCase().includes(queryLower);
        const nameMatch = candidate.name.toLowerCase().includes(queryLower);
        const techMatch = candidate.technologies.some(t => t.toLowerCase().includes(queryLower));
        const skillMatch = candidate.skills.some(s => s.toLowerCase().includes(queryLower));

        let score = candidate.matchScore.matched;
        if (titleMatch) score = Math.min(1, score + 0.1);
        if (nameMatch) score = Math.min(1, score + 0.05);
        if (techMatch) score = Math.min(1, score + 0.08);
        if (skillMatch) score = Math.min(1, score + 0.08);

        return {
          ...candidate,
          matchScore: {
            matched: Math.round(score * 100) / 100,
            total: 1
          }
        };
      });
    }

    // Filter by minimum score
    const minScoreNum = parseFloat(minScore);
    candidates = candidates.filter(c => c.matchScore.matched >= minScoreNum);

    // Sort by match score (descending)
    candidates.sort((a, b) => b.matchScore.matched - a.matchScore.matched);

    // Limit results by topK
    const topKNum = parseInt(topK, 10);
    const results = candidates.slice(0, topKNum);

    // Return response
    res.json({
      results,
      totalCount: results.length,
      query: query
    });
  }, delay);
});

// Health check endpoint
server.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Pythia+ Mock API is running',
    timestamp: new Date().toISOString()
  });
});

// Use default router for other routes
server.use(router);

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Pythia+ Mock API Server is running`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔍 Search: http://localhost:${PORT}/api/v1/search?query=react&topK=10&minScore=0.7`);
  console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
});
