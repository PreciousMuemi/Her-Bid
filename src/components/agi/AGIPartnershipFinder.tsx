import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, Star, MapPin, Building, Brain, Zap } from 'lucide-react';
import { useHerBidAGI, PartnershipRecommendation, TeamFormation } from '@/services/agiService';

interface AGIPartnershipFinderProps {
  userBusiness?: string;
  contractName?: string;
  onTeamFormed?: (team: TeamFormation) => void;
  onEscrowCreated?: (escrowId: string) => void;
}

const AGIPartnershipFinder: React.FC<AGIPartnershipFinderProps> = ({
  userBusiness = "Sarah's Marketing Agency",
  contractName = "Government Tender #123",
  onTeamFormed,
  onEscrowCreated
}) => {
  const agiService = useHerBidAGI();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<PartnershipRecommendation[]>([]);
  const [optimalTeam, setOptimalTeam] = useState<TeamFormation | null>(null);
  const [error, setError] = useState<string>('');
  const [selectedPartners, setSelectedPartners] = useState<Set<string>>(new Set());
  const [isCreatingEscrow, setIsCreatingEscrow] = useState(false);

  // Load partnership recommendations
  const loadRecommendations = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await agiService.findPartnerships(userBusiness, contractName);
      
      if (response.success && response.data) {
        setRecommendations(response.data);
      } else {
        setError(response.error || 'Failed to load recommendations');
      }
    } catch (err) {
      setError('Failed to connect to AGI service');
    } finally {
      setLoading(false);
    }
  };

  // Form optimal team using AGI
  const formOptimalTeam = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await agiService.formOptimalTeam(contractName);
      
      if (response.success && response.data) {
        setOptimalTeam(response.data);
        onTeamFormed?.(response.data);
      } else {
        setError(response.error || 'Failed to form optimal team');
      }
    } catch (err) {
      setError('Failed to connect to AGI service');
    } finally {
      setLoading(false);
    }
  };

  // Create escrow contract
  const createEscrowContract = async () => {
    if (!optimalTeam) return;
    
    setIsCreatingEscrow(true);
    setError('');
    
    try {
      const projectId = `project_${Date.now()}`;
      const totalBudget = 500000000; // 500 SUI in microSUI
      const clientAddress = '0xclient_address_placeholder';
      
      const response = await agiService.createEscrow(
        projectId,
        contractName,
        totalBudget,
        clientAddress
      );
      
      if (response.success && response.data) {
        onEscrowCreated?.(response.data.escrow_id);
        alert(`Escrow contract created successfully! ID: ${response.data.escrow_id}`);
      } else {
        setError(response.error || 'Failed to create escrow contract');
      }
    } catch (err) {
      setError('Failed to create escrow contract');
    } finally {
      setIsCreatingEscrow(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [userBusiness, contractName]);

  const togglePartnerSelection = (partnerName: string) => {
    const newSelection = new Set(selectedPartners);
    if (newSelection.has(partnerName)) {
      newSelection.delete(partnerName);
    } else {
      newSelection.add(partnerName);
    }
    setSelectedPartners(newSelection);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Fair';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            AGI Partnership Finder
          </CardTitle>
          <CardDescription>
            AI-powered partnership recommendations for {userBusiness} on "{contractName}"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={loadRecommendations} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Find Partners
            </Button>
            <Button onClick={formOptimalTeam} disabled={loading} variant="outline">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Zap className="mr-2 h-4 w-4" />
              Form Optimal Team
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Partnership Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Partnership Recommendations
            </CardTitle>
            <CardDescription>
              AGI-analyzed partnership opportunities based on skill complementarity and compatibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((rec, index) => (
                <Card 
                  key={index} 
                  className={`cursor-pointer transition-all ${
                    selectedPartners.has(rec.partner_name) 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => togglePartnerSelection(rec.partner_name)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{rec.partner_name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getScoreColor(rec.compatibility_score)}`} />
                      <span className="text-sm font-medium">
                        {rec.compatibility_score.toFixed(1)} - {getScoreText(rec.compatibility_score)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {rec.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{rec.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>{rec.industry}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        <span>Reputation: {rec.reputation_score}/100</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 italic">
                      {rec.reasoning}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimal Team Display */}
      {optimalTeam && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              AGI Optimal Team Formation
            </CardTitle>
            <CardDescription>
              AI-optimized team with maximum compatibility and skill coverage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">Team Score: {optimalTeam.total_score.toFixed(1)}/100</h3>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {optimalTeam.team_members.length} Members
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Team Members:</h4>
                  <div className="flex flex-wrap gap-2">
                    {optimalTeam.team_members.map((member, index) => (
                      <Badge key={index} variant="default" className="px-3 py-1">
                        {member}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Skill Coverage:</h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {Object.entries(optimalTeam.skill_coverage).map(([skill, provider]) => (
                      <div key={skill} className="bg-white p-2 rounded border">
                        <span className="font-medium text-sm">{skill}</span>
                        <span className="text-xs text-gray-600 block">by {provider}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {optimalTeam.collaborative_bonuses.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Collaborative Bonuses:</h4>
                    <div className="space-y-1">
                      {optimalTeam.collaborative_bonuses.map((bonus, index) => (
                        <Badge key={index} variant="outline" className="block w-fit">
                          {bonus}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={createEscrowContract} 
                disabled={isCreatingEscrow}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isCreatingEscrow && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Sui Escrow Contract
              </Button>
              <Button variant="outline" onClick={() => setOptimalTeam(null)}>
                Clear Team
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Partners Summary */}
      {selectedPartners.size > 0 && !optimalTeam && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Partners ({selectedPartners.size})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {Array.from(selectedPartners).map((partner) => (
                <Badge key={partner} variant="default" className="px-3 py-1">
                  {partner}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePartnerSelection(partner);
                    }}
                    className="ml-2 hover:text-red-300"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <Button 
              onClick={() => setSelectedPartners(new Set())}
              variant="outline"
              size="sm"
            >
              Clear Selection
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AGIPartnershipFinder;
