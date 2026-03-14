export function Footer() {
  return (
    <footer className="py-8 px-4 md:px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-lg font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer">Primed</div>

        <div className="flex space-x-6 text-sm text-gray-300">
          {/* <a href="#" className="hover:text-white transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms
          </a> */}
          <a href="#" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>

        <p className="text-sm text-gray-300">
          © 2024 Primed. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
