import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DollarSign, Calendar, FileText } from "lucide-react";

type ContractFormData = {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skillsRequired: string;
};

const ContractForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ContractFormData>();

  const onSubmit = (data: ContractFormData) => {
    console.log("Contract data:", data);
    // TODO: Connect to contract deployment
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Project Title</Label>
        <Input
          id="title"
          {...register("title", { required: "Title is required" })}
          placeholder="Website Development"
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Project Description</Label>
        <Textarea
          id="description"
          {...register("description", { required: "Description is required" })}
          placeholder="Detailed description of the project requirements..."
          rows={5}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="budget">
            <DollarSign className="inline h-4 w-4 mr-2" />
            Budget (USD)
          </Label>
          <Input
            id="budget"
            type="number"
            {...register("budget", { 
              required: "Budget is required",
              min: { value: 100, message: "Minimum budget is $100" }
            })}
            placeholder="5000"
          />
          {errors.budget && <p className="text-sm text-red-500">{errors.budget.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline">
            <Calendar className="inline h-4 w-4 mr-2" />
            Deadline
          </Label>
          <Input
            id="deadline"
            type="date"
            {...register("deadline", { required: "Deadline is required" })}
          />
          {errors.deadline && <p className="text-sm text-red-500">{errors.deadline.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="skillsRequired">
          <FileText className="inline h-4 w-4 mr-2" />
          Required Skills
        </Label>
        <Input
          id="skillsRequired"
          {...register("skillsRequired", { required: "Skills are required" })}
          placeholder="React, Node.js, UI/UX Design"
        />
        {errors.skillsRequired && <p className="text-sm text-red-500">{errors.skillsRequired.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          Create Contract
        </Button>
      </div>
    </form>
  );
};

export default ContractForm;
