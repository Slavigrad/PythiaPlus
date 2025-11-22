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

// =========================================================================
// AUTH ENDPOINTS
// =========================================================================

/**
 * Login endpoint
 * POST /api/v1/auth/login
 * Body: { email, password, rememberMe }
 */
server.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Simulate network delay
  const delay = Math.floor(Math.random() * 300) + 200;

  setTimeout(() => {
    const db = router.db;
    const users = db.get('users').value();

    // Find user by email
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({
        error: 'USER_NOT_FOUND',
        message: 'No account found with this email',
        statusCode: 404
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        error: 'INVALID_CREDENTIALS',
        message: 'Email or password is incorrect',
        statusCode: 401
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Generate mock tokens
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
    }))}.mock-signature-${Date.now()}`;

    const refreshToken = `refresh-token-${user.id}-${Date.now()}`;

    // Update last login
    db.get('users')
      .find({ id: user.id })
      .assign({ lastLogin: new Date().toISOString() })
      .write();

    res.json({
      user: userWithoutPassword,
      token,
      refreshToken,
      expiresIn: 3600
    });
  }, delay);
});

/**
 * Logout endpoint
 * POST /api/v1/auth/logout
 */
server.post('/api/v1/auth/logout', (req, res) => {
  // In a real API, this would invalidate the refresh token
  setTimeout(() => {
    res.json({
      message: 'Logged out successfully'
    });
  }, 100);
});

/**
 * Refresh token endpoint
 * POST /api/v1/auth/refresh
 * Body: { token } or { refreshToken }
 */
server.post('/api/v1/auth/refresh', (req, res) => {
  const { token, refreshToken } = req.body;

  if (!token && !refreshToken) {
    return res.status(400).json({
      error: 'INVALID_REQUEST',
      message: 'Token or refreshToken required',
      statusCode: 400
    });
  }

  // Simulate token refresh
  setTimeout(() => {
    // In a real API, validate the refresh token
    const newToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
      sub: 'user-id',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    }))}.refreshed-${Date.now()}`;

    res.json({
      token: newToken,
      expiresIn: 3600
    });
  }, 200);
});

// =========================================================================
// SEARCH ENDPOINTS
// =========================================================================

/**
 * Search candidates endpoint
 * GET /api/v1/search
 */
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
