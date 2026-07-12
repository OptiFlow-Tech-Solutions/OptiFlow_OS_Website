## ADDED Requirements

### Requirement: Calculator has two range sliders

The ROI calculator SHALL provide two `<input type="range">` controls: team size (5–200, step 1) and per-user monthly SaaS cost (₹199–₹5,000, step 50).

#### Scenario: Team size slider defaults to 50
- **WHEN** the calculator renders for the first time
- **THEN** the team size slider shows value 50 with display "50 employees"

#### Scenario: Per-user cost slider defaults to ₹999
- **WHEN** the calculator renders for the first time
- **THEN** the per-user cost slider shows value ₹999 with display "₹999/user/mo"

#### Scenario: Slider displays update in real time
- **WHEN** the user drags either slider
- **THEN** the displayed value next to the slider updates immediately

### Requirement: Calculator computes traditional annual cost

The calculator SHALL compute traditional SaaS annual cost as `teamSize × perUserCost × 12`.

#### Scenario: Traditional cost for 50 users at ₹999/mo
- **WHEN** team size is 50 and per-user cost is ₹999
- **THEN** traditional annual cost displays as ₹5,99,400 (50 × 999 × 12 = 599,400)

### Requirement: Calculator selects plan by team-size thresholds

The calculator SHALL select the appropriate OptiFlow plan based on team size: Starter for ≤25 users, Growth for 26–100 users, Scale for >100 users.

#### Scenario: Team size 5 maps to Starter
- **WHEN** team size is 5
- **THEN** the plan badge shows "Starter" with "₹49,000/yr · ≤25 users"

#### Scenario: Team size 25 maps to Starter (boundary)
- **WHEN** team size is 25
- **THEN** the plan badge shows "Starter"

#### Scenario: Team size 26 maps to Growth (boundary)
- **WHEN** team size is 26
- **THEN** the plan badge shows "Growth" with "₹79,000/yr · 26-100 users"

#### Scenario: Team size 100 maps to Growth (boundary)
- **WHEN** team size is 100
- **THEN** the plan badge shows "Growth"

#### Scenario: Team size 101 maps to Scale (boundary)
- **WHEN** team size is 101
- **THEN** the plan badge shows "Scale" with "₹1,49,000/yr · 100+ users"

#### Scenario: Team size 200 maps to Scale
- **WHEN** team size is 200
- **THEN** the plan badge shows "Scale"

### Requirement: Calculator computes OptiFlow cost with setup fee

The calculator SHALL compute OptiFlow total annual cost as `planAnnual + setupFee` where planAnnual and setupFee are: Starter (₹49,000 + ₹25,000), Growth (₹79,000 + ₹40,000), Scale (₹1,49,000 + ₹75,000).

#### Scenario: Starter plan cost for 10 users
- **WHEN** team size is 10 (Starter plan)
- **THEN** OptiFlow cost displays as ₹74,000 (49,000 + 25,000)

#### Scenario: Growth plan cost for 50 users
- **WHEN** team size is 50 (Growth plan)
- **THEN** OptiFlow cost displays as ₹1,19,000 (79,000 + 40,000)

#### Scenario: Scale plan cost for 150 users
- **WHEN** team size is 150 (Scale plan)
- **THEN** OptiFlow cost displays as ₹2,24,000 (1,49,000 + 75,000)

### Requirement: Calculator computes savings with non-negative guard

The calculator SHALL compute savings as `max(0, traditionalAnnual - optiFlowTotal)` and savings percentage as `round((savings / traditionalAnnual) × 100)`.

#### Scenario: Positive savings display
- **WHEN** traditional annual is ₹5,99,400 and OptiFlow total is ₹1,19,000
- **THEN** savings displays as ₹4,80,400 with 80% reduction

#### Scenario: Savings never negative
- **WHEN** traditional annual is less than OptiFlow total (e.g., 5 users at ₹199/user vs Starter)
- **THEN** savings displays as ₹0 with 0% reduction

#### Scenario: Savings display in lakhs for large values
- **WHEN** savings exceeds ₹1,00,000
- **THEN** the savings card displays the value in lakhs (e.g., "₹4.8L")

### Requirement: Calculator computes effective per-user cost

The calculator SHALL compute effective per-user monthly cost as `round(optiFlowTotal / teamSize / 12)`.

#### Scenario: Effective per-user cost for 50 users on Growth
- **WHEN** team size is 50 and plan is Growth (₹1,19,000 total)
- **THEN** effective per-user cost displays as ₹198/mo (round(119000 / 50 / 12) = 198)

### Requirement: Calculator displays summary matrix

The calculator SHALL display a 4-row summary matrix showing current team size, per-user cost, selected plan, and effective per-user cost.

#### Scenario: Summary matrix reflects current slider values
- **WHEN** team size is 50 and per-user cost is ₹999
- **THEN** the matrix shows Team: 50, Per-User: ₹999/mo, Plan: Growth, Effective/User: ₹198/mo

### Requirement: Calculator labels use Indian number format

All monetary values in the calculator SHALL use `toLocaleString('en-IN')` for comma formatting (Indian numbering system).

#### Scenario: Large numbers use Indian lakh format
- **WHEN** traditional annual cost is 599400
- **THEN** the display shows "₹5,99,400"
