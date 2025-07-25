# TrustScope Database Schema Design

## Overview
TrustScope requires a sophisticated database schema to handle portfolio management, advanced analytics, community features, and ML-based predictions. This design extends beyond basic trust scoring to support comprehensive reputation analytics.

## Core Tables

### Users & Authentication
```sql
-- Enhanced user profiles with preferences
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash TEXT NOT NULL,
  display_name VARCHAR(255),
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  subscription_tier VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- User API keys and external connections
CREATE TABLE user_connections (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  service VARCHAR(100) NOT NULL, -- 'ethos', 'coinbase', 'twitter', etc.
  external_id VARCHAR(255),
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, service)
);
```

### Trust Profiles & Analytics
```sql
-- Extended trust profiles with analytics metadata
CREATE TABLE trust_profiles (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER UNIQUE,
  userkey VARCHAR(255) UNIQUE NOT NULL,
  userkey_type VARCHAR(50) NOT NULL, -- 'address', 'profileId', 'twitter', etc.
  display_name VARCHAR(255),
  username VARCHAR(255),
  avatar_url TEXT,
  description TEXT,
  score INTEGER DEFAULT 0,
  tier VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  
  -- Social connections
  userkeys JSONB DEFAULT '[]',
  social_profiles JSONB DEFAULT '{}',
  
  -- Statistics
  stats JSONB DEFAULT '{}',
  xp_total INTEGER DEFAULT 0,
  xp_streak_days INTEGER DEFAULT 0,
  
  -- Analytics metadata
  last_analyzed TIMESTAMP,
  analysis_version VARCHAR(20),
  data_quality_score DECIMAL(3,2),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_trust_profiles_userkey (userkey),
  INDEX idx_trust_profiles_score (score),
  INDEX idx_trust_profiles_tier (tier),
  INDEX idx_trust_profiles_updated (updated_at)
);

-- Historical score tracking with detailed metadata
CREATE TABLE reputation_scores (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER REFERENCES trust_profiles(id) ON DELETE CASCADE,
  userkey VARCHAR(255) NOT NULL,
  score INTEGER NOT NULL,
  tier VARCHAR(50),
  
  -- Score breakdown (from Ethos V1 API)
  score_elements JSONB DEFAULT '{}',
  
  -- Change tracking
  previous_score INTEGER,
  score_change INTEGER,
  change_reason VARCHAR(255),
  
  -- Metadata
  calculated_at TIMESTAMP DEFAULT NOW(),
  api_version VARCHAR(20),
  confidence_level DECIMAL(3,2),
  
  INDEX idx_reputation_scores_profile (profile_id),
  INDEX idx_reputation_scores_userkey (userkey),
  INDEX idx_reputation_scores_calculated (calculated_at),
  INDEX idx_reputation_scores_score (score)
);
```

### Portfolio Management
```sql
-- User portfolios for tracking multiple wallets
CREATE TABLE wallet_portfolios (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7), -- hex color
  is_public BOOLEAN DEFAULT false,
  
  -- Portfolio settings
  auto_refresh BOOLEAN DEFAULT true,
  refresh_interval INTEGER DEFAULT 3600, -- seconds
  alert_enabled BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_portfolios_user (user_id),
  INDEX idx_portfolios_public (is_public)
);

-- Wallets within portfolios
CREATE TABLE portfolio_wallets (
  id SERIAL PRIMARY KEY,
  portfolio_id INTEGER REFERENCES wallet_portfolios(id) ON DELETE CASCADE,
  profile_id INTEGER REFERENCES trust_profiles(id),
  userkey VARCHAR(255) NOT NULL,
  
  -- Wallet metadata
  label VARCHAR(255),
  notes TEXT,
  color VARCHAR(7),
  weight DECIMAL(5,2) DEFAULT 1.0, -- for weighted calculations
  
  -- Tracking
  added_at TIMESTAMP DEFAULT NOW(),
  last_checked TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  
  INDEX idx_portfolio_wallets_portfolio (portfolio_id),
  INDEX idx_portfolio_wallets_profile (profile_id),
  UNIQUE(portfolio_id, userkey)
);

-- Portfolio snapshots for historical tracking
CREATE TABLE portfolio_snapshots (
  id SERIAL PRIMARY KEY,
  portfolio_id INTEGER REFERENCES wallet_portfolios(id) ON DELETE CASCADE,
  
  -- Aggregated metrics
  total_wallets INTEGER,
  average_score DECIMAL(8,2),
  median_score INTEGER,
  total_staked_eth DECIMAL(18,8),
  total_vouches_received INTEGER,
  total_vouches_given INTEGER,
  
  -- Distribution analysis
  score_distribution JSONB, -- tier distribution
  risk_assessment JSONB,
  
  -- Metadata
  snapshot_at TIMESTAMP DEFAULT NOW(),
  calculation_version VARCHAR(20),
  
  INDEX idx_portfolio_snapshots_portfolio (portfolio_id),
  INDEX idx_portfolio_snapshots_date (snapshot_at)
);
```

