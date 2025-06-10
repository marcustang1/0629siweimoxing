import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-card py-12 mt-auto">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <a href="#" className="text-xl font-semibold text-primary">
              InsightBlast AI
            </a>
            <p className="mt-2 text-secondary text-sm">
              Uncover deeper insights through multiple perspectives.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8">
            <div>
              <h4 className="font-medium text-primary mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-secondary hover:text-accent transition-colors text-sm">Features</a></li>
                <li><a href="#" className="text-secondary hover:text-accent transition-colors text-sm">Pricing</a></li>
                <li><a href="#" className="text-secondary hover:text-accent transition-colors text-sm">Case Studies</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-primary mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-secondary hover:text-accent transition-colors text-sm">About</a></li>
                <li><a href="#" className="text-secondary hover:text-accent transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-secondary hover:text-accent transition-colors text-sm">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-primary mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-secondary hover:text-accent transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="text-secondary hover:text-accent transition-colors text-sm">Documentation</a></li>
                <li><a href="#faq" className="text-secondary hover:text-accent transition-colors text-sm">FAQ</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-separator flex flex-col md:flex-row justify-between items-center">
          <p className="text-secondary text-sm">
            © {currentYear} InsightBlast AI. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-secondary hover:text-accent transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-secondary hover:text-accent transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-secondary hover:text-accent transition-colors text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;