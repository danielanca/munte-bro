export interface StepContent {
    type: "text" | "highlight" | "image";
    content?: string;
    src?: string; // for images
  }
  
export interface Step {
    stepNumber: number;
    title: string;
    description: string;
    contentHTML: string; // Ensure this is included
  }
  