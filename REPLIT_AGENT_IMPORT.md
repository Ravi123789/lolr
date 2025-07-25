# EthosRadar - Optimized for Replit Agent Import

## Quick Import Guide

This project has been optimized for fast Replit Agent importing with:

- **Reduced Size**: Cleaned from 14MB to 4.6MB (removed 150+ unused images)
- **Optimized Structure**: Essential files only, removed documentation clutter
- **Clean Dependencies**: Updated browserslist and removed cache conflicts

## Core Files (Import Priority Order)

1. `package.json` - Dependencies and scripts
2. `replit.md` - Project documentation
3. `drizzle.config.ts` - Database configuration
4. `vite.config.ts` - Build configuration
5. `client/src/` - React frontend
6. `server/` - Express backend
7. `shared/` - Common types and schemas

## Environment Setup

Required environment variables:
- `DATABASE_URL` (PostgreSQL connection)
- `NODE_ENV=development`

## Post-Import Steps

1. Run `npm install` to install dependencies
2. Run `npm run db:push` to setup database schema
3. Run `npm run dev` to start the application

## Features Ready

- Modern trust score dashboard with animations
- Real-time Ethos Protocol API integration
- Farcaster Mini App compliance
- Mobile-optimized UI with dark/light themes
- PostgreSQL database with Drizzle ORM

## Performance Optimizations Applied

- CSS optimizations for faster rendering
- Removed console.log statements in production paths
- Updated browser compatibility data
- Cleaned animation timing for smoother experience
- Optimized asset loading with proper caching