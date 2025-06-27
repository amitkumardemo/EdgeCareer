import { 
  BrainCircuit, 
  Briefcase, 
  LineChart, 
  ScrollText, 
  FileText, 
  ShieldCheck, 
  Edit3, 
  Mic, 
  BarChart3, 
  Upload, 
  Users, 
  BriefcaseBusiness 
} from "lucide-react";

export const features = [
  {
    icon: <BrainCircuit className="w-6 h-6 mb-4 text-gray-400" />,
    title: "AI-Powered Guidance",
    description:
      "Discover career paths tailored to your skills with AI-driven insights.",
  },
  {
    icon: <ScrollText className="w-6 h-6 mb-4 text-gray-400" />,
    title: "Smart Resume & Letter",
    description: "Create ATS-optimized resumes and cover letters effortlessly.",
    button: { text: "Build Your Resume", link: "/resume-builder" },
  },
  {
    icon: <ShieldCheck className="w-6 h-6 mb-4 text-gray-400" />,
    title: "Check Your ATS Score",
    description: "Upload your resume and get feedback to improve your chances.",
    button: { text: "Check ATS Score", link: "/ats-checker" },
  },
  {
    icon: <Upload className="w-6 h-6 mb-4 text-gray-400" />,
    title: "Get Course Recommendations",
    description: "AI suggests the best courses to enhance your skills.",
    button: { text: "Find Best Courses", link: "/course-recommendations" },
  },  
  {
    icon: <Mic className="w-6 h-6 mb-4 text-gray-400" />,
    title: "Mock Interviews",
    description: "Get AI-driven interview feedback to enhance your skills.",
    button: { text: "Practice Now", link: "/mock-interview" },
  },
  {
    icon: <BarChart3 className="w-6 h-6 mb-4 text-gray-400" />,
    title: "Know Industry Trends",
    description: "Stay updated with salary insights and latest job trends.",
    button: { text: "Explore Insights", link: "/industry-insights" },
  },
  {
    icon: <Upload className="w-6 h-6 mb-4 text-gray-400" />,
    title: "Get Job Matches",
    description: "AI recommends the best job opportunities for you.",
    button: { text: "Find Jobs", link: "/latest-jobs" },
  },
  {
    icon: <Users className="w-6 h-6 mb-4 text-gray-400" />,
    title: "Shortlist Top Talent",
    description: "AI-powered tools for recruiters to filter resumes efficiently.",
    button: { text: "For Recruiters", link: "/recruiter-tools" },
  },
];

export default features;  