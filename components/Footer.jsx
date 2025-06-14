import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-gray-300 border-t border-gray-800 pt-14 pb-10 px-4 md:px-8">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
    {/* Logo and Tagline */}
    <div className="col-span-1">
      <div className="flex items-center gap-2 mb-4">
        <img src="/skill.png" alt="EdgeCareer Logo" className="h-6 w-auto" />
        <span className="text-xl md:text-2xl font-extrabold tracking-wide text-white">EdgeCareer</span>

      </div>
      <p className="text-gray-400">
        Your AI-powered assistant for jobs, resumes, mock interviews, and beyond.
      </p>
    </div>

    {/* Navigation */}
    <div>
     <h3 className="text-xl md:text-2xl font-bold mb-4 text-white border-b border-white/20 pb-1">
        Explore
      </h3>


      <ul className="space-y-2">
        <li><a href="/dashboard" className="hover:text-white transition">Dashboard</a></li>
        <li><a href="/resume" className="hover:text-white transition">Resume Builder</a></li>
        <li><a href="/interview" className="hover:text-white transition">Mock Interviews</a></li>
        <li><a href="/ai-cover-letter" className="hover:text-white transition">AI Cover Letter</a></li>
      </ul>
    </div>

    {/* Resources */}
    <div>
      <h3 className="text-xl md:text-2xl font-bold mb-4 text-white border-b border-white/20 pb-1">
        Resources
      </h3>

      <ul className="space-y-2">
        <li><a href="/blog" className="hover:text-white transition">Tech Blog</a></li>
        <li><a href="/careers" className="hover:text-white transition">Careers</a></li>
        <li><a href="/terms" className="hover:text-white transition">Terms of Use</a></li>
        <li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
      </ul>
    </div>

    {/* Newsletter & Social */}
    <div>
      <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">Stay Updated</h3>
      <form className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Your email"
          className="bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
        >
          Subscribe
        </button>
      </form>

     <div className="flex gap-4 mt-6">
  <a
    href="https://github.com/amitkumardemo/EdgeCareer"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-primary transition-colors"
  >
    <Github className="h-6 w-6 hover:scale-110 transition-transform" />
  </a>
  <a
    href="https://www.linkedin.com/in/amit-kumar-686196225/"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-primary transition-colors"
  >
    <Linkedin className="h-6 w-6 hover:scale-110 transition-transform" />
  </a>
  <a
    href="mailto:amitk25783@gmail.com"
    className="hover:text-primary transition-colors"
  >
    <Mail className="h-6 w-6 hover:scale-110 transition-transform" />
  </a>
</div>
    </div>
  </div>

  <div className="text-center text-gray-500 text-xs mt-10">
    © {new Date().getFullYear()} EdgeCareer. Built with 💡 by Edge Career.
  </div>
</footer>


  );
}
