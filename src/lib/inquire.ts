/**
 * Inquire wizard defaults — copy from inquire.md.
 * Studio edits live in site_content key "inquire".
 */

export const inquireDefaults = {
  eyebrow: "Inquire",
  title: "Tell Us About Your Project",
  lede: "Share a few details about your project so we can better understand what you're planning. It only takes about 2–3 minutes.",
  submitLabel: "Send Project Details",
  successTitle: "Thank you — we received your project details.",
  successBody:
    "Expect a reply within a day or two. If it's urgent, reach us directly through the contact channels on the site.",
  consentLabel: "I agree to be contacted regarding my project inquiry.",
  steps: {
    aboutYou: "About You",
    planning: "What Are You Planning?",
    property: "About the Property",
    budget: "Project Budget",
    inspiration: "Inspiration & References",
    details: "Other Details",
    review: "Review & Submit",
  },
  fields: {
    fullName: "Full Name",
    email: "Email Address",
    mobile: "Mobile Number",
    contactMethod: "Preferred Contact Method",
    messengerLink: "Messenger Profile Link",
    viberNumber: "Viber Number",
    projectType: "Project Type",
    subCategory: "Sub-category",
    projectStatus: "Project Status",
    hasProperty: "Do you already have a property?",
    propertyLocation: "Property Location (City / Municipality)",
    lotArea: "Lot Area (sqm)",
    floorArea: "Existing Floor Area (sqm)",
    propertyPhotos: "Upload Photos (optional)",
    estimatedBudget: "Estimated Budget",
    inspirationUploads: "Upload inspiration, plans, or site photos (optional)",
    moodboardLinks: "Pinterest or mood board links",
    projectNotes: "Tell us a little about your project.",
    projectNotesPlaceholder:
      "Briefly describe what you're planning, your goals, or anything you'd like us to know before we get in touch.",
  },
  contactMethods: ["Call", "Text", "Email", "Messenger", "Viber"],
  projectStatuses: [
    "Just exploring ideas",
    "Planning the project",
    "Ready to start soon",
    "Already under construction",
    "Other",
  ],
  propertyOptions: ["Yes", "Still looking", "Not yet"],
  budgetOptions: [
    "Under ₱500,000",
    "₱500,000 – ₱1 Million",
    "₱1 Million – ₱3 Million",
    "₱3 Million – ₱5 Million",
    "Above ₱5 Million",
    "I'm not sure yet",
    "I'd like a cost estimate first",
  ],
  styles: {
    title: {} as { font?: "heading" | "body"; size?: number; italic?: boolean },
    lede: {} as { font?: "heading" | "body"; size?: number; italic?: boolean },
  },
};

export type InquireContent = typeof inquireDefaults;

export type InquireAnswers = {
  fullName: string;
  email: string;
  mobile: string;
  contactMethod: string;
  contactDetails: string;
  projectType: string;
  subCategory: string;
  projectStatus: string;
  hasProperty: string;
  propertyLocation: string;
  lotArea: string;
  floorArea: string;
  propertyPhotos: string[];
  estimatedBudget: string;
  inspirationUploads: string[];
  moodboardLinks: string;
  projectNotes: string;
  consent: boolean;
};

export const emptyInquireAnswers = (): InquireAnswers => ({
  fullName: "",
  email: "",
  mobile: "",
  contactMethod: "Email",
  contactDetails: "",
  projectType: "",
  subCategory: "",
  projectStatus: "",
  hasProperty: "",
  propertyLocation: "",
  lotArea: "",
  floorArea: "",
  propertyPhotos: [],
  estimatedBudget: "",
  inspirationUploads: [],
  moodboardLinks: "",
  projectNotes: "",
  consent: false,
});

/** Compile structured wizard answers into the inquiries.message column. */
export function compileInquireMessage(a: InquireAnswers): string {
  const lines: string[] = [
    "[Source: Inquire Wizard]",
    `[Contact Method: ${a.contactMethod}]`,
  ];
  if (a.contactDetails.trim()) lines.push(`[Details: ${a.contactDetails.trim()}]`);
  if (a.projectType) lines.push(`[Project Type: ${a.projectType}]`);
  if (a.subCategory) lines.push(`[Sub-category: ${a.subCategory}]`);
  if (a.projectStatus) lines.push(`[Project Status: ${a.projectStatus}]`);
  if (a.hasProperty) lines.push(`[Has Property: ${a.hasProperty}]`);
  if (a.propertyLocation.trim()) lines.push(`[Location: ${a.propertyLocation.trim()}]`);
  if (a.lotArea.trim()) lines.push(`[Lot Area: ${a.lotArea.trim()} sqm]`);
  if (a.floorArea.trim()) lines.push(`[Existing Floor Area: ${a.floorArea.trim()} sqm]`);
  if (a.estimatedBudget) lines.push(`[Budget: ${a.estimatedBudget}]`);
  if (a.moodboardLinks.trim()) lines.push(`[Mood board links: ${a.moodboardLinks.trim()}]`);
  if (a.propertyPhotos.length) {
    lines.push(`[Property photos: ${a.propertyPhotos.join(", ")}]`);
  }
  if (a.inspirationUploads.length) {
    lines.push(`[Inspiration uploads: ${a.inspirationUploads.join(", ")}]`);
  }
  lines.push("", a.projectNotes.trim() || "(No additional notes)");
  return lines.join("\n");
}

export function inquireServiceLabel(a: InquireAnswers): string | null {
  if (a.projectType && a.subCategory) return `${a.projectType} — ${a.subCategory}`;
  if (a.projectType) return a.projectType;
  return null;
}
