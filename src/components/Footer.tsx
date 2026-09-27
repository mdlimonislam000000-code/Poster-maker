export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-800/60 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-xl font-extrabold text-white tracking-wide">
              Poster Maker <span className="text-blue-500">BD</span>
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              A modern platform for local political workers and campaigners to instantly generate professional and print-ready posters.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#templates" className="hover:text-blue-400 transition-colors">Templates</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="hover:text-blue-400 transition-colors cursor-pointer">Victory Day</span></li>
              <li><span className="hover:text-blue-400 transition-colors cursor-pointer">Election Campaign</span></li>
              <li><span className="hover:text-blue-400 transition-colors cursor-pointer">Tribute & Mourning</span></li>
              <li><span className="hover:text-blue-400 transition-colors cursor-pointer">Greetings & Festivals</span></li>
            </ul>
          </div>

          {/* Contact / Support */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Support
            </h4>
            <p className="text-sm text-gray-400 mb-3">
              Feel free to reach out to us for any assistance.
            </p>
            <span className="text-blue-400 text-sm font-medium">support@postermaker.bd</span>
          </div>

        </div>

        {/* Bottom Divider & Copyright */}
        <div className="border-t border-gray-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Poster Maker BD. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
}