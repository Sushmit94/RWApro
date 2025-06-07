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
        <h1 className="hero-title">Transform Invoices into Liquid Assets</h1>
        <p className="hero-subtitle">Decentralized Invoice Financing Platform</p>
        <span className="hero-subtitle">Tokenize, Invest, and Trade Invoice Assets</span>
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

    <div className="wallet-container">
  <div className="wallet-card">
    <div className="wallet-status">
      <span className="wallet-connected">🔗 Connected</span>
      <span className="wallet-address">0x742d35Cc6639C24CcE0...9A4C</span>
    </div>
    <div className="wallet-balance">
      <span className="balance-label">Balance:</span>
      <span className="balance-amount">5.2 ETH</span>
    </div>
  </div>
</div>

      
      <div className="roles-section">
        <div className='roles-header'>
        <h2 className="roles-title">Choose Your Role</h2>
        <p className="roles-subtitle">
          Select how you want to participate in the invoice financing ecosystem
        </p>
        </div>
        
        <div className="roles-grid">
          <div className='role-card'>
          <div 
            className=""
            onClick={() => handleRoleSelection('supplier')}
          >
            <div className="role-icon">📋</div>
            <h3 className="role-title">Supplier</h3>
            
            <div className="role-process">
              <span className="role-description">Create Invoices<br/></span>
              <span className="role-description">ERP Verification<br/></span>
              <span className="role-description">Early Payment<br/><br/></span>
            </div>
            <button className="btn-primary">Get Started</button>
          </div>
          </div>

          <div className='role-card'>
          <div 
            className=""
            onClick={() => handleRoleSelection('buyer')}
          >
            <div className="role-icon">💳</div>
            <h3 className="role-title">Buyer</h3>
            
            <div className="role-process">
              <span className="role-description">View Invoices<br/></span>
              <span className="role-description">Make Payments<br/></span>
              <span className="role-description">Track Status<br/><br/></span>
            </div>
            <button className="btn-primary">Get Started</button>
          </div>
          </div>

          <div className='role-card'>
          <div 
            className=""
            onClick={() => handleRoleSelection('investor')}
          >
            <div className="role-icon">💰</div>
            <h3 className="role-title">Investor</h3>
            
            <div className="role-process">
              <span className="role-description">Buy Tokens<br/></span>
              <span className="role-description">Earn Returns<br/></span>
              <span className="role-description">Portfolio Tracking<br/><br/></span>
            </div>
            <button className="btn-primary">Get Started</button>
          </div>
          </div>
        </div>
      </div>

 


  
      <div className="steps-section">
        <div className='steps-header'>
        <h2 className="steps-title">How It Works</h2>
        <p className="steps-subtitle">Four simple steps to transform your invoices into tradeable tokens</p>
        </div>
        <div className="steps-grid">
          
    
          <div className="step-card">
            <div className="step-number">1</div>
            <h4 className="step-title">Create Invoice</h4>
            <p className="step-description">Suppliers create invoices and submit for verification</p>
          </div>
     
          <div className="step-card">
            <div className="step-number">2</div>
            <h4 className="step-title">Verify & Tokenize</h4>
            <p className="step-description">ERP systems verify invoices, then they're tokenized</p>
          </div>
     
          <div className="step-card">
            <div className="step-number">3</div>
            <h4 className="step-title">Invest & Trade</h4>
            <p className="step-description">Investors buy tokens representing invoice shares</p>
          </div>
     
          <div className="step-card">
            <div className="step-number">4</div>
            <h4 className="step-title">Payment & Distribution</h4>
            <p className="step-description">Buyers pay, funds are automatically distributed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;