import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Buyer.css'


interface Invoice {
  id: number;
  supplier: string;
  amount: number; // Original amount in USD
  dueDate: string; 
  status: 'Pending' | 'Approved' | 'Overdue' | 'Paid';
  penalty: number; // Calculated penalty in USD
  totalDue: number; // Original amount + penalty in USD
  paidDate?: string; // Optional: date when the invoice was paid
}

// Dummy ETH/USD conversion rate for frontend display
const ETH_TO_USD_RATE = 3500; // Example: 1 ETH = $3500 USD

const Buyer: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('0x...'); // Placeholder
  const [walletBalance, setWalletBalance] = useState<string>('0.00'); // Placeholder

  // In a real dApp, you would fetch invoices from your smart contract
  // For this example, we'll keep it in local state.
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 12344,
      supplier: 'TechCorp Ltd',
      amount: 25000,
      dueDate: '2025-07-15',
      status: 'Approved',
      penalty: 0,
      totalDue: 25000,
    },
    {
      id: 12345,
      supplier: 'Manufacturing Inc',
      amount: 35000,
      dueDate: '2025-06-20', // This will likely be overdue based on current date
      status: 'Approved', // Frontend will dynamically set to Overdue
      penalty: 0,
      totalDue: 35000,
    },
    {
      id: 12342,
      supplier: 'Supply Chain Co',
      amount: 15000,
      dueDate: '2025-06-01',
      status: 'Paid',
      penalty: 120,
      totalDue: 15120,
      paidDate: '2025-06-01', // Example paid date
    },
    {
      id: 12341,
      supplier: 'Tech Solutions Ltd',
      amount: 40000,
      dueDate: '2025-05-10',
      status: 'Paid',
      penalty: 500,
      totalDue: 40500,
      paidDate: '2025-05-15', // Example paid date
    },
    {
      id: 12346,
      supplier: 'Global Logistics',
      amount: 10000,
      dueDate: '2025-07-01',
      status: 'Pending', // This status might be 'Approved' after verification in contract
      penalty: 0,
      totalDue: 10000,
    },
  ]);

  // --- Web3 Connection & Wallet Info (Placeholder) ---
  // In a real app, you'd use a Web3 hook or context here
  useEffect(() => {
    const connectWallet = async () => {
      // Example with ethers.js:
      // if (window.ethereum) {
      //   try {
      //     const provider = new ethers.BrowserProvider(window.ethereum);
      //     const accounts = await provider.send("eth_requestAccounts", []);
      //     setWalletAddress(accounts[0]);
      //     const balance = await provider.getBalance(accounts[0]);
      //     setWalletBalance(ethers.formatEther(balance));
      //   } catch (error) {
      //     console.error("Error connecting to wallet:", error);
      //   }
      // }
      // Simulating connection for now
      setWalletAddress('0x742d35Cc6639C24CcE0...9A4C');
      setWalletBalance('5.2');
    };
    connectWallet();
  }, []);

  // --- Helper Functions ---

  const calculateDaysOverdue = useCallback((dueDate: string): number => {
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

    if (due.getTime() > today.getTime()) {
      return 0; // Not overdue yet
    }

    // Contract's GRACEPERIOD is 2 days. Let's incorporate that for more accuracy.
    // If we want frontend to match contract exactly, we'd add 2 days to the due date.
    // However, for UI, "Overdue" usually means after the due date, then penalties start after grace.
    // For simplicity in UI, we'll show overdue immediately after dueDate.
    // The penalty calculation will reflect the contract's grace period.

    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  // Penalty rate 4% daily after 2 days grace period
  const calculatePenalty = useCallback((amount: number, dueDate: string): number => {
    const due = new Date(dueDate);
    const gracePeriodEnd = new Date(due);
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 2); // Add 2 days grace period
    gracePeriodEnd.setHours(0, 0, 0, 0); // Normalize to midnight

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (today.getTime() <= gracePeriodEnd.getTime()) {
      return 0; // Within grace period or not yet due
    }

    const daysOverdueAfterGrace = Math.floor((today.getTime() - gracePeriodEnd.getTime()) / (1000 * 60 * 60 * 24));
    if (daysOverdueAfterGrace <= 0) {
        return 0; // Ensures no negative or zero penalty for days within grace or past due but within grace
    }
    const penaltyRate = 0.04; // 4%
    // Penalty is calculated on the original amount
    return parseFloat((amount * penaltyRate * daysOverdueAfterGrace).toFixed(2));
  }, []);

  // --- Dynamic Invoice Processing & Stats ---
  const processedInvoices = useMemo(() => {
    return invoices.map(invoice => {
      let currentStatus = invoice.status;
      let currentPenalty = invoice.penalty;
      let currentTotalDue = invoice.totalDue;
      let calculatedDaysOverdue = 0;

      if (invoice.status !== 'Paid') {
        calculatedDaysOverdue = calculateDaysOverdue(invoice.dueDate);
        currentPenalty = calculatePenalty(invoice.amount, invoice.dueDate); // Use full penalty logic

        if (calculatedDaysOverdue > 0) {
          currentStatus = 'Overdue';
          currentTotalDue = invoice.amount + currentPenalty;
        } else {
          // If not overdue, status remains 'Approved' or 'Pending' as per initial data
          currentStatus = invoice.status === 'Pending' ? 'Pending' : 'Approved';
          currentTotalDue = invoice.amount; // No penalty if not overdue
        }
      }

      return {
        ...invoice,
        status: currentStatus,
        penalty: currentPenalty,
        totalDue: currentTotalDue,
        _calculatedDaysOverdue: calculatedDaysOverdue // Add for easy display
      };
    });
  }, [invoices, calculateDaysOverdue, calculatePenalty]); // Depend on invoices and helper functions

  const dashboardStats = useMemo(() => {
    const overdueInvoices = processedInvoices.filter(inv => inv.status === 'Overdue');
    const pendingPaymentsInvoices = processedInvoices.filter(inv => inv.status === 'Approved' || inv.status === 'Overdue');
    const paidInvoicesThisMonth = processedInvoices.filter(inv => {
      if (inv.status === 'Paid' && inv.paidDate) {
        const paidMonth = new Date(inv.paidDate).getMonth();
        const currentMonth = new Date().getMonth();
        const paidYear = new Date(inv.paidDate).getFullYear();
        const currentYear = new Date().getFullYear();
        return paidMonth === currentMonth && paidYear === currentYear;
      }
      return false;
    });

    const totalPendingAmount = pendingPaymentsInvoices.reduce((sum, inv) => sum + inv.totalDue, 0);
    const totalPaidThisMonth = paidInvoicesThisMonth.reduce((sum, inv) => sum + inv.totalDue, 0);
    const totalPenalties = processedInvoices.reduce((sum, inv) => sum + inv.penalty, 0);

    return {
      overdueCount: overdueInvoices.length,
      pendingAmount: totalPendingAmount,
      pendingInvoiceCount: pendingPaymentsInvoices.length,
      paidThisMonthAmount: totalPaidThisMonth,
      paidThisMonthCount: paidInvoicesThisMonth.length,
      totalPenalties: totalPenalties,
    };
  }, [processedInvoices]);

  const handlePayInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentAmount(invoice.totalDue.toFixed(2)); // Pre-fill with total due
    setActiveTab('payments'); // Switch to payments tab when selecting to pay
  };

  const processPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice || !paymentAmount) {
      alert('Please select an invoice and enter a payment amount.');
      return;
    }

    const amountInUSD = parseFloat(paymentAmount);
    if (isNaN(amountInUSD) || amountInUSD <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    // In a real DApp, you would:
    // 1. Convert USD amount to the required ETH equivalent (using an oracle or fixed rate)
    const amountInEth = amountInUSD / ETH_TO_USD_RATE;
    console.log(`Attempting to pay $${amountInUSD} (approx ${amountInEth.toFixed(4)} ETH) for Invoice #${selectedInvoice.id}`);

    // 2. Interact with your smart contract
    try {
        // Example with ethers.js:
        // const provider = new ethers.BrowserProvider(window.ethereum);
        // const signer = await provider.getSigner();
        // const contract = new ethers.Contract(YOUR_CONTRACT_ADDRESS, MainContractABI.abi, signer);

        // // Assuming buyerPayment expects value in wei
        // const valueToSend = ethers.parseEther(amountInEth.toFixed(18)); // Convert ETH to Wei
        // const transaction = await contract.buyerPayment(selectedInvoice.id, { value: valueToSend });
        // await transaction.wait(); // Wait for the transaction to be mined

        // Update the invoice status in local state (or refetch from contract)
        setInvoices(prevInvoices =>
            prevInvoices.map(inv =>
                inv.id === selectedInvoice.id
                    ? { ...inv, status: 'Paid', paidDate: new Date().toISOString().split('T')[0] }
                    : inv
            )
        );

        alert(`Payment of $${amountInUSD.toLocaleString()} processed for Invoice #${selectedInvoice.id}`);
        setSelectedInvoice(null);
        setPaymentAmount('');
        setActiveTab('history'); // Maybe switch to history after successful payment
    } catch (error) {
        console.error("Payment failed:", error);
        alert(`Payment failed for Invoice #${selectedInvoice.id}. See console for details.`);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Pending': 'status-pending',
      'Approved': 'status-approved',
      'Overdue': 'status-overdue',
      'Paid': 'status-paid'
    };
    return <span className={`status-badge ${statusClasses[status as keyof typeof statusClasses]}`}>{status}</span>;
  };

  return (
    <div className="buyer-container">
      <div className="bg-container">
        <div className="grid-overlay"></div>
      </div>
      <div className="header">
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
          className={`tab ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          Make Payments
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Payment History
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
        <div className='main-content'>
        <div className="dashboard-content">
          <div className="header-content">
          
          <h1>Buyer Dashboard</h1>
          <p>Manage your invoice payments and track obligations</p>
        </div>
          <div className="stats-grid">
            <div className="stat-card urgent">
              <h3>Overdue Invoices</h3>
              <div className="stat-number">{dashboardStats.overdueCount}</div>
              <span className="stat-change">Requires immediate attention</span>
            </div>
            <div className="stat-card">
              <h3>Pending Payments</h3>
              <div className="stat-number">${dashboardStats.pendingAmount.toLocaleString()}</div>
              <span className="stat-change">{dashboardStats.pendingInvoiceCount} invoices due</span>
            </div>
            <div className="stat-card">
              <h3>Paid This Month</h3>
              <div className="stat-number">${dashboardStats.paidThisMonthAmount.toLocaleString()}</div>
              <span className="stat-change">{dashboardStats.paidThisMonthCount} invoices</span>
            </div>
            <div className="stat-card">
              <h3>Total Penalties</h3>
              <div className="stat-number">${dashboardStats.totalPenalties.toLocaleString()}</div>
              <span className="stat-change">Late payment fees incurred</span>
            </div>
          </div>

          <div className="invoice-list-section">
            <h2>Your Invoices</h2>
            <div className="invoice-list">
              {processedInvoices.map((invoice) => (
                <div key={invoice.id} className={`invoice-item ${invoice.status === 'Overdue' ? 'overdue' : ''}`}>
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
                      <div className="detail-label">Original Amount</div>
                      <div className="detail-value">${invoice.amount.toLocaleString()}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Due Date</div>
                      <div className="detail-value">{new Date(invoice.dueDate).toLocaleDateString()}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Total Due</div>
                      <div className="detail-value total-due">${invoice.totalDue.toLocaleString()}</div>
                    </div>
                  </div>
                  {invoice.status === 'Overdue' && (
                    <div className="overdue-warning">
                      ⚠️ {invoice._calculatedDaysOverdue} days overdue - Penalty: ${invoice.penalty.toLocaleString()}
                    </div>
                  )}
                  <div className="invoice-actions">
                    <button className="btn btn-small">View Details</button> {/* This could open a modal */}
                    {(invoice.status === 'Approved' || invoice.status === 'Overdue') && (
                      <button
                        className="btn btn-small btn-primary"
                        onClick={() => handlePayInvoice(invoice)}
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      )}

      {/* --- Make Payments Tab Content --- */}
      {activeTab === 'payments' && (
        <div className='main-content'>
        <div className="payments-content">
          {selectedInvoice ? (
            <div className="payment-form-section">
              <h2>💳 Payment Processing</h2>
              <div className="payment-summary">
                <h3>Invoice #{selectedInvoice.id} Payment Summary</h3>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Supplier:</span>
                    <span>{selectedInvoice.supplier}</span>
                  </div>
                  <div className="summary-row">
                    <span>Original Amount:</span>
                    <span>${selectedInvoice.amount.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Days Overdue:</span>
                    <span>{calculateDaysOverdue(selectedInvoice.dueDate)} days</span>
                  </div>
                  <div className="summary-row">
                    <span>Penalty (4% daily after 2 days grace):</span>
                    <span>${selectedInvoice.penalty.toLocaleString()}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total Due:</span>
                    <span>${selectedInvoice.totalDue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={processPayment} className="payment-form">
                <div className="form-group">
                  <label htmlFor="paymentAmount">Payment Amount (USD)</label>
                  <input
                    id="paymentAmount"
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>ETH Required (Approx)</label>
                  <input
                    type="text"
                    value={`${(parseFloat(paymentAmount || '0') / ETH_TO_USD_RATE).toFixed(6)} ETH`}
                    readOnly
                    className="readonly-input"
                  />
                </div>
                <div className="payment-actions">
                  <button type="submit" className="btn btn-primary">Process Payment</button>
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
                ⚡ Payments are automatically distributed using Chainlink Automation
              </p>
            </div>
          ) : (
            <div className="select-invoice-section">
              <h2>Select Invoice to Pay</h2>
              <div className="payable-invoices">
                {processedInvoices.filter(inv => inv.status === 'Approved' || inv.status === 'Overdue').length === 0 ? (
                    <p className="no-invoices-message">No invoices currently available for payment.</p>
                ) : (
                    processedInvoices.filter(inv => inv.status === 'Approved' || inv.status === 'Overdue').map((invoice) => (
                      <div
                        key={invoice.id}
                        className={`payable-invoice ${invoice.status === 'Overdue' ? 'overdue' : ''}`}
                        onClick={() => handlePayInvoice(invoice)}
                      >
                        <div className="invoice-summary">
                          <h4>Invoice #{invoice.id}</h4>
                          <p>{invoice.supplier}</p>
                          <div className="amount-due">${invoice.totalDue.toLocaleString()}</div>
                        </div>
                        {getStatusBadge(invoice.status)}
                      </div>
                    ))
                )}
              </div>
              
            </div>
          )}
        </div>
        </div>
      )}

      {/* --- Payment History Tab Content --- */}
      {activeTab === 'history' && (
        <div className='main-content'>
        <div className="history-content">
          <h2>Payment History</h2>
          <div className="history-list">
            {processedInvoices.filter(inv => inv.status === 'Paid').length === 0 ? (
                <p className="no-history-message">No payment history available yet.</p>
            ) : (
                processedInvoices.filter(inv => inv.status === 'Paid').map((invoice) => (
                    <div key={invoice.id} className="history-item">
                        <div className="history-info">
                            <h4>Invoice #{invoice.id}</h4>
                            <p>{invoice.supplier}</p>
                            <span className="payment-date">
                                Paid on {invoice.paidDate ? new Date(invoice.paidDate).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                        <div className="history-amount">
                            {/* Assuming original amount and penalty are stored when paid */}
                            <span className="original">Original: ${invoice.amount.toLocaleString()}</span>
                            <span className="penalty">Penalty: ${invoice.penalty.toLocaleString()}</span>
                            <span className="total">Total Paid: ${invoice.totalDue.toLocaleString()}</span>
                        </div>
                        <div className="history-status">
                            {getStatusBadge(invoice.status)}
                        </div>
                    </div>
                ))
            )}
          </div>
          </div>
        </div>
      )}
    </div>
    
  );
};

export default Buyer;