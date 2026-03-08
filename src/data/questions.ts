export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Question {
  id: number;
  domain: string;
  text: string;
  type: "MULTIPLE CHOICE" | "TRUE/FALSE";
  options: Option[];
}

export const sampleQuestion: Question = {
  id: 15,
  domain: "General Insurance Principles",
  text: "What is the primary purpose of subrogation in insurance?",
  type: "MULTIPLE CHOICE",
  options: [
    {
      id: "A",
      text: "To allow the insurer to deny claims for negligence.",
      isCorrect: false,
      explanation: "Incorrect. Subrogation is not about denying claims; it's about the insurer's right to recover paid claim costs from the responsible third party."
    },
    {
      id: "B",
      text: "To provide a method for the insurer to increase annual premium rates.",
      isCorrect: false,
      explanation: "Incorrect. Subrogation prevents the insured from collecting twice for the same loss. It is the legal process by which an insurance company seeks recovery of the amount paid to the insured from a third party who is responsible for the loss. It is not a mechanism for rate hikes."
    },
    {
      id: "C",
      text: "To prevent the insured from collecting twice for the same loss by transferring recovery rights to the insurer.",
      isCorrect: true,
      explanation: "Correct! This is the principle of indemnity in action. Subrogation ensures the policyholder is made whole but does not profit from a loss by collecting from both the insurer and the at-fault party."
    },
    {
      id: "D",
      text: "To ensure that all policyholders pay the same deductible regardless of risk.",
      isCorrect: false,
      explanation: "Incorrect. Deductibles are unrelated to subrogation. Subrogation deals with post-claim recovery from third parties."
    }
  ]
};