### Vouch Analytics
```sql
-- Detailed vouch activity tracking
CREATE TABLE vouch_analytics (
  id SERIAL PRIMARY KEY,
  activity_id VARCHAR(255) UNIQUE, -- from Ethos API
  
  -- Participants
  from_profile_id INTEGER REFERENCES trust_profiles(id),
  to_profile_id INTEGER REFERENCES trust_profiles(id),
  from_userkey VARCHAR(255) NOT NULL,
  to_userkey VARCHAR(255) NOT NULL,
  
  -- Vouch details
  amount_wei VARCHAR(78), -- support large numbers
  amount_eth DECIMAL(18,8),
  amount_usd DECIMAL(12,2),
  eth_price_at_time DECIMAL(12,2),
  
  -- Transaction info
  transaction_hash VARCHAR(66),
  block_number BIGINT,
  
  -- Analysis
  is_reciprocal BOOLEAN DEFAULT false,
  reciprocal_vouch_id INTEGER REFERENCES vouch_analytics(id),
  trust_impact_score DECIMAL(8,4),
  network_effect DECIMAL(8,4),
  
  -- Metadata
  comment TEXT,
  tags JSONB DEFAULT '[]',
  analyzed_at TIMESTAMP DEFAULT NOW(),
  vouched_at TIMESTAMP NOT NULL,
  
  INDEX idx_vouch_analytics_from (from_profile_id),
  INDEX idx_vouch_analytics_to (to_profile_id),
  INDEX idx_vouch_analytics_date (vouched_at),
  INDEX idx_vouch_analytics_amount (amount_eth),
  INDEX idx_vouch_analytics_reciprocal (is_reciprocal)
);

-- Vouch flow analysis for network visualization
CREATE TABLE vouch_flows (
  id SERIAL PRIMARY KEY,
  from_userkey VARCHAR(255) NOT NULL,
  to_userkey VARCHAR(255) NOT NULL,
  
  -- Aggregated metrics
  total_vouches INTEGER DEFAULT 0,
  total_amount_eth DECIMAL(18,8) DEFAULT 0,
  average_amount_eth DECIMAL(18,8) DEFAULT 0,
  first_vouch_at TIMESTAMP,
  last_vouch_at TIMESTAMP,
  
  -- Flow analysis
  flow_strength DECIMAL(8,4), -- normalized strength
  flow_consistency DECIMAL(8,4), -- regularity of vouches
  mutual_strength DECIMAL(8,4), -- bidirectional strength
  
  -- Metadata
  calculated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_vouch_flows_from (from_userkey),
  INDEX idx_vouch_flows_to (to_userkey),
  INDEX idx_vouch_flows_strength (flow_strength),
  UNIQUE(from_userkey, to_userkey)
);
```

### Network Analysis
```sql
-- Precomputed network metrics for performance
CREATE TABLE network_analysis (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER REFERENCES trust_profiles(id) ON DELETE CASCADE,
  userkey VARCHAR(255) NOT NULL,
  
  -- Centrality metrics
  betweenness_centrality DECIMAL(10,8),
  closeness_centrality DECIMAL(10,8), 
  eigenvector_centrality DECIMAL(10,8),
  pagerank_score DECIMAL(10,8),
  
  -- Network position
  cluster_id VARCHAR(50),
  cluster_size INTEGER,
  cluster_trust_avg DECIMAL(8,2),
  
  -- Connection analysis
  first_degree_connections INTEGER DEFAULT 0,
  second_degree_connections INTEGER DEFAULT 0,
  third_degree_connections INTEGER DEFAULT 0,
  max_connection_depth INTEGER DEFAULT 0,
  
  -- Influence metrics
  influence_score DECIMAL(8,4),
  trust_flow_in DECIMAL(18,8),
  trust_flow_out DECIMAL(18,8),
  
  -- Metadata
  analysis_date TIMESTAMP DEFAULT NOW(),
  algorithm_version VARCHAR(20),
  
  INDEX idx_network_analysis_profile (profile_id),
  INDEX idx_network_analysis_centrality (eigenvector_centrality),
  INDEX idx_network_analysis_cluster (cluster_id),
  INDEX idx_network_analysis_influence (influence_score)
);

-- Network clusters for community detection
CREATE TABLE network_clusters (
  id SERIAL PRIMARY KEY,
  cluster_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255),
  description TEXT,
  
  -- Cluster metrics
  member_count INTEGER DEFAULT 0,
  average_trust_score DECIMAL(8,2),
  total_internal_vouches INTEGER DEFAULT 0,
  total_external_vouches INTEGER DEFAULT 0,
  
  -- Cluster characteristics
  cluster_type VARCHAR(50), -- 'tight_knit', 'hub_spoke', 'distributed'
  trust_density DECIMAL(6,4),
  external_connectivity DECIMAL(6,4),
  
  -- Metadata
  detected_at TIMESTAMP DEFAULT NOW(),
  algorithm_used VARCHAR(100),
  stability_score DECIMAL(4,3),
  
  INDEX idx_network_clusters_type (cluster_type),
  INDEX idx_network_clusters_size (member_count)
);
```

