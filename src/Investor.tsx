import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Investor.css'
 // Assuming you'll create a separate CSS file for Investor
// Import your Web3 setup and contract ABI here
// import { useWeb3Context } from '../path/to/Web3Context'; // Example context
// import MainContractABI from '../contracts/Main.json'; // Your compiled contract ABI
// import InvoiceTokenABI from '../contracts/InvoiceToken.json'; // ABI for InvoiceToken
// import { ethers } from 'ethers';

interface Invoice {
  id: number;
  supplier: string;
  buyer: string; // Added buyer for clarity
  amount: number; // Original amount in USD
  dueDate: string; // YYYY-MM-DD
  status: 'Pending' | 'VerificationInProgress' | 'Approved' | 'Rejected' | 'Paid';
  totalInvestment: number; // Sum of tokens purchased by all investors
  investors: string[]; // List of investor addresses
  // Frontend specific:
  _myInvestment?: number; // How much *this* investor has put in (for display)
  _expectedReturn?: number; // My investment + share of penalty/profit
  _currentAPY?: string; // Calculated APY for an invoice
}

// Dummy ETH/USD conversion rate for frontend display
const ETH_TO_USD_RATE = 3500; // Example: 1 ETH = $3500 USD
const TARGET_APY = 0.15; // Example target 15% APY for an approved invoice

