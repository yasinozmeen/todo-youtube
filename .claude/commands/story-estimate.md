---
name: story-estimate
description: User story'ler için detaylı story point estimation yapar
agent_access: business-analyst
---

# Story Estimation Komutu

Bu komut Business Analyst Agent tarafından user story'ler için comprehensive story point estimation yapmak için kullanılır.

## Kullanım
```
/story-estimate [story-file] [complexity-factors] [team-velocity]
```

## Örnek Kullanım
```
/story-estimate "stories/US-TODO-001.md" "ui,backend,testing" "32-points-sprint"
```

## Estimation Methodology

### Planning Poker Scale
- **1 Point**: Trivial (1-2 hours)
- **2 Points**: Simple (half day)
- **3 Points**: Medium (1 day)
- **5 Points**: Complex (2-3 days)
- **8 Points**: Very Complex (1 week)
- **13 Points**: Epic (needs breakdown)

### Complexity Factors Analysis

#### Technical Complexity
```markdown
## Technical Complexity Assessment

### Frontend Complexity
- **UI Components**: [New components needed]
- **State Management**: [State complexity level]
- **API Integration**: [Number of API calls]
- **Validation Logic**: [Business rules complexity]
- **Responsive Design**: [Device compatibility needs]

**Score**: Low (1) / Medium (2) / High (3)
```

#### Business Logic Complexity
```markdown
### Business Rules
- **Validation Rules**: [Number and complexity]
- **Business Workflows**: [Process steps]
- **Data Transformations**: [Mapping complexity]
- **Integration Requirements**: [External systems]
- **Performance Requirements**: [Response time needs]

**Score**: Low (1) / Medium (2) / High (3)
```

#### Testing Complexity
```markdown
### Testing Requirements
- **Unit Test Cases**: [Estimated number]
- **Integration Scenarios**: [API/DB testing]
- **UI Testing**: [User interaction testing]
- **Edge Cases**: [Exception scenarios]
- **Performance Testing**: [Load/stress testing needs]

**Score**: Low (1) / Medium (2) / High (3)
```

## Estimation Process

### Step 1: Story Analysis
```markdown
# Story Estimation Analysis: [Story Title]

## Story Breakdown
**Feature Type**: CRUD / UI / Integration / Business Logic
**User Interaction**: Simple / Medium / Complex
**Data Operations**: Read / Write / Update / Delete / Bulk

## Component Analysis
**New Components**: [List of components to create]
**Modified Components**: [Existing components to change]
**Service Layer**: [Backend services needed]
**Database Changes**: [Schema/query changes]

## Dependencies
**Internal**: [Other stories/components]
**External**: [Third-party services]
**Blockers**: [Potential blocking issues]
```

### Step 2: Complexity Matrix
```markdown
## Complexity Matrix

| Factor | Weight | Score | Weighted Score |
|--------|--------|--------|----------------|
| UI Complexity | 3 | 2 | 6 |
| Backend Logic | 4 | 3 | 12 |
| Testing Effort | 2 | 2 | 4 |
| Integration | 3 | 1 | 3 |
| Business Rules | 4 | 2 | 8 |

**Total Complexity Score**: 33/60 (55%)
```

### Step 3: Historical Comparison
```markdown
## Similar Stories Comparison

**Similar Story 1**: US-AUTH-002 (User Login)
- **Complexity**: Similar UI + validation
- **Actual Points**: 3
- **Actual Time**: 1.5 days

**Similar Story 2**: US-TODO-003 (Todo Delete)
- **Complexity**: Simpler, CRUD operation
- **Actual Points**: 2  
- **Actual Time**: 0.8 days

**Relative Complexity**: Current story is 20% more complex than US-AUTH-002
```

### Step 4: Risk Assessment
```markdown
## Risk Factors

### Technical Risks
- **Unknown Technology**: [New libs/frameworks] - Risk Level: Low/Medium/High
- **Integration Complexity**: [Third-party APIs] - Risk Level: Low/Medium/High  
- **Performance Concerns**: [Scalability issues] - Risk Level: Low/Medium/High

### Business Risks
- **Requirement Changes**: [Stability of requirements] - Risk Level: Low/Medium/High
- **Stakeholder Availability**: [Review/approval delays] - Risk Level: Low/Medium/High

**Risk Multiplier**: 1.0x (No risk) / 1.2x (Low) / 1.5x (Medium) / 2.0x (High)
```

## Estimation Output

### Detailed Estimation Report
```markdown
# Story Point Estimation: [Story Title]

## Final Estimation
**Recommended Points**: 5
**Confidence Level**: High (85%)
**Estimation Range**: 3-8 points

## Estimation Breakdown
- **Base Complexity**: 4 points
- **Risk Adjustment**: +1 point (20% buffer)
- **Total**: 5 points

## Justification
**Why 5 Points**:
1. **Medium UI Complexity**: New form components + validation (2 points)
2. **Backend Integration**: API calls + data persistence (2 points)  
3. **Testing Requirements**: Unit + integration tests (1 point)
4. **Risk Buffer**: Unknown performance impact (1 point buffer)

## Time Breakdown (Based on team velocity)
- **Development**: 2 days
- **Testing**: 1 day
- **Code Review**: 0.5 days
- **Buffer**: 0.5 days
- **Total**: 4 days

## Assumptions
- Developer has React/TypeScript experience
- Backend API patterns are established
- UI component library available
- Testing framework setup complete

## Dependencies & Blockers
**Must Complete First**:
- User authentication system
- Basic todo data model

**Potential Blockers**:
- Third-party API availability
- UI/UX design approval

## Success Criteria for Estimation Accuracy
- [ ] Story completed within 1 sprint
- [ ] Actual effort within 20% of estimate
- [ ] No major scope changes
- [ ] Quality standards met
```

### Estimation Confidence Matrix
```markdown
## Confidence Assessment

| Factor | Confidence | Notes |
|--------|------------|--------|
| Requirements Clarity | High | Well-defined acceptance criteria |
| Technical Approach | Medium | Some unknowns in performance |
| Team Familiarity | High | Similar stories done before |
| Dependencies | Medium | One external dependency |

**Overall Confidence**: 75% (Medium-High)
```

## Validation & Review

### Estimation Review Checklist
- [ ] **Scope Validation**: Story scope matches estimate
- [ ] **Complexity Check**: All complexity factors considered
- [ ] **Historical Accuracy**: Compared with similar stories
- [ ] **Risk Assessment**: Appropriate risk buffer added
- [ ] **Team Input**: Developer feedback incorporated
- [ ] **Assumptions Clear**: All assumptions documented

### Team Validation
```markdown
## Team Estimation Review

**Business Analyst**: 5 points (recommended)
**Developer**: 5-8 points (confirms complexity)
**QA**: 3-5 points (testing perspective)
**Product Manager**: Accepts 5 points

**Consensus**: 5 points ✅
**Approved By**: [Team Lead]
**Date**: [Approval Date]
```

## Sonraki Adımlar
Estimated story sprint planning için hazır ve Developer Agent'a implementation için geçebilir.