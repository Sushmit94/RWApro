import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: string) => {
    navigate(`/${role.toLowerCase()}`);
  };

  return (
    <div>
      <div className='bg-container'>
        <div className='grid-overlay'></div>
      </div>

    <div className='header-section'>
      <div className='nav-bar'>
        <div className="logo">InvoiceFinance</div>
            <nav className="nav-menu">
                <a href="#" className="nav-item">How it Works</a>
                <a href="#" className="nav-item">Marketplace</a>
                <a href="#" className="nav-item">Analytics</a>
                <a href="#" className="nav-item">Documentation</a>
            </nav>
            <div className="nav-buttons">
                
                <a href="#" className="btn-primary">Connect Wallet</a>
            </div>
      </div>

    </div>

    <div className='hero-section'>
      <div className="hero-content">
        <div className='hero-badge'>⚡ Powered by Chainlink Oracles</div>
        <h1 className="hero-title">InvoiceFinance</h1>
        <p className="hero-subtitle">Decentralized Invoice Financing Platform</p>
        <span className="hero-subtitle">Tokenize, Invest, and Trade Invoice Assets</span>
      </div>
    </div>

  
      <div className="flex justify-end mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 flex items-center gap-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-col">
            <span className="font-bold text-green-600 text-sm mb-1">🔗 Connected</span>
            <span className="font-mono text-xs text-gray-600">0x742d35Cc6639C24CcE0...9A4C</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">Balance:</span>
            <span className="font-bold text-blue-600 text-lg">5.2 ETH</span>
          </div>
        </div>
      </div>

     
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-4">Choose Your Role</h2>
        <p className="text-base sm:text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
          Select how you want to participate in the invoice financing ecosystem
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
       
          <div 
            className="bg-white rounded-xl p-8 shadow-lg text-center cursor-pointer transition-all duration-300 border-2 border-transparent hover:-translate-y-2 hover:shadow-xl hover:border-green-500 group"
            onClick={() => handleRoleSelection('supplier')}
          >
            <div className="role-icon bg-green-100 text-green-600 text-5xl mb-5 p-4 rounded-full inline-flex justify-center items-center w-20 h-20 transition-colors duration-300 group-hover:bg-green-200">📋</div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-800">Supplier</h3>
            <p className="text-base text-gray-600 mb-6 min-h-[70px]">
              Create and manage invoices, get them verified, and receive early payments through tokenization
            </p>
            <div className="flex flex-col items-start mb-6 text-gray-700 text-base gap-2 pl-5">
              <span className="flex items-center before:content-['\2714'] before:text-green-500 before:mr-2 before:font-bold">Create Invoices</span>
              <span className="flex items-center before:content-['\2714'] before:text-green-500 before:mr-2 before:font-bold">ERP Verification</span>
              <span className="flex items-center before:content-['\2714'] before:text-green-500 before:mr-2 before:font-bold">Early Payment</span>
            </div>
            <button className="bg-green-600 text-white py-3 px-6 rounded-md text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-green-700 hover:-translate-y-0.5">Get Started</button>
          </div>

      
          <div 
            className="bg-white rounded-xl p-8 shadow-lg text-center cursor-pointer transition-all duration-300 border-2 border-transparent hover:-translate-y-2 hover:shadow-xl hover:border-yellow-500 group"
            onClick={() => handleRoleSelection('buyer')}
          >
            <div className="role-icon bg-yellow-100 text-yellow-600 text-5xl mb-5 p-4 rounded-full inline-flex justify-center items-center w-20 h-20 transition-colors duration-300 group-hover:bg-yellow-200">💳</div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-800">Buyer</h3>
            <p className="text-base text-gray-600 mb-6 min-h-[70px]">
              View your invoices, make payments, and manage your payment obligations with automated processing
            </p>
            <div className="flex flex-col items-start mb-6 text-gray-700 text-base gap-2 pl-5">
              <span className="flex items-center before:content-['\2714'] before:text-green-500 before:mr-2 before:font-bold">View Invoices</span>
              <span className="flex items-center before:content-['\2714'] before:text-green-500 before:mr-2 before:font-bold">Make Payments</span>
              <span className="flex items-center before:content-['\2714'] before:text-green-500 before:mr-2 before:font-bold">Track Status</span>
            </div>
            <button className="bg-yellow-600 text-white py-3 px-6 rounded-md text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-yellow-700 hover:-translate-y-0.5">Get Started</button>
          </div>

      
          <div 
            className="bg-white rounded-xl p-8 shadow-lg text-center cursor-pointer transition-all duration-300 border-2 border-transparent hover:-translate-y-2 hover:shadow-xl hover:border-purple-500 group"
            onClick={() => handleRoleSelection('investor')}
          >
            <div className="role-icon bg-purple-100 text-purple-600 text-5xl mb-5 p-4 rounded-full inline-flex justify-center items-center w-20 h-20 transition-colors duration-300 group-hover:bg-purple-200">💰</div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-800">Investor</h3>
            <p className="text-base text-gray-600 mb-6 min-h-[70px]">
              Invest in tokenized invoices, earn returns, and diversify your portfolio with invoice assets
            </p>
            <div className="flex flex-col items-start mb-6 text-gray-700 text-base gap-2 pl-5">
              <span className="flex items-center before:content-['\2714'] before:text-green-500 before:mr-2 before:font-bold">Buy Tokens</span>
              <span className="flex items-center before:content-['\2714'] before:text-green-500 before:mr-2 before:font-bold">Earn Returns</span>
              <span className="flex items-center before:content-['\2714'] before:text-green-500 before:mr-2 before:font-bold">Portfolio Tracking</span>
            </div>
            <button className="bg-purple-600 text-white py-3 px-6 rounded-md text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-purple-700 hover:-translate-y-0.5">Get Started</button>
          </div>
        </div>
      </div>

 
      <div className="hero-stats">
        <div className="stat-item">
          <div className="stat-number">$2.5M+</div>
          <div className="stat-label">Total Volume</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">450+</div>
          <div className="stat-label">Invoices Processed</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">98%</div>
          <div className="stat-label">Success Rate</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">12.5%</div>
          <div className="stat-label">Avg. ROI</div>
        </div>
      </div>

  
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    
          <div className="bg-white rounded-xl p-8 shadow-md text-center border-t-4 border-blue-600 transition-transform duration-200 hover:-translate-y-1">
            <div className="text-4xl font-bold text-blue-600 bg-blue-100 rounded-full w-16 h-16 inline-flex justify-center items-center mb-5">1</div>
            <h4 className="text-2xl font-semibold text-gray-800 mb-2">Create Invoice</h4>
            <p className="text-base text-gray-600">Suppliers create invoices and submit for verification</p>
          </div>
     
          <div className="bg-white rounded-xl p-8 shadow-md text-center border-t-4 border-blue-600 transition-transform duration-200 hover:-translate-y-1">
            <div className="text-4xl font-bold text-blue-600 bg-blue-100 rounded-full w-16 h-16 inline-flex justify-center items-center mb-5">2</div>
            <h4 className="text-2xl font-semibold text-gray-800 mb-2">Verify & Tokenize</h4>
            <p className="text-base text-gray-600">ERP systems verify invoices, then they're tokenized</p>
          </div>
     
          <div className="bg-white rounded-xl p-8 shadow-md text-center border-t-4 border-blue-600 transition-transform duration-200 hover:-translate-y-1">
            <div className="text-4xl font-bold text-blue-600 bg-blue-100 rounded-full w-16 h-16 inline-flex justify-center items-center mb-5">3</div>
            <h4 className="text-2xl font-semibold text-gray-800 mb-2">Invest & Trade</h4>
            <p className="text-base text-gray-600">Investors buy tokens representing invoice shares</p>
          </div>
     
          <div className="bg-white rounded-xl p-8 shadow-md text-center border-t-4 border-blue-600 transition-transform duration-200 hover:-translate-y-1">
            <div className="text-4xl font-bold text-blue-600 bg-blue-100 rounded-full w-16 h-16 inline-flex justify-center items-center mb-5">4</div>
            <h4 className="text-2xl font-semibold text-gray-800 mb-2">Payment & Distribution</h4>
            <p className="text-base text-gray-600">Buyers pay, funds are automatically distributed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;