### ML & Predictions
```sql
-- Score predictions using machine learning
CREATE TABLE score_predictions (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER REFERENCES trust_profiles(id) ON DELETE CASCADE,
  userkey VARCHAR(255) NOT NULL,
  
  -- Current baseline
  current_score INTEGER NOT NULL,
  current_tier VARCHAR(50),
  
  -- Predictions
  predicted_score_7d INTEGER,
  predicted_score_30d INTEGER,
  predicted_score_90d INTEGER,
  predicted_tier_30d VARCHAR(50),
  
  -- Confidence levels
  confidence_7d DECIMAL(4,3),
  confidence_30d DECIMAL(4,3),
  confidence_90d DECIMAL(4,3),
  
  -- Contributing factors
  trend_factors JSONB, -- activity, vouch patterns, network effects
  risk_factors JSONB, -- potential negative impacts
  
  -- Model metadata
  model_version VARCHAR(20),
  predicted_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_score_predictions_profile (profile_id),
  INDEX idx_score_predictions_date (predicted_at)
);

-- Risk assessment data
CREATE TABLE risk_assessments (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER REFERENCES trust_profiles(id) ON DELETE CASCADE,
  userkey VARCHAR(255) NOT NULL,
  
  -- Risk scores (0-1)
  overall_risk_score DECIMAL(4,3),
  volatility_risk DECIMAL(4,3),
  network_risk DECIMAL(4,3),
  activity_risk DECIMAL(4,3),
  
  -- Risk factors
  risk_factors JSONB,
  mitigation_suggestions JSONB,
  
  -- Assessment metadata
  risk_level VARCHAR(20), -- 'low', 'medium', 'high', 'critical'
  assessed_at TIMESTAMP DEFAULT NOW(),
  model_version VARCHAR(20),
  
  INDEX idx_risk_assessments_profile (profile_id),
  INDEX idx_risk_assessments_level (risk_level),
  INDEX idx_risk_assessments_score (overall_risk_score)
);
```

### Community Features
```sql
-- User-generated insights and research
CREATE TABLE community_insights (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  
  -- Insight content
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  insight_type VARCHAR(50), -- 'analysis', 'warning', 'recommendation'
  
  -- Target profiles
  target_userkeys JSONB DEFAULT '[]',
  portfolio_id INTEGER REFERENCES wallet_portfolios(id),
  
  -- Engagement
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  
  -- Moderation
  is_public BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  moderation_status VARCHAR(20) DEFAULT 'pending',
  
  -- Metadata
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_community_insights_user (user_id),
  INDEX idx_community_insights_type (insight_type),
  INDEX idx_community_insights_public (is_public),
  INDEX idx_community_insights_created (created_at)
);

-- Community insight interactions
CREATE TABLE insight_interactions (
  id SERIAL PRIMARY KEY,
  insight_id INTEGER REFERENCES community_insights(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  
  interaction_type VARCHAR(20), -- 'like', 'share', 'comment', 'flag'
  comment_text TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_insight_interactions_insight (insight_id),
  INDEX idx_insight_interactions_user (user_id),
  UNIQUE(insight_id, user_id, interaction_type)
);
```

