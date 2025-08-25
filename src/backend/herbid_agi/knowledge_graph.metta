; HerBid AGI Knowledge Graph
; This file contains the formal logic for business partnership recommendations

; Define the basic types of entities in our system
(:- (type-of Business) "entity")
(:- (type-of Skill) "entity")
(:- (type-of Contract) "entity")
(:- (type-of Reputation) "metric")
(:- (type-of Location) "attribute")
(:- (type-of Industry) "category")

; Sample businesses with their skills and locations
(has-skill "Sarah's Marketing Agency" "Digital Marketing")
(has-skill "Sarah's Marketing Agency" "Content Creation")
(has-skill "Sarah's Marketing Agency" "Social Media Management")
(is-located-in "Sarah's Marketing Agency" "Nairobi")
(has-industry "Sarah's Marketing Agency" "Marketing")

(has-skill "Jane's Dev House" "Web Development")
(has-skill "Jane's Dev House" "Sui Smart Contracts")
(has-skill "Jane's Dev House" "Frontend Development")
(is-located-in "Jane's Dev House" "Nairobi")
(has-industry "Jane's Dev House" "Technology")

(has-skill "Tech Solutions Kenya" "Mobile App Development")
(has-skill "Tech Solutions Kenya" "Backend Development")
(has-skill "Tech Solutions Kenya" "DevOps")
(is-located-in "Tech Solutions Kenya" "Mombasa")
(has-industry "Tech Solutions Kenya" "Technology")

(has-skill "Creative Minds Studio" "Graphic Design")
(has-skill "Creative Minds Studio" "UI/UX Design")
(has-skill "Creative Minds Studio" "Branding")
(is-located-in "Creative Minds Studio" "Nairobi")
(has-industry "Creative Minds Studio" "Design")

(has-skill "Financial Consultants Ltd" "Financial Analysis")
(has-skill "Financial Consultants Ltd" "Business Strategy")
(has-skill "Financial Consultants Ltd" "Risk Management")
(is-located-in "Financial Consultants Ltd" "Nairobi")
(has-industry "Financial Consultants Ltd" "Finance")

; Sample contracts requiring various skills
(requires-skill "Government Tender #123" "Digital Marketing")
(requires-skill "Government Tender #123" "Web Development")
(contract-budget "Government Tender #123" 500000)
(contract-deadline "Government Tender #123" "2025-12-31")

(requires-skill "Mobile Banking App" "Mobile App Development")
(requires-skill "Mobile Banking App" "UI/UX Design")
(requires-skill "Mobile Banking App" "Financial Analysis")
(contract-budget "Mobile Banking App" 1000000)
(contract-deadline "Mobile Banking App" "2025-10-15")

(requires-skill "E-commerce Platform" "Web Development")
(requires-skill "E-commerce Platform" "Digital Marketing")
(requires-skill "E-commerce Platform" "Graphic Design")
(contract-budget "E-commerce Platform" 750000)
(contract-deadline "E-commerce Platform" "2025-11-30")

; Reputation scores (0-100)
(reputation-score "Sarah's Marketing Agency" 85)
(reputation-score "Jane's Dev House" 92)
(reputation-score "Tech Solutions Kenya" 78)
(reputation-score "Creative Minds Studio" 88)
(reputation-score "Financial Consultants Ltd" 91)

; Core rule for partnership recommendation
; If business A has skill 1 AND business B has skill 2,
; AND a contract requires both, THEN A and B are a "Viable-Team" for that contract.
(:- (Viable-Team $businessA $businessB $contract)
    (And
        (has-skill $businessA $skillA)
        (has-skill $businessB $skillB)
        (requires-skill $contract $skillA)
        (requires-skill $contract $skillB)
        (neq $businessA $businessB) ; A and B must be different businesses
        (neq $skillA $skillB) ; Different skills for complementary partnership
    )
)

; Multi-partner team formation rule (3+ businesses)
(:- (Multi-Partner-Team $businessA $businessB $businessC $contract)
    (And
        (has-skill $businessA $skillA)
        (has-skill $businessB $skillB)
        (has-skill $businessC $skillC)
        (requires-skill $contract $skillA)
        (requires-skill $contract $skillB)
        (requires-skill $contract $skillC)
        (neq $businessA $businessB)
        (neq $businessB $businessC)
        (neq $businessA $businessC)
        (neq $skillA $skillB)
        (neq $skillB $skillC)
        (neq $skillA $skillC)
    )
)

; Local collaboration bonus rule
(:- (local-collaboration-bonus $businessA $businessB)
    (And
        (is-located-in $businessA $location)
        (is-located-in $businessB $location)
    )
)

; Industry synergy bonus rule
(:- (industry-synergy-bonus $businessA $businessB)
    (And
        (has-industry $businessA $industryA)
        (has-industry $businessB $industryB)
        (complementary-industries $industryA $industryB)
    )
)

; Define complementary industry relationships
(complementary-industries "Marketing" "Technology")
(complementary-industries "Technology" "Design")
(complementary-industries "Design" "Marketing")
(complementary-industries "Finance" "Technology")
(complementary-industries "Finance" "Marketing")

; High reputation partnership rule
(:- (high-reputation-team $businessA $businessB)
    (And
        (reputation-score $businessA $scoreA)
        (reputation-score $businessB $scoreB)
        (>= $scoreA 80)
        (>= $scoreB 80)
    )
)

; Skill coverage analysis rule
(:- (full-skill-coverage $contract $businessList)
    (And
        (requires-skill $contract $skill)
        (member $business $businessList)
        (has-skill $business $skill)
    )
)

; Partnership scoring rule
(:- (partnership-score $businessA $businessB $score)
    (And
        (base-compatibility-score $businessA $businessB $baseScore)
        (local-collaboration-bonus $businessA $businessB $localBonus)
        (industry-synergy-bonus $businessA $businessB $synergyBonus)
        (high-reputation-team $businessA $businessB $reputationBonus)
        (+ $baseScore $localBonus $synergyBonus $reputationBonus $score)
    )
)

; Base compatibility between businesses
(base-compatibility-score "Sarah's Marketing Agency" "Jane's Dev House" 70)
(base-compatibility-score "Jane's Dev House" "Creative Minds Studio" 75)
(base-compatibility-score "Tech Solutions Kenya" "Financial Consultants Ltd" 65)
(base-compatibility-score "Sarah's Marketing Agency" "Creative Minds Studio" 80)
(base-compatibility-score "Financial Consultants Ltd" "Jane's Dev House" 72)
