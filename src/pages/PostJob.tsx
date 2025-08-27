import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { CustomButton } from '../components/ui/CustomButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { 
  MapPin,
  Calendar,
  DollarSign,
  Phone,
  Shield,
  CheckCircle,
  ArrowRight,
  Building,
  Wrench,
  Utensils,
  Laptop,
  Package,
  Megaphone
} from 'lucide-react';

const PostJob = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
    category: '',
    deadline: '',
    phone: '',
    milestones: [{ description: '', amount: '' }]
  });
  const [paymentStatus, setPaymentStatus] = useState('');

  const categories = [
    { id: 'tech', name: 'Tech & Web', icon: Laptop },
    { id: 'construction', name: 'Construction', icon: Building },
    { id: 'trades', name: 'Trades & Repair', icon: Wrench },
    { id: 'catering', name: 'Food & Catering', icon: Utensils },
    { id: 'supply', name: 'Supply & Logistics', icon: Package },
    { id: 'marketing', name: 'Marketing & Media', icon: Megaphone }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { description: '', amount: '' }]
    }));
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) => 
        i === index ? { ...milestone, [field]: value } : milestone
      )
    }));
  };

  const handleMpesaPayment = async () => {
    setPaymentStatus('processing');
    
    // Simulate M-Pesa Daraja API call
    setTimeout(() => {
      setPaymentStatus('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }, 3000);
  };

  const totalBudget = formData.milestones.reduce((sum, milestone) => 
    sum + (parseFloat(milestone.amount) || 0), 0
  );

  if (step === 1) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 mt-16 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Post a Job</h1>
            <p className="text-muted-foreground">
              Describe your project and secure funds to attract the best talent
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>Tell us about your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Website Development for Local Restaurant"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you need done, requirements, and expectations..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="location"
                      placeholder="Nairobi, Kenya"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="deadline">Deadline</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Category</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <Card
                        key={category.id}
                        className={`cursor-pointer transition-colors ${
                          formData.category === category.id
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => handleInputChange('category', category.id)}
                      >
                        <CardContent className="p-4 text-center">
                          <IconComponent className="w-6 h-6 mx-auto mb-2 text-primary" />
                          <p className="text-sm font-medium">{category.name}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Your M-Pesa Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="phone"
                    placeholder="254712345678"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Used for payment processing and project updates
                </p>
              </div>

              <CustomButton 
                onClick={() => setStep(2)}
                disabled={!formData.title || !formData.description || !formData.phone}
                className="w-full"
              >
                Continue to Payment Setup
                <ArrowRight className="w-4 h-4 ml-2" />
              </CustomButton>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 mt-16 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Secure Project Funds</h1>
            <p className="text-muted-foreground">
              Set up milestones and deposit funds to attract serious applicants
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Project Milestones</CardTitle>
                <CardDescription>Break down your project into payment milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.milestones.map((milestone, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div>
                      <Label>Milestone {index + 1} Description</Label>
                      <Input
                        placeholder="e.g., Design mockups completed"
                        value={milestone.description}
                        onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Amount (KES)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="25000"
                          value={milestone.amount}
                          onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <CustomButton variant="outline" onClick={addMilestone} className="w-full">
                  Add Another Milestone
                </CustomButton>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
                <CardDescription>Review and secure your project funds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Project Budget:</span>
                    <span className="font-bold text-2xl text-primary">KES {totalBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Platform Fee (5%):</span>
                    <span>KES {(totalBudget * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total to Deposit:</span>
                    <span>KES {(totalBudget * 1.05).toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Secure Escrow Protection</h4>
                      <p className="text-sm text-blue-700">
                        Your funds are held safely until milestones are completed. 
                        Only release payments when you're satisfied with the work.
                      </p>
                    </div>
                  </div>
                </div>

                {paymentStatus === 'processing' && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p>Processing M-Pesa payment...</p>
                    <p className="text-sm text-muted-foreground">Check your phone for the payment prompt</p>
                  </div>
                )}

                {paymentStatus === 'success' && (
                  <div className="text-center py-4 text-green-600">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-semibold">Payment Successful!</p>
                    <p className="text-sm">Your job will be posted shortly...</p>
                  </div>
                )}

                {paymentStatus === '' && (
                  <CustomButton 
                    onClick={handleMpesaPayment}
                    disabled={totalBudget === 0}
                    className="w-full"
                  >
                    Secure Funds via M-Pesa
                    <Shield className="w-4 h-4 ml-2" />
                  </CustomButton>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PostJob;
