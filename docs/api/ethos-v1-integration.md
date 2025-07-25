# Ethos Protocol V1 API Integration Guide

## Overview
The Ethos Protocol V1 API provides comprehensive trust score data with detailed breakdowns of 13 scoring elements. This is the primary API for historical score data and detailed analytics.

## Base URL
```
https://api.ethos.network/api/v1
```

## Authentication
No API key required for basic operations. Rate limiting applies based on IP address.

## Key Endpoints

### 1. Score Breakdown
Get detailed score analysis with all 13 elements:

```typescript
// GET /score/{userkey}?duration=30d
interface ScoreBreakdown {
  score: number;
  tier: string;
  elements: {
    reviewImpact: number;
    vouchImpact: number;
    socialAttestation: number;
    networkEffect: number;
    timeDecay: number;
    // ... 8 more elements
  };
  history: ScoreHistoryEntry[];
  metadata: {
    lastUpdated: string;
    dataQuality: number;
    confidenceLevel: number;
  };
}
```

### 2. Historical Score Data
```typescript
// GET /score/{userkey}/history?days=90
interface ScoreHistory {
  entries: Array<{
    timestamp: string;
    score: number;
    change: number;
    reason?: string;
  }>;
  trends: {
    overall: 'increasing' | 'decreasing' | 'stable';
    velocity: number;
    volatility: number;
  };
}
```

### 3. Network Analysis
```typescript
// GET /network/{userkey}/analysis
interface NetworkAnalysis {
  connections: {
    first_degree: number;
    second_degree: number;
    third_degree: number;
  };
  influence_metrics: {
    betweenness_centrality: number;
    closeness_centrality: number;
    eigenvector_centrality: number;
  };
  community_detection: {
    cluster_id: string;
    cluster_size: number;
    cluster_trust_avg: number;
  };
}
```

## Implementation Examples

### Basic Score Fetching
```typescript
class EthosV1Service {
  private baseUrl = 'https://api.ethos.network/api/v1';

  async getScoreBreakdown(userkey: string, duration = '30d') {
    const response = await fetch(
      `${this.baseUrl}/score/${userkey}?duration=${duration}`
    );
    
    if (!response.ok) {
      throw new Error(`V1 API Error: ${response.status}`);
    }
    
    return response.json() as ScoreBreakdown;
  }

  async getScoreHistory(userkey: string, days = 90) {
    const response = await fetch(
      `${this.baseUrl}/score/${userkey}/history?days=${days}`
    );
    
    return response.json() as ScoreHistory;
  }

  async getNetworkAnalysis(userkey: string) {
    const response = await fetch(
      `${this.baseUrl}/network/${userkey}/analysis`
    );
    
    return response.json() as NetworkAnalysis;
  }
}
```

### React Hook for Score Data
```typescript
import { useQuery } from '@tanstack/react-query';

export function useScoreBreakdown(userkey: string, duration = '30d') {
  return useQuery({
    queryKey: ['ethos-v1', 'score', userkey, duration],
    queryFn: () => ethosV1Service.getScoreBreakdown(userkey, duration),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useScoreHistory(userkey: string, days = 90) {
  return useQuery({
    queryKey: ['ethos-v1', 'history', userkey, days],
    queryFn: () => ethosV1Service.getScoreHistory(userkey, days),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
```

## Tier System (Official)
Based on developers.ethos.network documentation:

```typescript
export const ETHOS_TIERS = {
  UNTRUSTED: { min: 0, max: 799, label: 'Untrusted', icon: '⚠️' },
  QUESTIONABLE: { min: 800, max: 1199, label: 'Questionable', icon: '❓' },
  NEUTRAL: { min: 1200, max: 1599, label: 'Neutral', icon: '⚖️' },
  REPUTABLE: { min: 1600, max: 1999, label: 'Reputable', icon: '🌟' },
  EXEMPLARY: { min: 2000, max: 2800, label: 'Exemplary', icon: '💎' }
};

export function getTierForScore(score: number) {
  return Object.values(ETHOS_TIERS).find(
    tier => score >= tier.min && score <= tier.max
  ) || ETHOS_TIERS.UNTRUSTED;
}
```

## Error Handling

### Common Error Responses
```typescript
interface EthosV1Error {
  error: string;
  code: number;
  details?: string;
  timestamp: string;
}

// Common error codes:
// 404 - User not found
// 429 - Rate limit exceeded
// 500 - Internal server error
// 503 - Service temporarily unavailable
```

