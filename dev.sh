#!/bin/bash

# Chatterly Development Helper Script

echo "🚀 Chatterly Development Helper"
echo "=============================="

case "$1" in
  "start")
    echo "Starting local development environment..."
    echo "Backend: http://localhost:4000"
    echo "Frontend: http://localhost:5173"
    
    # Start backend
    cd apps/backend && bun run dev &
    BACKEND_PID=$!
    
    # Start frontend  
    cd apps/chat-widget && bun run dev &
    FRONTEND_PID=$!
    
    echo "Backend PID: $BACKEND_PID"
    echo "Frontend PID: $FRONTEND_PID"
    echo "Press Ctrl+C to stop all services"
    
    wait
    ;;
    
  "staging")
    echo "Deploying to staging..."
    git checkout staging
    git merge move/ws-to-http
    git push origin staging
    echo "✅ Staging deployment triggered!"
    echo "Check: https://github.com/aadithya2112/chatterly/actions"
    ;;
    
  "prod")
    echo "Deploying to production..."
    git checkout main
    git merge staging
    git push origin main
    echo "✅ Production deployment triggered!"
    ;;
    
  "test")
    echo "Testing backend endpoints..."
    echo "Testing GET /"
    curl -s http://localhost:4000/ || echo "❌ Backend not running"
    
    echo -e "\nTesting POST /api/authenticate (will fail without valid sessionId - that's expected)"
    curl -s -X POST http://localhost:4000/api/authenticate \
      -H "Content-Type: application/json" \
      -d '{"sessionId":"test"}' || echo "❌ Backend not running"
    ;;
    
  *)
    echo "Usage:"
    echo "  ./dev.sh start    - Start local development"
    echo "  ./dev.sh staging  - Deploy to staging"
    echo "  ./dev.sh prod     - Deploy to production" 
    echo "  ./dev.sh test     - Test backend endpoints"
    ;;
esac
