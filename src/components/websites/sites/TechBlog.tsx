/**
 * TechBlog - Fake tech blog/news website
 * Potential use: Social engineering, fake download links, XSS demonstrations
 */

import { WebsiteProps } from '../types';
import { WebsiteLayout, WebsiteHeader, WebsiteContainer, WebsiteFooter } from '../components/WebsiteLayout';
import { Search, TrendingUp, Code2, Database, Shield, Cpu } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'New Zero-Day Vulnerability Discovered in Popular Framework',
    excerpt: 'Security researchers have identified a critical vulnerability affecting millions of websites...',
    author: 'Alex Rivera',
    date: 'January 4, 2026',
    category: 'Security',
    icon: Shield,
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  {
    id: 2,
    title: 'The Rise of Quantum Computing: What Developers Need to Know',
    excerpt: 'Quantum computing is no longer science fiction. Here\'s how it will impact software development...',
    author: 'Dr. Sarah Chen',
    date: 'January 3, 2026',
    category: 'Emerging Tech',
    icon: Cpu,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    id: 3,
    title: 'Building Scalable APIs: Best Practices for 2026',
    excerpt: 'Learn the latest techniques for designing APIs that can handle millions of requests...',
    author: 'Marcus Johnson',
    date: 'January 2, 2026',
    category: 'Backend',
    icon: Database,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    id: 4,
    title: 'TypeScript 6.0: Revolutionary Features That Change Everything',
    excerpt: 'The TypeScript team just released version 6.0 with groundbreaking new features...',
    author: 'Emma Wilson',
    date: 'January 1, 2026',
    category: 'Languages',
    icon: Code2,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
];

export function TechBlog(_props: WebsiteProps) {
  return (
    <WebsiteLayout bg="bg-gray-50">
      <WebsiteHeader
        bg="bg-white"
        logo={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg" />
            <span className="text-xl font-bold text-gray-900">TechBlog</span>
          </div>
        }
        nav={
          <div className="flex gap-8 text-gray-600 text-sm font-medium">
            <button className="hover:text-gray-900 transition-colors">Latest</button>
            <button className="hover:text-gray-900 transition-colors">Tutorials</button>
            <button className="hover:text-gray-900 transition-colors">News</button>
            <button className="hover:text-gray-900 transition-colors">Security</button>
            <button className="hover:text-gray-900 transition-colors">Careers</button>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        }
      />

      {/* Hero Article */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-16">
        <WebsiteContainer>
          <div className="flex items-center gap-2 text-blue-300 mb-4">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">TRENDING NOW</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 max-w-3xl">
            Critical Security Flaw Affects 80% of Web Applications
          </h1>
          <p className="text-xl text-blue-100 mb-6 max-w-2xl">
            Researchers warn that a widespread vulnerability in authentication systems could expose millions of user accounts.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-blue-200">By Security Team</span>
            <span className="text-blue-300">•</span>
            <span className="text-blue-200">5 min read</span>
            <span className="text-blue-300">•</span>
            <span className="text-blue-200">January 5, 2026</span>
          </div>
        </WebsiteContainer>
      </div>

      <WebsiteContainer className="py-12">
        {/* Articles Grid */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          {articles.map((article) => {
            const Icon = article.icon;
            return (
              <div
                key={article.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className={`h-48 ${article.bg} flex items-center justify-center`}>
                  <Icon className={`w-16 h-16 ${article.color}`} />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold ${article.color} uppercase tracking-wide`}>
                      {article.category}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{article.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                    <span>{article.author}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto">
            Get the latest tech news, tutorials, and insights delivered to your inbox every week.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your.email@example.com"
              className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-blue-200 mt-4">
            Join 50,000+ developers. No spam, unsubscribe anytime.
          </p>
        </div>
      </WebsiteContainer>

      <WebsiteFooter>
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Categories</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Web Development</div>
              <div>Mobile Apps</div>
              <div>Cloud Computing</div>
              <div>AI & Machine Learning</div>
              <div>DevOps</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Tutorials</div>
              <div>Cheat Sheets</div>
              <div>Tools</div>
              <div>Books</div>
              <div>Courses</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>About Us</div>
              <div>Write for Us</div>
              <div>Advertise</div>
              <div>Careers</div>
              <div>Contact</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Twitter</div>
              <div>GitHub</div>
              <div>LinkedIn</div>
              <div>YouTube</div>
              <div>Discord</div>
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-gray-300 text-sm text-gray-600 text-center">
          © 2026 TechBlog. All rights reserved.
        </div>
      </WebsiteFooter>
    </WebsiteLayout>
  );
}