### Robust Error Handling
```typescript
class EthosV1Service {
  async withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) throw error;
        
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
    throw new Error('Max retries exceeded');
  }

  async getScoreBreakdown(userkey: string, duration = '30d') {
    return this.withRetry(async () => {
      const response = await fetch(
        `${this.baseUrl}/score/${userkey}?duration=${duration}`
      );
      
      if (response.status === 404) {
        throw new Error('User not found in Ethos network');
      }
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }
      
      return response.json();
    });
  }
}
```

## Caching Strategy

### Redis Caching Implementation
```typescript
import Redis from 'ioredis';

class EthosV1CachedService extends EthosV1Service {
  private redis = new Redis(process.env.REDIS_URL);

  async getScoreBreakdown(userkey: string, duration = '30d') {
    const cacheKey = `ethos-v1:score:${userkey}:${duration}`;
    
    // Check cache first
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // Fetch from API
    const data = await super.getScoreBreakdown(userkey, duration);
    
    // Cache for 5 minutes
    await this.redis.setex(cacheKey, 300, JSON.stringify(data));
    
    return data;
  }
}
```

## Rate Limiting & Best Practices

### Request Batching
```typescript
class EthosV1BatchService {
  private queue: Array<{
    userkey: string;
    resolve: (data: any) => void;
    reject: (error: any) => void;
  }> = [];

  async batchGetScores(userkeys: string[]) {
    // Batch requests to avoid rate limiting
    const chunks = this.chunkArray(userkeys, 10);
    const results = [];

    for (const chunk of chunks) {
      const promises = chunk.map(userkey => 
        this.getScoreBreakdown(userkey)
      );
      
      const chunkResults = await Promise.allSettled(promises);
      results.push(...chunkResults);
      
      // Wait between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
```

## Testing

### Mock Data for Development
```typescript
export const mockScoreBreakdown: ScoreBreakdown = {
  score: 1371,
  tier: 'Neutral',
  elements: {
    reviewImpact: 245,
    vouchImpact: 389,
    socialAttestation: 156,
    networkEffect: 234,
    timeDecay: -89,
    // ... more elements
  },
  history: [
    { timestamp: '2025-01-20T10:00:00Z', score: 1371, change: +12 },
    { timestamp: '2025-01-19T10:00:00Z', score: 1359, change: -5 },
  ],
  metadata: {
    lastUpdated: '2025-01-23T10:00:00Z',
    dataQuality: 0.95,
    confidenceLevel: 0.87
  }
};
```

### Unit Tests
```typescript
import { describe, it, expect, vi } from 'vitest';

describe('EthosV1Service', () => {
  it('should fetch score breakdown correctly', async () => {
    const service = new EthosV1Service();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockScoreBreakdown)
    });

    const result = await service.getScoreBreakdown('test-userkey');
    
    expect(result.score).toBe(1371);
    expect(result.tier).toBe('Neutral');
  });

  it('should handle 404 errors gracefully', async () => {
    const service = new EthosV1Service();
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404
    });

    await expect(
      service.getScoreBreakdown('nonexistent-user')
    ).rejects.toThrow('User not found in Ethos network');
  });
});
```

## Performance Optimization

### Data Preprocessing
```typescript
class EthosV1OptimizedService extends EthosV1Service {
  async getOptimizedScoreData(userkey: string) {
    const [breakdown, history, network] = await Promise.all([
      this.getScoreBreakdown(userkey),
      this.getScoreHistory(userkey, 30),
      this.getNetworkAnalysis(userkey)
    ]);

    // Preprocess data for frontend consumption
    return {
      currentScore: breakdown.score,
      tier: getTierForScore(breakdown.score),
      trend: this.calculateTrend(history.entries),
      networkStrength: network.influence_metrics.eigenvector_centrality,
      lastUpdated: breakdown.metadata.lastUpdated,
      // Include only essential data
      elements: this.getTopElements(breakdown.elements, 5)
    };
  }

  private calculateTrend(entries: ScoreHistoryEntry[]) {
    if (entries.length < 2) return 'stable';
    
    const recent = entries.slice(-7); // Last 7 entries
    const changes = recent.map(entry => entry.change);
    const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
    
    return avgChange > 2 ? 'increasing' : 
           avgChange < -2 ? 'decreasing' : 'stable';
  }
}
```

This guide provides everything needed to integrate with Ethos Protocol V1 API effectively, including error handling, caching, testing, and performance optimization strategies.