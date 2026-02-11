/**
 * Aurora University - Fake university website
 * Potential use: Phishing scenarios, credential harvesting, student portal access
 */

import { useState } from 'react';
import { WebsiteProps } from '../types';
import { WebsiteLayout, WebsiteHeader, WebsiteContainer, WebsiteFooter } from '../components/WebsiteLayout';
import { GraduationCap, User, BookOpen, Calendar, Mail } from 'lucide-react';

export function AuroraUniversity(_props: WebsiteProps) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <WebsiteLayout bg="bg-white">
      <WebsiteHeader
        bg="bg-blue-900"
        border={false}
        logo={
          <div className="flex items-center gap-2 text-white">
            <GraduationCap className="w-8 h-8" />
            <div>
              <div className="font-bold text-lg">Aurora University</div>
              <div className="text-xs text-blue-200">Est. 2020</div>
            </div>
          </div>
        }
        nav={
          <div className="flex gap-6 text-white/90 text-sm">
            <button className="hover:text-white transition-colors">About</button>
            <button className="hover:text-white transition-colors">Programs</button>
            <button className="hover:text-white transition-colors">Admissions</button>
            <button className="hover:text-white transition-colors">Research</button>
            <button className="hover:text-white transition-colors">Campus Life</button>
          </div>
        }
        actions={
          <button
            onClick={() => setShowLogin(!showLogin)}
            className="px-4 py-2 bg-white text-blue-900 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Student Portal
          </button>
        }
      />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <WebsiteContainer>
          <h1 className="text-5xl font-bold mb-4">Shape Your Future</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl">
            Join thousands of students in our world-class programs. Excellence in education since 2020.
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Apply Now
            </button>
            <button className="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors border border-blue-500">
              Virtual Tour
            </button>
          </div>
        </WebsiteContainer>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="w-8 h-8 text-blue-900" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Student Portal</h2>
                <p className="text-sm text-gray-600">Aurora University</p>
              </div>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID or Email
                </label>
                <input
                  type="text"
                  placeholder="student@aurora.edu"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-blue-600 hover:text-blue-700">
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                Sign In
              </button>
            </form>

            <button
              onClick={() => setShowLogin(false)}
              className="mt-4 w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <WebsiteContainer>
        <div className="grid grid-cols-3 gap-6 -mt-8 mb-12">
          {[
            { icon: BookOpen, label: 'Course Catalog', desc: 'Browse programs' },
            { icon: Calendar, label: 'Academic Calendar', desc: 'Important dates' },
            { icon: Mail, label: 'Webmail', desc: 'Check your email' },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            >
              <item.icon className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">{item.label}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* News Section */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Latest News</h2>
        <div className="grid grid-cols-2 gap-6 mb-12">
          {[
            {
              title: 'Aurora University Ranks Top 50 in Computer Science',
              date: 'January 3, 2026',
              image: 'bg-blue-100',
            },
            {
              title: 'New Cybersecurity Research Center Opens',
              date: 'December 28, 2025',
              image: 'bg-purple-100',
            },
          ].map((news, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <div className={`h-40 ${news.image}`} />
              <div className="p-5">
                <p className="text-xs text-gray-500 mb-2">{news.date}</p>
                <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  {news.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </WebsiteContainer>

      <WebsiteFooter bg="bg-gray-100">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">About</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Mission & Vision</div>
              <div>History</div>
              <div>Leadership</div>
              <div>Careers</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Academics</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Programs</div>
              <div>Faculties</div>
              <div>Libraries</div>
              <div>Research</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Campus</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Map</div>
              <div>Housing</div>
              <div>Dining</div>
              <div>Safety</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Contact</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>123 University Ave</div>
              <div>Aurora City, AC 12345</div>
              <div>info@aurora.edu</div>
              <div>(555) 123-4567</div>
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-gray-300 text-sm text-gray-600 text-center">
          © 2026 Aurora University. All rights reserved.
        </div>
      </WebsiteFooter>
    </WebsiteLayout>
  );
}
