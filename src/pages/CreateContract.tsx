import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import ContractForm from "@/components/contracts/ContractForm";
import { Briefcase } from "lucide-react";

const CreateContract = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Briefcase className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Create New Contract</h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-3xl mx-auto">
          <div className="mb-6">
            <h2 className="text-lg font-medium">Contract Details</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fill in the details of your contract opportunity
            </p>
          </div>
          <ContractForm />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateContract;
