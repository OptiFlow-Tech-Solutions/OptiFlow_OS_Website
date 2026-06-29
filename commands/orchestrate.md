# /orchestrate <description>
Orchestrate a task through the full OpenSpec pipeline.

## Usage
`/orchestrate "add customer testimonials page"`

## Pipeline
1. Classifies task via skill-router
2. Routes to appropriate MCP servers
3. Delegates to OpenSpec: /opsx:propose
4. Waits for human gate approval
5. Delegates to /opsx:apply
6. Runs `npm run build && npm run validate`
7. Delegates to /opsx:verify
8. Waits for human gate approval
9. Delegates to /opsx:archive
10. Reports traceability matrix

## Agent
Uses the orchestrator coordinator to map tasks to agents and skills.