const Investor: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [investAmount, setInvestAmount] = useState<string>(''); // Amount of tokens to buy (in USD)
  const [walletAddress, setWalletAddress] = useState<string>('0x...'); // Placeholder
  const [walletBalance, setWalletBalance] = useState<string>('0.00'); // Placeholder

  // In a real dApp, these would be fetched from the smart contract
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 12344,
      supplier: 'TechCorp Ltd',
      buyer: 'BuyerA',
      amount: 25000,
      dueDate: '2025-07-15',
      status: 'Approved',
      totalInvestment: 0,
      investors: [],
    },
    {
      id: 12345,
      supplier: 'Manufacturing Inc',
      buyer: 'BuyerB',
      amount: 35000,
      dueDate: '2025-06-20',
      status: 'Paid', // Example of a paid invoice from investor perspective
      totalInvestment: 35000,
      investors: ['0x742d35Cc6639C24CcE0...9A4C'], // Assuming investor has invested
      _myInvestment: 10000, // This investor invested 10k
      _expectedReturn: 10500, // Example return
    },
    {
      id: 12347,
      supplier: 'Creative Solutions',
      buyer: 'BuyerC',
      amount: 18000,
      dueDate: '2025-08-01',
      status: 'Approved',
      totalInvestment: 5000, // Partially funded
      investors: ['0x123...abc'],
    },
    {
      id: 12348,
      supplier: 'Logistics Co',
      buyer: 'BuyerD',
      amount: 50000,
      dueDate: '2025-09-01',
      status: 'Pending', // Not yet approved, not available for investment
      totalInvestment: 0,
      investors: [],
    },
  ]);

  // --- Web3 Connection & Wallet Info (Placeholder) ---
  useEffect(() => {
    const connectWallet = async () => {
      // Simulating connection for now
      setWalletAddress('0x742d35Cc6639C24CcE0...9A4C'); // Replace with actual connected address
      setWalletBalance('5.2'); // Replace with actual balance
    };
    connectWallet();
  }, []);

  // Helper for invoice status badge
  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Pending': 'status-pending',
      'VerificationInProgress': 'status-pending', // Treat as pending for investor UI
      'Approved': 'status-approved',
      'Rejected': 'status-rejected',
      'Paid': 'status-paid'
    };
    return <span className={`status-badge ${statusClasses[status as keyof typeof statusClasses]}`}>{status}</span>;
  };

  // Calculate days remaining or days passed for APY calculation
  const calculateDaysRemaining = useCallback((dueDate: string): number => {
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, []);

  // Process invoices for display, calculating expected returns and APY
  const processedInvoices = useMemo(() => {
    return invoices.map(invoice => {
      let _myInvestment = invoice._myInvestment || 0; // Use existing or default to 0
      let _expectedReturn = invoice._expectedReturn || 0;
      let _currentAPY = 'N/A';

      // Example: If the current wallet is an investor in this invoice (for simulation)
      if (walletAddress !== '0x...' && invoice.investors.includes(walletAddress)) {
        // In a real DApp, you'd call amountOfTokensPurchasedByInvestor from the contract
        // _myInvestment = await contract.amountOfTokensPurchasedByInvestor(invoice.id, walletAddress);
        // For simulation:
        if (invoice.id === 12345) _myInvestment = 10000;
        if (invoice.id === 12347) _myInvestment = 5000;

        if (invoice.status === 'Paid') {
          // Calculate actual return if paid based on amount + (penalty share if applicable)
          // This would typically involve fetching the actual distribution from contract
          _expectedReturn = _myInvestment * 1.05; // Example: 5% return for paid invoices
        } else if (invoice.status === 'Approved') {
          // Estimate potential return based on target APY
          const daysRemaining = calculateDaysRemaining(invoice.dueDate);
          if (daysRemaining > 0) {
            // Simple interest for a shorter period based on target APY
            _expectedReturn = _myInvestment * (1 + (TARGET_APY / 365) * daysRemaining);
            _currentAPY = `${(TARGET_APY * 100).toFixed(2)}%`;
          } else {
            _expectedReturn = _myInvestment; // No return if due date passed and not paid
          }
        }
      }

      // Calculate funding progress
      const fundingProgress = invoice.amount > 0 ? (invoice.totalInvestment / invoice.amount) * 100 : 0;

      return {
        ...invoice,
        _myInvestment: parseFloat(_myInvestment.toFixed(2)),
        _expectedReturn: parseFloat(_expectedReturn.toFixed(2)),
        _currentAPY: _currentAPY,
        _fundingProgress: parseFloat(fundingProgress.toFixed(2)), // For progress bar
      };
    });
  }, [invoices, walletAddress, calculateDaysRemaining]);

  // Dashboard Stats Calculation
  const dashboardStats = useMemo(() => {
    const approvedInvoices = processedInvoices.filter(inv => inv.status === 'Approved');
    const myActiveInvestments = processedInvoices.filter(inv =>
      inv.status === 'Approved' && inv._myInvestment && inv._myInvestment > 0
    );
    const myPaidInvestments = processedInvoices.filter(inv =>
      inv.status === 'Paid' && inv._myInvestment && inv._myInvestment > 0
    );

    const totalInvested = myActiveInvestments.reduce((sum, inv) => sum + (inv._myInvestment || 0), 0);
    const totalPotentialReturn = myActiveInvestments.reduce((sum, inv) => sum + (inv._expectedReturn || 0), 0);
    const totalEarnings = myPaidInvestments.reduce((sum, inv) => sum + ((inv._expectedReturn || 0) - (inv._myInvestment || 0)), 0);

    return {
      availableForInvestment: approvedInvoices.length,
      myActiveInvestmentsCount: myActiveInvestments.length,
      totalInvested: totalInvested,
      totalPotentialReturn: totalPotentialReturn,
      totalEarnings: totalEarnings,
    };
  }, [processedInvoices]);


  const handleInvestInInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setInvestAmount(''); // Clear previous amount
    setActiveTab('invest'); // Switch to invest tab
  };

  const processInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice || !investAmount) {
      alert('Please select an invoice and enter an investment amount.');
      return;
    }

    const amountToInvestUSD = parseFloat(investAmount);
    if (isNaN(amountToInvestUSD) || amountToInvestUSD <= 0) {
      alert('Please enter a valid investment amount.');
      return;
      }

    // Check if investment exceeds remaining capacity
    const remainingCapacity = selectedInvoice.amount - selectedInvoice.totalInvestment;
    if (amountToInvestUSD > remainingCapacity) {
        alert(`Investment amount exceeds remaining capacity. Max: $${remainingCapacity.toLocaleString()}`);
        return;
    }

    // 1. Convert USD amount to the required ETH equivalent for buyTokens
    // You'd call getTokenDetails to get token price in ETH from contract
    // For now, let's assume 1 Invoice Token (in USD) is 1 USD.
    // And assume the token price is 1 token = 1 USD / ETH_TO_USD_RATE ETH
    const ethRequired = amountToInvestUSD / ETH_TO_USD_RATE; // This is the amount of ETH to send

    console.log(`Attempting to invest $${amountToInvestUSD} (approx ${ethRequired.toFixed(6)} ETH) in Invoice #${selectedInvoice.id}`);

    try {
        // --- Smart Contract Interaction (Placeholder) ---
        // You'll need:
        // 1. Provider and Signer (from your Web3 setup)
        // 2. Main Contract instance
        // 3. InvoiceToken Contract instance (for the specific invoice)
        // const provider = new ethers.BrowserProvider(window.ethereum);
        // const signer = await provider.getSigner();
        // const mainContract = new ethers.Contract(YOUR_MAIN_CONTRACT_ADDRESS, MainContractABI.abi, signer);

        // // Get the InvoiceToken address for this invoice
        // const invoiceTokenAddress = await mainContract.getInvoiceTokenAddress(selectedInvoice.id);
        // if (invoiceTokenAddress === ethers.ZeroAddress) {
        //     throw new Error("Invoice Token not found for this invoice.");
        // }
        // const invoiceTokenContract = new ethers.Contract(invoiceTokenAddress, InvoiceTokenABI.abi, signer);

        // // The `buyTokens` function in your Main contract takes _amount (in dollars) and sends ETH
        // // The contract handles conversion. So we send `ethRequired` as msg.value
        // // Make sure the Main.sol's `buyTokens` function `_amount` parameter corresponds to USD, not ETH
        // // As per your contract `buyTokens(uint256 _id, uint256 _amount)` where _amount looks like it's in dollars.
        // // The contract then calls token.buyTokens{value: tokenPriceInEth}(_amount, msg.sender);
        // // The `tokenPriceInEth` is derived from `token.getExactCost(_amount)`.
        // // So the `value` sent with `buyTokens` should be `token.getExactCost(amountToInvestUSD)`.
        // // For frontend simulation, we calculate ethRequired here.

        // const valueInWei = ethers.parseEther(ethRequired.toFixed(18));
        // const transaction = await mainContract.buyTokens(selectedInvoice.id, amountToInvestUSD, { value: valueInWei });
        // await transaction.wait(); // Wait for transaction confirmation

        // --- Simulate State Update ---
        setInvoices(prevInvoices =>
            prevInvoices.map(inv =>
                inv.id === selectedInvoice.id
                    ? {
                        ...inv,
                        totalInvestment: inv.totalInvestment + amountToInvestUSD,
                        // Add investor if not already present (simulated)
                        investors: inv.investors.includes(walletAddress) ? inv.investors : [...inv.investors, walletAddress],
                        _myInvestment: (inv._myInvestment || 0) + amountToInvestUSD,
                      }
                    : inv
            )
        );

        alert(`Successfully invested $${amountToInvestUSD.toLocaleString()} in Invoice #${selectedInvoice.id}!`);
        setSelectedInvoice(null);
        setInvestAmount('');
        setActiveTab('my-investments'); // Go to my investments after investing
    } catch (error) {
        console.error("Investment failed:", error);
        alert(`Investment failed for Invoice #${selectedInvoice.id}. See console for details.`);
    }
  };

  return (
    <div>
      <div className="bg-container">
        <div className="grid-overlay"></div>
      </div>
      <div className='header'>
      <div className='nav-section'>
      <a href="#" className="logo">InvoiceFinance</a>
      <div className="nav-menu">
        <button
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`tab ${activeTab === 'opportunities' ? 'active' : ''}`}
          onClick={() => setActiveTab('opportunities')}
        >
          Opportunities
        </button>
        <button
          className={`tab ${activeTab === 'my-investments' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-investments')}
        >
          My Investments
        </button>
        <button
          className={`tab ${activeTab === 'invest' ? 'active' : ''}`}
          onClick={() => setActiveTab('invest')}
          style={{ display: selectedInvoice ? 'block' : 'none' }} // Show only when an invoice is selected
        >
          Invest
        </button>
        <div className="wallet-info">
          <span className="wallet-address">{walletAddress}</span>
          <span className="wallet-balance">{walletBalance} ETH</span>
        </div>
      </div>
      </div>
      </div>

      {/* --- Dashboard Tab Content --- */}
      {activeTab === 'dashboard' && (
  <div className="main-content">
    {/* Dashboard Page */}
    <div id="dashboard" className="page active">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Investor Dashboard</h1>
        <p className="dashboard-subtitle">
          Explore opportunities and manage your investments
        </p>
      </div>

      <div className="stats-grid">
        {/* Total Invested */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">🎯</span>
            <span className="stat-label">Available Opportunities</span>
          </div>
          <div className="stat-value">
{dashboardStats.availableForInvestment}
          </div>
          <div className="stat-change">
             Invoices ready for funding
          </div>
        </div>

        {/* Total Returns */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">🪙</span>
            <span className="stat-label">Total Earnings (USD)</span>
          </div>
          <div className="stat-value">
${dashboardStats.totalEarnings.toLocaleString()}
          </div>
          <div className="stat-change">
             From paid invoices
          </div>
        </div>

        {/* Active Investments */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">📈</span>
            <span className="stat-label">My Active Investments</span>
          </div>
          <div className="stat-value">
            {dashboardStats.myActiveInvestmentsCount}
          </div>
          <div className="stat-change">
            Currently funded invoices
          </div>
        </div>

        {/* Avg. Duration */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">💰</span>
            <span className="stat-label">Total Invested (USD)</span>
          </div>
          <div className="stat-value">${dashboardStats.totalInvested.toLocaleString()}</div>
          <div className="stat-change">Across active invoices</div>
        </div>
        <div className="quick-links">
            <h2>Quick Actions<br/></h2>
            <button className="btn btn-primary" onClick={() => setActiveTab('opportunities')}>
              Browse Opportunities
            </button>
            <br/><br/>
            <button className="btn btn-secondary" onClick={() => setActiveTab('my-investments')}>
              View My Portfolio
            </button>
          </div>

      </div>
    </div>
  </div>
  
)}


      {/* --- Opportunities Tab Content --- */}
      {activeTab === 'opportunities' && (
        <div className="main-content">
        <div className="opportunities-content">
          <h2>Available Invoices for Investment</h2>
          <p className="section-description">
            Browse invoices verified and approved by buyers, ready for funding.
          </p>
          <div className="invoice-list">
            {processedInvoices.filter(inv => inv.status === 'Approved').length === 0 ? (
                <p className="no-opportunities-message">No investment opportunities available right now. Check back later!</p>
            ) : (
                processedInvoices.filter(inv => inv.status === 'Approved').map((invoice) => (
                    <div key={invoice.id} className="invoice-item opportunity-item">
                        <div className="invoice-header">
                            <div className="invoice-id">Invoice #{invoice.id}</div>
                            {getStatusBadge(invoice.status)}
                        </div>
                        <div className="invoice-details">
                            <div className="detail-item">
                                <div className="detail-label">Supplier</div>
                                <div className="detail-value">{invoice.supplier}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Buyer</div>
                                <div className="detail-value">{invoice.buyer}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Amount</div>
                                <div className="detail-value">${invoice.amount.toLocaleString()}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Due Date</div>
                                <div className="detail-value">{new Date(invoice.dueDate).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div className="funding-progress">
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: `${invoice._fundingProgress > 100 ? 100 : invoice._fundingProgress}%` }}
                                ></div>
                            </div>
                            <span>{invoice._fundingProgress}% Funded</span>
                        </div>
                        <div className="investment-metrics">
                            <span className="metric-item">APY: {invoice._currentAPY}</span>
                            <span className="metric-item">Remaining: ${Math.max(0, invoice.amount - invoice.totalInvestment).toLocaleString()}</span>
                        </div>
                        <div className="invoice-actions">
                            <button className="btn btn-small">View Details</button>
                            <button
                                className="btn btn-small btn-primary"
                                onClick={() => handleInvestInInvoice(invoice)}
                                disabled={invoice._fundingProgress >= 100} // Disable if fully funded
                            >
                                {invoice._fundingProgress >= 100 ? 'Fully Funded' : 'Invest Now'}
                            </button>
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>
        </div>
      )}



      {/* --- My Investments Tab Content --- */}
      {activeTab === 'my-investments' && (
        <div className='main-content'>
        <div className="my-investments-content">
          <h2>My Active and Completed Investments</h2>
          <p className="section-description">Track the performance of your funded invoices.</p>
          <div className="investment-list">
            {processedInvoices.filter(inv => inv._myInvestment && inv._myInvestment > 0).length === 0 ? (
                <p className="no-investments-message">You haven't made any investments yet. Explore opportunities!</p>
            ) : (
                processedInvoices.filter(inv => inv._myInvestment && inv._myInvestment > 0).map((invoice) => (
                    <div key={invoice.id} className={`investment-item ${invoice.status === 'Paid' ? 'paid-investment' : ''}`}>
                        <div className="investment-header">
                            <div className="investment-id">Invoice #{invoice.id}</div>
                            {getStatusBadge(invoice.status)}
                        </div>
                        <div className="investment-details">
                            <div className="detail-item">
                                <div className="detail-label">Supplier</div>
                                <div className="detail-value">{invoice.supplier}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Original Amount</div>
                                <div className="detail-value">${invoice.amount.toLocaleString()}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">My Investment</div>
                                <div className="detail-value my-investment-amount">${invoice._myInvestment?.toLocaleString()}</div>
                            </div>
                            {invoice.status === 'Paid' && (
                                <div className="detail-item">
                                    <div className="detail-label">Total Return</div>
                                    <div className="detail-value total-return-amount">${invoice._expectedReturn?.toLocaleString()}</div>
                                </div>
                            )}
                            {invoice.status === 'Approved' && (
                                <>
                                    <div className="detail-item">
                                        <div className="detail-label">Expected Return</div>
                                        <div className="detail-value expected-return-amount">${invoice._expectedReturn?.toLocaleString()}</div>
                                    </div>
                                    <div className="detail-item">
                                        <div className="detail-label">Est. APY</div>
                                        <div className="detail-value">{invoice._currentAPY}</div>
                                    </div>
                                </>
                            )}
                            <div className="detail-item">
                                <div className="detail-label">Due Date</div>
                                <div className="detail-value">{new Date(invoice.dueDate).toLocaleDateString()}</div>
                            </div>
                        </div>
                        {invoice.status === 'Approved' && (
                            <div className="active-investment-info">
                                <p>This invoice is currently active. Funds will be distributed upon buyer payment.</p>
                            </div>
                        )}
                        {invoice.status === 'Paid' && (
                            <div className="paid-investment-info">
                                <p>Payment received and distributed for this invoice.</p>
                                {/* You could add a link to transaction hash here */}
                            </div>
                        )}
                    </div>
                ))
            )}
          </div>
          </div>
        </div>
      )}

      {/* --- Invest Form Tab Content (Shown when an invoice is selected for investment) --- */}
      {activeTab === 'invest' && selectedInvoice && (
        <div className='main-content'>
        <div className="invest-form-content">
          <h2>💰 Invest in Invoice #{selectedInvoice.id}</h2>
          <div className="investment-summary">
            <h3>Invoice Details</h3>
            <div className="summary-details">
              <div className="summary-row">
                <span>Supplier:</span>
                <span>{selectedInvoice.supplier}</span>
              </div>
              <div className="summary-row">
                <span>Buyer:</span>
                <span>{selectedInvoice.buyer}</span>
              </div>
              <div className="summary-row">
                <span>Original Amount:</span>
                <span>${selectedInvoice.amount.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Total Invested (by all):</span>
                <span>${selectedInvoice.totalInvestment.toLocaleString()}</span>
              </div>
              <div className="summary-row total">
                <span>Remaining to Fund:</span>
                <span>${(selectedInvoice.amount - selectedInvoice.totalInvestment).toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Est. APY:</span>
                <span>{selectedInvoice._currentAPY}</span>
              </div>
              <div className="summary-row">
                <span>Due Date:</span>
                <span>{new Date(selectedInvoice.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <form onSubmit={processInvestment} className="investment-form">
            <div className="form-group">
              <label htmlFor="investAmount">Amount to Invest (USD)</label>
              <input
                id="investAmount"
                type="number"
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
                required
                min="1"
                step="0.01"
                max={selectedInvoice.amount - selectedInvoice.totalInvestment} // Max is remaining amount
              />
            </div>
            <div className="form-group">
              <label>ETH Required (Approx)</label>
              <input
                type="text"
                value={`${(parseFloat(investAmount || '0') / ETH_TO_USD_RATE).toFixed(6)} ETH`}
                readOnly
                className="readonly-input"
              />
            </div>
            <div className="investment-actions">
              <button type="submit" className="btn btn-primary">Confirm Investment</button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedInvoice(null)}
              >
                Cancel
              </button>
            </div>
          </form>

          <p className="automation-note">
            🚀 Your investment contributes to the invoice funding and will earn returns upon buyer payment.
          </p>
        </div>
        </div>
      )}
    </div>
    
  );
};

export default Investor;