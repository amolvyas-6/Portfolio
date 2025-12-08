export interface PersonalDetails {
  name: string;
  displayName?: string;
  headline: string;
  dob: string;
  role?: string;
  location: string;
  email?: string;
  website?: string;
  bio: string;
}

export interface KeySkills {
  id: string;
  name: string;
  category?: "language" | "framework" | "tool" | "other";
  icon?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  username?: string;
  icon?: string;
}

export interface TimelineItem {
  id: string;
  type: "experience" | "education";
  title: string;
  organization: string;
  startDate: string; // ISO date or yyyy-mm
  endDate?: string | null; // null means present
  location?: string;
  description?: string[];
  tags?: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  type: "work" | "personal";
  tech: string[];
  demoUrl?: string;
  repoUrl?: string;
  featured?: boolean;
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

const dob = "2005-06-30"; // Your date of birth (YYYY-MM-DD)

export const personalDetails: PersonalDetails = {
  name: "Amol Vyas",
  displayName: "A. Vyas",
  dob: dob,
  headline: `${calculateAge(dob)} y/o`,
  role: "Software Engineer",
  location: "Bangalore, India",
  email: "amol.vyas0630@gmail.com",
  website: "https://amolvyas.is-a.dev",
  bio: "I have a keen interest in Artificial Intelligence and Machine Learning and am passionate about problem solving and learning new technologies",
};

export const keySkills: KeySkills[] = [
  { id: "ts", name: "TypeScript", category: "language", icon: "typescript" },
  { id: "react", name: "React", category: "framework", icon: "react" },
  { id: "tailwind", name: "Tailwind CSS", category: "tool", icon: "tailwind" },
  { id: "python", name: "Python", category: "language", icon: "python" },
  { id: "node", name: "Node.js", category: "framework", icon: "nodejs" },
  { id: "docker", name: "Docker", category: "tool", icon: "docker" },
  { id: "pytorch", name: "PyTorch", category: "framework", icon: "pytorch" },
  { id: "git", name: "Git", category: "tool", icon: "git" },
  { id: "c", name: "C", category: "language", icon: "c" },
];

export const socialLinks: SocialLink[] = [
  {
    id: "github",
    platform: "GitHub",
    url: "https://github.com/amolvyas-6",
    username: "amolvyas-6",
    icon: "github",
  },
  {
    id: "linkedin",
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/amol-vyas-918601293/",
    username: "amol-vyas-918601293",
    icon: "linkedin",
  },
];

export const timeline: TimelineItem[] = [
  {
    id: "ex2",
    type: "experience",
    title: "Research Intern",
    organization: "Samsung PRISM",
    startDate: "2025-05",
    endDate: null,
    location: "Remote",
    description: [
      "Developed a state-of-the-art Language Identification (LID) system to detect physical replay-based audio spoofing in Kannada",
      "Built an end-to-end research pipeline from audio preprocessing and feature extraction to model training using PyTorch and model evaluation for secure voice-based applications.",
    ],
    tags: [
      "Audio Spoofing Detection",
      "PyTorch",
      "Signal Processing",
      "Deep Learning",
    ],
  },
  {
    id: "ex1",
    type: "experience",
    title: "Developer",
    organization: "Bhatiyani Astute Intelligence",
    startDate: "2024-10",
    endDate: "2025-04",
    location: "Remote",
    description: [
      "Developed an offline tap-to-pay wallet using NFC and ESP32, designed for blind users",
      "Implemented haptic-based PIN entry for two-factor authentication, enabling secure transactions without screens or internet.",
      "Integrated EEPROM-based data storage, AES encryption, and physical key support for added security",
    ],
    tags: [
      "Embedded Systems",
      "ESP-IDF",
      "PN532 NFC",
      "AT24C32 EEPROM",
      "ESP32-S3",
    ],
  },
  {
    id: "ed3",
    type: "education",
    title: "BE in Computer Science",
    organization: "RV College of Engineering",
    startDate: "2023-10",
    endDate: null,
    location: "Bangalore, India",
    description: [
      "Pursuing Bachelor's in Computer Science and Engineering",
      "CGPA: 9.46/10",
    ],
  },
  {
    id: "ed2",
    type: "education",
    title: "Higher Secondary Education - Science Stream",
    organization: "Christ Academy Junior College",
    startDate: "2021-08",
    endDate: "2023-05",
    location: "Bangalore, India",
    description: ["Graduated 12th Grade with 96.2%", "CBSE Board"],
  },
  {
    id: "ed1",
    type: "education",
    title: "Secondary Education - Science Stream",
    organization: "Christ Academy ICSE School",
    startDate: "2018-08",
    endDate: "2021-07",
    location: "Bangalore, India",
    description: ["Graduated 10th Grade with 98.17%", "ICSE Board"],
  },
];

export const projects: ProjectItem[] = [
  {
    id: "work1",
    title: "Offline Wallet For the Blind",
    description:
      "Developed an offline NFC tap-to-pay wallet on ESP32 for blind users, featuring haptic PIN-based authentication with encrypted local storage for secure, screenless transactions.",
    type: "work",
    tech: ["ESP-IDF", "C", "Cpp", "PN532 NFC", "ESP32-S3", "ATC24C256 EEPROM"],
    featured: false,
  },
  {
    id: "work2",
    title: "Language Identification for Audio Spoofing Detection",
    description:
      "Developed a state-of-the-art Language Identification (LID) system under Samsung PRISM to detect physically replayed and spoofed Kannada audio.",
    type: "work",
    tech: ["PyTorch", "Python", "Deep Learning", "Signal Processing"],
    featured: true,
  },
  {
    id: "per1",
    title: "Hand Sight",
    description:
      "Developed a hand gesture recognition system enabling touchless computer control. Implemented gesture, cursor, and ASL modes. Designed intuitive interactions for tasks like media control and window navigation. Integrated real-time tracking for seamless user experience.",
    type: "personal",
    tech: ["Python", "OpenCV", "MediaPipe", "Tkinter", "TensorFlow"],
    repoUrl: "https://github.com/amolvyas-6/GestureX/tree/amol",
    featured: true,
  },
  {
    id: "per2",
    title: "Job Recommendation System",
    description:
      "Developed a website that allows users to upload their CV and in turn recommends them jobs based on their current skill set by leveraging techniques such as TF-IDF and cosine similarity. It also provides the user with a road-map to improve their skills and progress in their current field of work.",
    type: "personal",
    tech: [
      "Python",
      "spaCy",
      "scikit-learn",
      "numpy",
      "pandas",
      "streamlit",
      "PyPDF2",
    ],
    repoUrl: "https://github.com/amolvyas-6/Job-Recommendation-System",
    featured: true,
  },
  {
    id: "per3",
    title: "Adept AI",
    description:
      "Developed an AI-powered personal tutor, that is designed to be every student's personal academic GURU that will transform a student's digital learning library into an interactive and engaging learning experience.",
    type: "personal",
    tech: [
      "Python",
      "Node.js",
      "React",
      "Flask",
      "LangChain",
      "PyPDF2",
      "tailwind",
      "MongoDB",
    ],
    repoUrl: "https://github.com/JustAkshatG/ADEPT",
    featured: true,
  },
  {
    id: "per4",
    title: "Wildlife Detection using YOLOv8",
    description:
      "Developed a wildlife detection system using YOLOv8. Implemented message queuing with RabbitMQ for efficient data processing and S3 like storage solution using MinIO to store and retrieve images and detection results. Dockerized the entire application for easy deployment.",
    type: "personal",
    tech: ["Python", "RabbitMQ", "MinIO", "FastAPI", "YOLOv8", "Docker"],
    repoUrl: "https://github.com/amolvyas-6/Wildlife-Detection-Using-AI",
    featured: true,
  },
];

export default {
  personalDetails,
  techStack: keySkills,
  socialLinks,
  timeline,
  projects,
};
