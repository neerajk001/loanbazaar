'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Settings, 
  Mail, 
  Database,
  Save,
  CheckCircle,
  Loader2,
  UserCog,
  DollarSign,
  Edit2,
  Shield,
  X,
  Plus,
  Trash2,
  Globe,
  Lock,
  Unlock,
  BarChart3
} from 'lucide-react';

interface SettingsData {
  emailNotifications: {
    newApplication: boolean;
    newConsultancy: boolean;
    statusUpdate: boolean;
  };
  adminEmails: string[];
  systemSettings: {
    maintenanceMode: boolean;
    allowPublicApplications: boolean;
  };
}

interface LoanProduct {
  slug: string;
  title: string;
  maxAmount: string;
  interestRate: string;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<SettingsData>({
    emailNotifications: {
      newApplication: true,
      newConsultancy: true,
      statusUpdate: true,
    },
    adminEmails: ['admin@example.com'],
    systemSettings: {
      maintenanceMode: false,
      allowPublicApplications: true,
    },
  });
  
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editMaxAmount, setEditMaxAmount] = useState('');
  const [editInterestRate, setEditInterestRate] = useState('');
  const [sourceStats, setSourceStats] = useState({
    loanSarathi: { loans: 0, insurance: 0, consultancy: 0 },
    smartMumbai: { loans: 0, insurance: 0, consultancy: 0 }
  });
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchLoanProducts();
    fetchSourceStats();
  }, []);

  const fetchSourceStats = async () => {
    setLoadingStats(true);
    try {
      // Fetch all applications (loans, insurance, consultancy)
      const response = await fetch('/api/admin/applications?type=all&limit=10000');
      const data = await response.json();
      
      // Count by source
      const stats = {
        loanSarathi: { loans: 0, insurance: 0, consultancy: 0 },
        smartMumbai: { loans: 0, insurance: 0, consultancy: 0 }
      };
      
      if (data.success && data.applications) {
        data.applications.forEach((app: any) => {
          const source = app.source || 'loan-sarathi'; // Default to loan-sarathi if source not set
          
          if (app.type === 'loan') {
            if (source === 'loan-sarathi') stats.loanSarathi.loans++;
            else if (source === 'smartmumbaisolutions') stats.smartMumbai.loans++;
          } else if (app.type === 'insurance') {
            if (source === 'loan-sarathi') stats.loanSarathi.insurance++;
            else if (source === 'smartmumbaisolutions') stats.smartMumbai.insurance++;
          } else if (app.type === 'consultancy') {
            if (source === 'loan-sarathi') stats.loanSarathi.consultancy++;
            else if (source === 'smartmumbaisolutions') stats.smartMumbai.consultancy++;
          }
        });
      }
      
      setSourceStats(stats);
    } catch (error) {
      console.error('Error fetching source stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    
    try {
      console.log('Saving settings:', settings);
      console.log('Admin emails being sent:', settings.adminEmails);
      
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      console.log('Save response:', data);
      
      if (data.success) {
        setSaved(true);
        // Refresh settings from server to get the saved values
        await fetchSettings();
        console.log('Settings refreshed. Saved admin emails:', data.savedAdminEmails || data.settings?.adminEmails);
        alert(`Settings saved successfully! Admin emails: ${(data.savedAdminEmails || data.settings?.adminEmails || []).join(', ')}`);
        setTimeout(() => setSaved(false), 3000);
      } else {
        console.error('Save failed:', data.error);
        alert(data.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddAdminEmail = async () => {
    setEmailError('');
    
    if (!newAdminEmail) {
      setEmailError('Please enter an email address');
      return;
    }
    
    if (!validateEmail(newAdminEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    const normalizedEmail = newAdminEmail.toLowerCase().trim();
    
    if (settings.adminEmails.some(e => e.toLowerCase() === normalizedEmail)) {
      setEmailError('This email is already in the admin list');
      return;
    }
    
    const updatedEmails = [...settings.adminEmails, normalizedEmail];
    console.log('Adding admin email:', normalizedEmail);
    console.log('Updated admin emails list:', updatedEmails);
    
    // Update local state immediately
    const updatedSettings = {
      ...settings,
      adminEmails: updatedEmails,
    };
    setSettings(updatedSettings);
    setNewAdminEmail('');
    
    // Auto-save to database
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });

      const data = await response.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        console.log('Admin email added and saved:', normalizedEmail);
      } else {
        setEmailError('Failed to save: ' + (data.error || 'Unknown error'));
        // Revert local state
        setSettings(settings);
      }
    } catch (error) {
      console.error('Error saving admin email:', error);
      setEmailError('Failed to save. Please try again.');
      // Revert local state
      setSettings(settings);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdminEmail = async (email: string) => {
    // Don't allow removing if only one admin email exists
    if (settings.adminEmails.length <= 1) {
      alert('At least one admin email is required');
      return;
    }
    
    // Don't allow removing the current user's email
    if (session?.user?.email?.toLowerCase() === email.toLowerCase()) {
      alert('You cannot remove your own admin email');
      return;
    }
    
    const updatedEmails = settings.adminEmails.filter(e => e.toLowerCase() !== email.toLowerCase());
    const updatedSettings = {
      ...settings,
      adminEmails: updatedEmails,
    };
    
    // Update local state immediately
    setSettings(updatedSettings);
    
    // Auto-save to database
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });
      
      const data = await response.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        console.log('Admin email removed and saved:', email);
      } else {
        alert('Failed to save: ' + (data.error || 'Unknown error'));
        // Revert local state
        setSettings(settings);
      }
    } catch (error) {
      console.error('Error removing admin email:', error);
      alert('Failed to save. Please try again.');
      // Revert local state
      setSettings(settings);
    } finally {
      setLoading(false);
    }
  };

  const fetchLoanProducts = async () => {
    try {
      const response = await fetch('/api/loan-products');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.products) {
          setLoanProducts(data.products);
        }
      }
    } catch (error) {
      console.error('Error fetching loan products:', error);
    }
  };

  const handleEditProduct = (product: LoanProduct) => {
    setEditingProduct(product.slug);
    setEditMaxAmount(product.maxAmount);
    setEditInterestRate(product.interestRate);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditMaxAmount('');
    setEditInterestRate('');
  };

  const handleSaveProduct = async (slug: string) => {
    try {
      const response = await fetch('/api/loan-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          maxAmount: editMaxAmount,
          interestRate: editInterestRate,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setLoanProducts(prev => prev.map(p => 
          p.slug === slug 
            ? { ...p, maxAmount: editMaxAmount, interestRate: editInterestRate }
            : p
        ));
        handleCancelEdit();
        alert('Loan product updated successfully!');
      } else {
        alert(data.error || 'Failed to update loan product');
      }
    } catch (error) {
      console.error('Error saving loan product:', error);
      alert('Failed to update loan product');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage system settings and preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Email Notifications */}
      <div className="bg-white border border-gray-900 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Email Notifications</h2>
            <p className="text-sm text-gray-500">Configure email notification preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-semibold text-gray-900">New Application Notifications</p>
              <p className="text-sm text-gray-500">Receive emails when new loan/insurance applications are submitted</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications.newApplication}
              onChange={(e) => setSettings({
                ...settings,
                emailNotifications: {
                  ...settings.emailNotifications,
                  newApplication: e.target.checked,
                },
              })}
              className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-semibold text-gray-900">New Consultancy Requests</p>
              <p className="text-sm text-gray-500">Receive emails when new consultancy requests are submitted</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications.newConsultancy}
              onChange={(e) => setSettings({
                ...settings,
                emailNotifications: {
                  ...settings.emailNotifications,
                  newConsultancy: e.target.checked,
                },
              })}
              className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-semibold text-gray-900">Status Update Notifications</p>
              <p className="text-sm text-gray-500">Receive emails when application statuses are updated</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications.statusUpdate}
              onChange={(e) => setSettings({
                ...settings,
                emailNotifications: {
                  ...settings.emailNotifications,
                  statusUpdate: e.target.checked,
                },
              })}
              className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
          </label>
        </div>
      </div>

      {/* Admin Access Management */}
      <div className="bg-white border border-gray-900 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Admin Access</h2>
            <p className="text-sm text-gray-500">Manage who can access the admin panel via Google Sign-In</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Current Admin Info */}
          {session?.user && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">You are signed in as</p>
                  <p className="text-sm text-green-700">{session.user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Add New Admin Email */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add New Admin Email</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => {
                  setNewAdminEmail(e.target.value);
                  setEmailError('');
                }}
                placeholder="Enter email address"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAdminEmail();
                  }
                }}
              />
              <button
                onClick={handleAddAdminEmail}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            {emailError && (
              <p className="text-red-600 text-sm mt-2">{emailError}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Users with these email addresses can sign in with Google to access the admin panel.
            </p>
          </div>

          {/* Admin Emails List */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Authorized Admin Emails</label>
            <div className="space-y-2">
              {settings.adminEmails.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{email}</span>
                    {session?.user?.email?.toLowerCase() === email.toLowerCase() && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        You
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveAdminEmail(email)}
                    disabled={settings.adminEmails.length <= 1 || session?.user?.email?.toLowerCase() === email.toLowerCase()}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={
                      settings.adminEmails.length <= 1 
                        ? 'At least one admin is required' 
                        : session?.user?.email?.toLowerCase() === email.toLowerCase()
                        ? 'Cannot remove your own email'
                        : 'Remove admin'
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white border border-gray-900 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Settings className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">System Settings</h2>
            <p className="text-sm text-gray-500">Configure system-wide settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-semibold text-gray-900">Maintenance Mode</p>
              <p className="text-sm text-gray-500">Enable maintenance mode to temporarily disable the system</p>
            </div>
            <input
              type="checkbox"
              checked={settings.systemSettings.maintenanceMode}
              onChange={(e) => setSettings({
                ...settings,
                systemSettings: {
                  ...settings.systemSettings,
                  maintenanceMode: e.target.checked,
                },
              })}
              className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-semibold text-gray-900">Allow Public Applications</p>
              <p className="text-sm text-gray-500">Allow users to submit applications without login</p>
            </div>
            <input
              type="checkbox"
              checked={settings.systemSettings.allowPublicApplications}
              onChange={(e) => setSettings({
                ...settings,
                systemSettings: {
                  ...settings.systemSettings,
                  allowPublicApplications: e.target.checked,
                },
              })}
              className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
          </label>
        </div>
      </div>

      {/* Source Management */}
      <div className="bg-white border border-gray-900 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
            <Globe className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Source Management</h2>
            <p className="text-sm text-gray-500">Manage API access for different frontend applications</p>
          </div>
        </div>

        {/* Source Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Loan Sarathi Card */}
          <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Loan Sarathi</h3>
                  <p className="text-xs text-gray-600">Default Source</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">Active</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Applications:</span>
                <span className="font-bold text-gray-900">{loadingStats ? '...' : sourceStats.loanSarathi.loans}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Insurance Applications:</span>
                <span className="font-bold text-gray-900">{loadingStats ? '...' : sourceStats.loanSarathi.insurance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Consultancy Requests:</span>
                <span className="font-bold text-gray-900">{loadingStats ? '...' : sourceStats.loanSarathi.consultancy}</span>
              </div>
            </div>
          </div>

          {/* Smart Mumbai Solutions Card */}
          <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Smart Mumbai Solutions</h3>
                  <p className="text-xs text-gray-600">External Source</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">Active</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Applications:</span>
                <span className="font-bold text-gray-900">{loadingStats ? '...' : sourceStats.smartMumbai.loans}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Insurance Applications:</span>
                <span className="font-bold text-gray-900">{loadingStats ? '...' : sourceStats.smartMumbai.insurance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Consultancy Requests:</span>
                <span className="font-bold text-red-600 flex items-center gap-1">
                  {loadingStats ? '...' : sourceStats.smartMumbai.consultancy}
                  <Lock className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Endpoint Access Control */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            API Endpoint Access Control
          </h3>
          <div className="space-y-3">
            {/* Loan Application Endpoint */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-gray-900">POST /api/applications/loan</span>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-gray-600">Loan Sarathi: <span className="font-semibold text-green-600">Allowed</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                  <span className="text-gray-600">Smart Mumbai: <span className="font-semibold text-green-600">Allowed</span></span>
                </div>
              </div>
            </div>

            {/* Insurance Application Endpoint */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-gray-900">POST /api/applications/insurance</span>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-gray-600">Loan Sarathi: <span className="font-semibold text-green-600">Allowed</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                  <span className="text-gray-600">Smart Mumbai: <span className="font-semibold text-green-600">Allowed</span></span>
                </div>
              </div>
            </div>

            {/* Consultancy Endpoint */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-red-600" />
                  <span className="font-semibold text-gray-900">POST /api/consultancy</span>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-gray-600">Loan Sarathi: <span className="font-semibold text-green-600">Allowed</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-600"></div>
                  <span className="text-gray-600">Smart Mumbai: <span className="font-semibold text-red-600">Blocked</span></span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 italic">
                Consultancy service is only available for Loan Sarathi. Smart Mumbai Solutions will receive a 403 error.
              </p>
            </div>

            {/* Loan Products Endpoint */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-gray-900">GET /api/loan-products</span>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-gray-600">Loan Sarathi: <span className="font-semibold text-green-600">Allowed</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                  <span className="text-gray-600">Smart Mumbai: <span className="font-semibold text-green-600">Allowed</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Source Detection Info */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              How Source Detection Works
            </h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Source is automatically detected from request headers (Origin/Referer)</li>
              <li>Default source: <span className="font-semibold">loan-sarathi</span></li>
              <li>Smart Mumbai Solutions is detected when domain contains &quot;smartmumbaisolutions&quot; or &quot;smartmumbai&quot;</li>
              <li>All applications are stored with their source for tracking and analytics</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Loan Products Management */}
      <div className="bg-white border border-gray-900 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Loan Products</h2>
            <p className="text-sm text-gray-500">Manage loan amounts and interest rates for product cards and detail pages</p>
          </div>
        </div>

        <div className="space-y-4">
          {loanProducts.map((product) => (
            <div
              key={product.slug}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">{product.title}</h3>
                {editingProduct === product.slug ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveProduct(product.slug)}
                      className="px-4 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>

              {editingProduct === product.slug ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Amount <span className="text-xs text-gray-500">(shown on card subtitle)</span>
                    </label>
                    <input
                      type="text"
                      value={editMaxAmount}
                      onChange={(e) => setEditMaxAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                      placeholder="e.g., Loans up to ₹50 Lakhs or Up to ₹2 Crores"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interest Rate <span className="text-xs text-gray-500">(shown on card tag as ROI)</span>
                    </label>
                    <input
                      type="text"
                      value={editInterestRate}
                      onChange={(e) => setEditInterestRate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                      placeholder="e.g., Interest rates starting @ 10.49% p.a. (will show as @10.49% ROI on card)"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-32">Max Amount:</span>
                    <span className="text-gray-900 font-medium">{product.maxAmount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-32">Interest Rate:</span>
                    <span className="text-gray-900 font-medium">{product.interestRate}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Database Info */}
      <div className="bg-white border border-gray-900 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Database className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Database Information</h2>
            <p className="text-sm text-gray-500">View database connection and statistics</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <span className="text-gray-700 font-medium">Database</span>
            <span className="text-gray-900 font-semibold">MongoDB</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <span className="text-gray-700 font-medium">Database Name</span>
            <span className="text-gray-900 font-semibold">loan-sarathi</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <span className="text-gray-700 font-medium">Status</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-semibold text-sm">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

