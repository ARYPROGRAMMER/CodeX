"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Code2,
  Trophy,
  Users,
  ArrowRight,
  Terminal,
  GitBranch,
  Star,
} from "lucide-react";
import Header from "../home/_components/Header";

const HomePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: number;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 2;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    
    const lines: { x: number; y: number; length: number; angle: number; speed: number; originalSpeed: number; thickness: number; }[] = [];
    for (let i = 0; i < 15; i++) {
      
      lines.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 250 + 150, 
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.03 + 0.01, 
        originalSpeed: Math.random() * 0.03 + 0.01,
        thickness: Math.random() * 1.5 + 0.5, 
      });
    }

    const animate = () => {
      
      ctx.fillStyle = "rgba(5, 5, 12, 0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      lines.forEach((line) => {
        const dx = mousePos.x - line.x;
        const dy = mousePos.y - window.scrollY - line.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        
        if (distance < 350) {
          
          line.speed = line.originalSpeed * 1.5; 
          const intensity = 1 - distance / 350;
          
          ctx.strokeStyle = `rgba(255, 255, 255, ${intensity * 1.0})`; 
          ctx.lineWidth = line.thickness + intensity * 2;

          
          ctx.shadowBlur = 20;
          ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
        } else {
          line.speed = line.originalSpeed;
          
          ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
          ctx.lineWidth = line.thickness;
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(
          line.x + Math.cos(line.angle) * line.length,
          line.y + Math.sin(line.angle) * line.length
        );
        ctx.stroke();

        
        ctx.shadowBlur = 0;

        
        line.x += Math.cos(line.angle) * line.speed;
        line.y += Math.sin(line.angle) * line.speed;

        
        if (line.x < -line.length) line.x = canvas.width + line.length;
        if (line.x > canvas.width + line.length) line.x = -line.length;
        if (line.y < -line.length) line.y = canvas.height + line.length;
        if (line.y > canvas.height + line.length) line.y = -line.length;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMouseMove = (e: { clientX: any; clientY: any }) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  return (
    <div className="relative min-h-screen bg-[#050508] overflow-x-hidden">
      {" "}
      {/* Darker background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.9 }} 
      />

      <Header />

      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-8">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              I Built CodeX
            </span>
            <span className="block text-white mt-2">Because I Can&apos;t Code</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join a global community of competitive programmers. Practice,
            compete, and elevate your coding skills to new heights.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/signup"
              className="group px-8 py-4 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-lg font-semibold transition flex items-center justify-center space-x-2"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contests"
              className="px-8 py-4 rounded-lg border border-purple-500 text-purple-400 hover:bg-purple-500/10 text-lg font-semibold transition"
            >
              Explore Contests
            </Link>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </section>
      {/* Features Section */}
      <section className="relative py-20 px-4 border-t border-purple-500/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Everything you need to excel in competitive programming
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Terminal className="h-8 w-8" />,
                title: "Real-time Code Execution",
                description:
                  "Write and test your code in 50+ programming languages with instant feedback.",
              },
              {
                icon: <Trophy className="h-8 w-8" />,
                title: "Live Competitions",
                description:
                  "Participate in contests and climb the global rankings.",
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Active Community",
                description:
                  "Learn from peers and share your knowledge with others.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl bg-white/5 border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-4 text-purple-400 group-hover:text-purple-300 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
  
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { value: "100,000+", label: "Active Users" },
              { value: "1M+", label: "Problems Solved" },
              { value: "10K+", label: "Daily Active Coders" },
            ].map((stat, index) => (
              <div key={index} className="p-6 rounded-xl bg-white/5">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to start your coding journey?
          </h2>
          <p className="text-gray-300 mb-8">
            Join thousands of developers who are already improving their skills
            on CodeX.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center px-8 py-4 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-lg font-semibold transition"
          >
            Get Started for Free
          </Link>
        </div>
      </section>
      {/* New Showcase Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl animate-pulse" />
              <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20">
                <pre className="text-sm text-gray-300 overflow-x-auto">
                  <code>{`#include <bits/stdc++.h>
using namespace std;

void solve() {
    
    int n;
    cin >> n;
    vector<int> a(n);
    
}`}</code>
                </pre>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                Advanced Code Editor
              </h3>
              <ul className="space-y-4">
                {[
                  "Syntax highlighting for 50+ languages",
                  "Real-time compilation and testing",
                  "Interactive debugging tools",
                  "Custom test cases",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Star className="h-6 w-6 text-purple-500 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* New Practice Section */}
      <section className="relative py-32 px-4 bg-gradient-to-b from-transparent to-purple-900/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Level Up Your Skills
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Daily Challenges",
                description: "New problems every day to keep your skills sharp",
                icon: <Terminal className="h-12 w-12" />,
                stats: "x+ problems",
              },
              {
                title: "Contests",
                description: "Weekly competitions with global rankings",
                icon: <Trophy className="h-12 w-12" />,
                stats: "Weekly prizes",
              },
              {
                title: "Learning Paths",
                description: "Structured courses for systematic learning",
                icon: <GitBranch className="h-12 w-12" />,
                stats: "y+ paths",
              },
            ].map((item, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                <div className="relative bg-black/40 backdrop-blur-xl p-8 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition">
                  <div className="text-purple-400 mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{item.description}</p>
                  <div className="text-sm text-purple-400">{item.stats}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      <section className="relative py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-16">
            Join Our Global Community
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: "z+", label: "Active Users" },
              { value: "zz+", label: "Submissions" },
              { value: "zzz+", label: "Discussions" },
              { value: "zzzz+", label: "Daily Contests" },
            ].map((stat, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                <div className="relative bg-black/40 backdrop-blur-xl p-6 rounded-lg border border-purple-500/20">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Enhanced Footer */}
      <footer className="relative bg-black/40 border-t border-purple-500/10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <Code2 className="h-8 w-8 text-purple-500" />
                <span className="text-2xl font-bold text-white">CodeX</span>
              </Link>
              <p className="text-gray-400 mb-6">
                Empowering the next generation of programmers through
                competitive coding.
              </p>
              <div className="flex space-x-4">
                {["github", "twitter", "discord"].map((social) => (
                  <a
                    key={social}
                    href={`#${social}`}
                    className="text-gray-400 hover:text-purple-400 transition"
                  >
                    <span className="sr-only">{social}</span>
                    
                  </a>
                ))}
              </div>
            </div>
            {[
              {
                title: "Product",
                links: ["Features", "Contests", "Enterprise", "Pricing"],
              },
              {
                title: "Resources",
                links: ["Documentation", "API", "Community", "Blog"],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Contact", "Legal"],
              },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="text-white font-semibold mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href="#"
                        className="text-gray-400 hover:text-purple-400 transition"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
