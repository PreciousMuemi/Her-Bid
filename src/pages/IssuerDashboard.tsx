import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, FileText, Users, DollarSign, ClipboardList } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";

const IssuerDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Contract Issuer Dashboard</h1>
          <Button onClick={() => navigate("/create-contract")}>
            <FileText className="h-4 w-4 mr-2" />
            New Contract
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">
              <ClipboardList className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="contracts">
              <Briefcase className="h-4 w-4 mr-2" />
              My Contracts
            </TabsTrigger>
            <TabsTrigger value="bids">
              <Users className="h-4 w-4 mr-2" />
              Received Bids
            </TabsTrigger>
            <TabsTrigger value="payments">
              <DollarSign className="h-4 w-4 mr-2" />
              Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Active Contracts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Pending Bids
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Completed Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Total Spent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$42,500</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contracts">
            {/* Contract listings would go here */}
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Your active contracts will appear here
              </p>
            </div>
          </TabsContent>

          <TabsContent value="bids">
            {/* Bid listings would go here */}
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Received bids will appear here
              </p>
            </div>
          </TabsContent>

          <TabsContent value="payments">
            {/* Payment history would go here */}
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Payment history will appear here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default IssuerDashboard;
