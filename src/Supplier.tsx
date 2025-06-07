import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Supplier.css'

interface Invoice {
  id: number;
  buyer: string;
  amount: number;
  dueDate: string;
  status: 'Pending' | 'Verifying' | 'Approved' | 'Rejected' | 'Paid';
  totalInvestment: number;
  investors: number;
}

const Supplier: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newInvoice, setNewInvoice] = useState({
    id: '',
    buyer: '',
    amount: '',
    dueDate: ''
  });
  const [verifyInvoice, setVerifyInvoice] = useState({
    id: '',
    amount: ''
  });

  const [invoices] = useState<Invoice[]>([
    {
      id: 12344,
      buyer: '0x742d35Cc6639C24CcE049A4C',
      amount: 25000,
      dueDate: '2025-07-15',
      status: 'Approved',
      totalInvestment: 18500,
      investors: 7
    },
    {
      id: 12343,
      buyer: '0x8b3f9c4d5e6f7a8b9c0d1e2f',
      amount: 40000,
      dueDate: '2025-08-20',
      status: 'Verifying',
      totalInvestment: 0,
      investors: 0
    },
    {
      id: 12342,
      buyer: '0x1a2b3c4d5e6f7a8b9c0d1e2f',
      amount: 15000,
      dueDate: '2025-06-01',
      status: 'Paid',
      totalInvestment: 15000,
      investors: 4
    }
  ]);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating invoice:', newInvoice);
    // Contract interaction would go here
    alert('Invoice created successfully!');
    setNewInvoice({ id: '', buyer: '', amount: '', dueDate: '' });
  };

  const handleVerifyInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Verifying invoice:', verifyInvoice);
    // Contract interaction would go here
    alert('Invoice verification initiated!');
    setVerifyInvoice({ id: '', amount: '' });
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Pending': 'status-pending',
      'Verifying': 'status-verification',
      'Approved': 'status-approved',
      'Rejected': 'status-rejected',
      'Paid': 'status-paid'
    };
    return <span className={`status-badge ${statusClasses[status as keyof typeof statusClasses]}`}>{status}</span>;
  };

  return (
    <div>
      <div className="bg-container">
        <div className="grid-overlay"></div>
      </div>
      <div className="header">
        <div className='nav-section'>
      <a href="#" className="logo">InvoiceFinance</a>
      <div className="nav-menu"></div>
        <button 
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Invoice
        </button>
        <button 
          className={`tab ${activeTab === 'verify' ? 'active' : ''}`}
          onClick={() => setActiveTab('verify')}
        >
          Verify Invoice
        </button>
        <div className="wallet-info">
          <span className="wallet-address">0x742d35Cc6639C24CcE0...9A4C</span>
          <span className="wallet-balance">5.2 ETH</span>
        </div>
        </div>
        </div>
        
        
      

      {activeTab === 'dashboard' && (
        <div className='main-content'>
        <div className="dashboard-content">
          <div className="header-content">
          <h1 className='dashboard-title'>Supplier Dashboard</h1>
          <p className='dashboard-subtitle'>Manage your invoices and track payments</p>
        </div>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Invoices</h3>
              <div className="stat-number">23</div>
              <span className="stat-change">+3 this month</span>
            </div>
            <div className="stat-card">
              <h3>Total Value</h3>
              <div className="stat-number">$180K</div>
              <span className="stat-change">+15% from last month</span>
            </div>
            <div className="stat-card">
              <h3>Pending Payment</h3>
              <div className="stat-number">$65K</div>
              <span className="stat-change">2 invoices</span>
            </div>
            <div className="stat-card">
              <h3>Average ROI</h3>
              <div className="stat-number">8.5%</div>
              <span className="stat-change">for investors</span>
            </div>
          </div>

          <div className="invoice-list-section">
            
            <h2>Your Invoices</h2>
            <div className="invoice-list">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="invoice-item">
                  <div className="invoice-header">
                    <div className="invoice-id">Invoice #{invoice.id}</div>
                    {getStatusBadge(invoice.status)}
                  </div>
                  <div className="invoice-details">
                    <div className="detail-item">
                      <div className="detail-label">Amount</div>
                      <div className="detail-value">${invoice.amount.toLocaleString()}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Due Date</div>
                      <div className="detail-value">{new Date(invoice.dueDate).toLocaleDateString()}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Investment</div>
                      <div className="detail-value">${invoice.totalInvestment.toLocaleString()}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Investors</div>
                      <div className="detail-value">{invoice.investors} Active</div>
                    </div>
                  </div>
                  <div className="invoice-actions">
                    <button className="btn btn-small">View Details</button>
                    {invoice.status === 'Pending' && (
                      <button className="btn btn-small btn-primary">Verify</button>
                    )}
                  </div>
                  </div>
                
              ))}
            </div>
            </div>
          </div>
          
        </div>
      )}

      {activeTab === 'create' && (
        <div className='main-content'>
        <div className="create-invoice-section">
          <div className="form-card">
            <h2>📋 Create New Invoice</h2>
            <form onSubmit={handleCreateInvoice}>
              <div className="form-group">
                <label>Invoice ID</label>
                <input
                  type="number"
                  placeholder="Enter unique invoice ID"
                  value={newInvoice.id}
                  onChange={(e) => setNewInvoice({ ...newInvoice, id: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Buyer Address</label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={newInvoice.buyer}
                  onChange={(e) => setNewInvoice({ ...newInvoice, buyer: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Invoice Amount (USD)</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Create Invoice</button>
            </form>
          </div>
          </div>
        </div>
      )}

      {activeTab === 'verify' && (
        <div className='main-content'>
        <div className="verify-invoice-section">
          <div className="form-card">
            <h2>🔍 Invoice Verification</h2>
            <p className="verification-info">
              Connect with your ERP system to verify invoice authenticity using Chainlink Functions
            </p>
            <form onSubmit={handleVerifyInvoice}>
              <div className="form-group">
                <label>Invoice ID to Verify</label>
                <input
                  type="number"
                  placeholder="Enter invoice ID"
                  value={verifyInvoice.id}
                  onChange={(e) => setVerifyInvoice({ ...verifyInvoice, id: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Expected Amount</label>
                <input
                  type="number"
                  placeholder="Amount for verification"
                  value={verifyInvoice.amount}
                  onChange={(e) => setVerifyInvoice({ ...verifyInvoice, amount: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                🔒 Verify with ERP System
              </button>
            </form>
            <div className="verification-status">
              <h3>Recent Verifications</h3>
              <div className="verification-item">
                <span>Invoice #12343</span>
                <span className="status-verification">In Progress...</span>
              </div>
              <div className="verification-item">
                <span>Invoice #12344</span>
                <span className="status-approved">✅ Verified</span>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Supplier;