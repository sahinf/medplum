/*
 * Generated by @medplum/generator
 * Do not edit manually.
 */

import { PoolClient } from 'pg';

const statements = [
  `CREATE EXTENSION IF NOT EXISTS btree_gin`,
  `CREATE TABLE IF NOT EXISTS "Coding" (
    id BIGSERIAL PRIMARY KEY,
    system UUID NOT NULL, -- reference to "CodeSystem".id
    code TEXT NOT NULL,
    display TEXT
  )`,
  `CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS "Coding_system_code_idx" ON "Coding" (system, code) INCLUDE (id)`,
  `CREATE INDEX CONCURRENTLY IF NOT EXISTS "Coding_display_idx" ON "Coding" USING gin ((system::uuid), to_tsvector('english', display)) WHERE display IS NOT NULL`,

  `CREATE TABLE IF NOT EXISTS "CodeSystem_Property" (
    id BIGSERIAL PRIMARY KEY,
    system UUID NOT NULL, -- reference to "CodeSystem".id
    code TEXT NOT NULL,
    type TEXT NOT NULL,
    uri TEXT,
    description TEXT
  )`,
  `CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS "CodeSystem_Property_idx" ON "CodeSystem_Property" (system, code) INCLUDE (id)`,

  `CREATE TABLE IF NOT EXISTS "Coding_Property" (
    coding BIGINT NOT NULL, -- reference to "Coding".id
    property BIGINT NOT NULL, -- reference to "CodeSystem_Property".id
    target BIGINT, -- reference to "Coding".id, for relationship properties
    value TEXT -- value could be string | integer | boolean | dateTime
  )`,
  `CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS "Coding_Property_idx" ON "Coding_Property" (coding, property, target, value)`,

  `CREATE TABLE IF NOT EXISTS "ValueSet_Membership" (
    "valueSet" UUID NOT NULL, -- reference to "ValueSet".id
    coding BIGINT NOT NULL, -- reference to "Coding".id
    PRIMARY KEY ("valueSet", coding)
  )`,
];

export async function run(client: PoolClient): Promise<void> {
  for (const stmt of statements) {
    await client.query(stmt);
  }
}
