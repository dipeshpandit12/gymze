"use client";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();
  const handleGetStarted = () => {
    router.push('/login');
  };
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Gymze
          </h1>
          <p className="text-gray-400 text-lg">
            AI-Powered Personal Gym Experience
          </p>
        </div>

        {/* Main Description */}
        <div className="bg-[#1A1A1A] rounded-lg border border-[#333333] p-8 mb-8">
          <p className="text-gray-300 text-lg leading-relaxed">
            Gymze transforms your workout experience through AI technology.
            Simply upload a video of your gym, and our smart system will detect
            available equipment to create personalized routines tailored just for you.
          </p>
        </div>

        {/* Key Features */}
        <div className="bg-[#1A1A1A] rounded-lg border border-[#333333] p-8">
          <h2 className="text-2xl font-bold mb-6">Core Features</h2>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="text-gray-300">Smart gym equipment detection via video upload</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="text-gray-300">Personalized workout routines based on available equipment</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="text-gray-300">Track and save multiple gym locations</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="text-gray-300">Monitor workout history and diet progress</span>
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <button
           onClick={handleGetStarted}
           className="bg-white text-black font-medium px-8 py-3 rounded-full
                           hover:opacity-90 transition-opacity">
            Get Started
          </button>
        </div>
      </main>
    </div>
  );
}