### Alert System
```sql
-- Flexible alert configurations
CREATE TABLE alert_configurations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  
  -- Alert target
  target_type VARCHAR(50), -- 'wallet', 'portfolio', 'network'
  target_id VARCHAR(255), -- userkey or portfolio_id
  
  -- Alert conditions
  alert_type VARCHAR(50), -- 'score_change', 'vouch_received', 'risk_level'
  condition_operator VARCHAR(10), -- '>', '<', '=', 'change'
  threshold_value DECIMAL(12,4),
  
  -- Alert settings
  is_active BOOLEAN DEFAULT true,
  frequency VARCHAR(20) DEFAULT 'immediate', -- 'immediate', 'daily', 'weekly'
  delivery_method VARCHAR(20) DEFAULT 'email', -- 'email', 'push', 'both'
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  last_triggered TIMESTAMP,
  trigger_count INTEGER DEFAULT 0,
  
  INDEX idx_alert_configs_user (user_id),
  INDEX idx_alert_configs_target (target_type, target_id),
  INDEX idx_alert_configs_active (is_active)
);

-- Alert history for tracking
CREATE TABLE alert_history (
  id SERIAL PRIMARY KEY,
  alert_config_id INTEGER REFERENCES alert_configurations(id) ON DELETE CASCADE,
  
  -- Alert details
  alert_type VARCHAR(50),
  target_userkey VARCHAR(255),
  trigger_value DECIMAL(12,4),
  previous_value DECIMAL(12,4),
  
  -- Delivery
  delivered_at TIMESTAMP DEFAULT NOW(),
  delivery_status VARCHAR(20) DEFAULT 'sent',
  
  INDEX idx_alert_history_config (alert_config_id),
  INDEX idx_alert_history_delivered (delivered_at)
);
```

## Indexes and Performance

### Key Indexes for Analytics Queries
```sql
-- Composite indexes for complex queries
CREATE INDEX idx_reputation_scores_profile_date ON reputation_scores(profile_id, calculated_at DESC);
CREATE INDEX idx_vouch_analytics_participants ON vouch_analytics(from_profile_id, to_profile_id);
CREATE INDEX idx_portfolio_performance ON portfolio_snapshots(portfolio_id, snapshot_at DESC);

-- Full-text search indexes
CREATE INDEX idx_trust_profiles_search ON trust_profiles USING gin(to_tsvector('english', display_name || ' ' || username || ' ' || description));
CREATE INDEX idx_community_insights_search ON community_insights USING gin(to_tsvector('english', title || ' ' || content));

-- JSONB indexes for metadata queries
CREATE INDEX idx_trust_profiles_userkeys ON trust_profiles USING gin(userkeys);
CREATE INDEX idx_reputation_score_elements ON reputation_scores USING gin(score_elements);
CREATE INDEX idx_network_analysis_metrics ON network_analysis USING gin((betweenness_centrality, closeness_centrality, eigenvector_centrality));
```

### Partitioning Strategy
```sql
-- Partition large tables by date for better performance
ALTER TABLE reputation_scores PARTITION BY RANGE (calculated_at);
CREATE TABLE reputation_scores_2025_01 PARTITION OF reputation_scores 
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

ALTER TABLE vouch_analytics PARTITION BY RANGE (vouched_at);
CREATE TABLE vouch_analytics_2025_01 PARTITION OF vouch_analytics 
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

## Data Relationships & Constraints

### Foreign Key Relationships
```sql
-- Ensure data integrity with proper constraints
ALTER TABLE trust_profiles ADD CONSTRAINT chk_score_range 
  CHECK (score >= 0 AND score <= 3000);

ALTER TABLE reputation_scores ADD CONSTRAINT chk_confidence_range 
  CHECK (confidence_level >= 0 AND confidence_level <= 1);

ALTER TABLE risk_assessments ADD CONSTRAINT chk_risk_scores 
  CHECK (overall_risk_score >= 0 AND overall_risk_score <= 1);
```

### Triggers for Automated Updates
```sql
-- Trigger to update portfolio snapshots when wallets change
CREATE OR REPLACE FUNCTION update_portfolio_snapshot()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO portfolio_snapshots (portfolio_id)
  SELECT DISTINCT portfolio_id FROM portfolio_wallets 
  WHERE portfolio_id = COALESCE(NEW.portfolio_id, OLD.portfolio_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER portfolio_wallet_changes
  AFTER INSERT OR UPDATE OR DELETE ON portfolio_wallets
  FOR EACH ROW EXECUTE FUNCTION update_portfolio_snapshot();
```

## Migration Strategy

### Version Control
Each schema change should be versioned and include:
- Migration up/down scripts
- Data transformation logic
- Performance impact assessment
- Rollback procedures

### Example Migration
```sql
-- Migration: Add ML prediction features
-- Version: 2025.01.001
-- Description: Add machine learning prediction tables

BEGIN;

-- Add new tables
CREATE TABLE score_predictions (...);
CREATE TABLE risk_assessments (...);

-- Add indexes
CREATE INDEX idx_score_predictions_profile ON score_predictions(profile_id);

-- Update application version
INSERT INTO schema_migrations (version, description, applied_at) 
VALUES ('2025.01.001', 'Add ML prediction features', NOW());

COMMIT;
```

This schema design provides the foundation for a comprehensive trust analytics platform with advanced portfolio management, community features, and machine learning capabilities while maintaining high performance through proper indexing and partitioning strategies.