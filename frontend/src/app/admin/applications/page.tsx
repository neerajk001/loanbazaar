'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Check, 
  X, 
  Eye, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Download,
  SlidersHorizontal,
  Loader2,
  Globe
} from 'lucide-react';

interface Application {
  applicationId: string;
  id: string;
  name: string;
  email?: string;
  phone: string;
  loanType?: string;
  insuranceType?: string;
  interestedIn?: string;
  amount?: number;
  sumInsured?: number;
  status: string;
  createdAt: Date | string;
  type: 'loan' | 'insurance' | 'consultancy';
  source?: string;
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    approved: 0,
    rejected: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to page 1 when filter/search changes
      fetchApplications();
    }, search ? 500 : 0); // Debounce search by 500ms

    return () => clearTimeout(timeoutId);
  }, [filter, search, sourceFilter]);

  useEffect(() => {
    fetchApplications();
  }, [currentPage]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: 'all',
        limit: limit.toString(),
        page: currentPage.toString(),
      });
      
      if (filter !== 'all') {
        params.append('status', filter);
      }
      
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/admin/applications?${params}`);
      const data = await response.json();

      if (data.success) {
        let filteredApps = data.applications || [];
        
        // Filter by source
        if (sourceFilter !== 'all') {
          filteredApps = filteredApps.filter((app: Application) => {
            const appSource = app.source || 'loan-sarathi';
            return appSource === sourceFilter;
          });
        }
        
        setApplications(filteredApps);
        if (data.stats) {
          setStats(data.stats);
        }
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
        }
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { id: 'all', label: 'All', count: stats.total },
    { id: 'pending', label: 'Pending', count: stats.pending },
    { id: 'reviewing', label: 'In Review', count: stats.reviewing },
    { id: 'approved', label: 'Approved', count: stats.approved },
    { id: 'rejected', label: 'Rejected', count: stats.rejected },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
      case 'disbursed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'reviewing':
      case 'in-review':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatAmount = (app: Application) => {
    if (app.type === 'loan' && app.amount) {
      if (app.amount >= 10000000) {
        return `₹${(app.amount / 10000000).toFixed(2)}Cr`;
      } else if (app.amount >= 100000) {
        return `₹${(app.amount / 100000).toFixed(2)}L`;
      }
      return `₹${app.amount.toLocaleString('en-IN')}`;
    } else if (app.type === 'insurance' && app.sumInsured) {
      if (app.sumInsured >= 10000000) {
        return `₹${(app.sumInsured / 10000000).toFixed(2)}Cr`;
      } else if (app.sumInsured >= 100000) {
        return `₹${(app.sumInsured / 100000).toFixed(2)}L`;
      }
      return `₹${app.sumInsured.toLocaleString('en-IN')}`;
    }
    return 'N/A';
  };

  const getTypeLabel = (app: Application) => {
    if (app.type === 'loan') {
      return app.loanType || 'Loan';
    } else if (app.type === 'insurance') {
      return app.insuranceType || 'Insurance';
    } else {
      return app.interestedIn || 'Consultancy';
    }
  };

  const getSourceBadge = (source?: string) => {
    const appSource = source || 'loan-sarathi';
    if (appSource === 'smartmumbaisolutions') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
          <Globe className="w-3 h-3" />
          Smart Mumbai
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
        <Globe className="w-3 h-3" />
        Loanbazaar
      </span>
    );
  };

  const handleView = (app: Application) => {
    const id = app.applicationId || app.id;
    if (id) {
      router.push(`/admin/applications/${id}`);
    } else {
      console.error('No application ID found:', app);
      alert('Application ID not found');
    }
  };

  const handleStatusUpdate = async (app: Application, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/applications/${app.applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchApplications();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-500 mt-1">Manage and review loan applications</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-gray-900 rounded-2xl p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === f.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
                <span className={`ml-2 px-1.5 py-0.5 rounded-md text-xs ${
                  filter === f.id ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {f.count}
                </span>
              </button>
            ))}
            
            {/* Source Filter */}
            <div className="flex gap-2 border-l border-gray-200 pl-2">
              <button
                onClick={() => setSourceFilter('all')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  sourceFilter === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Sources
              </button>
              <button
                onClick={() => setSourceFilter('loan-sarathi')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1 ${
                  sourceFilter === 'loan-sarathi'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <Globe className="w-3 h-3" />
                Loan Sarathi
              </button>
              <button
                onClick={() => setSourceFilter('smartmumbaisolutions')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1 ${
                  sourceFilter === 'smartmumbaisolutions'
                    ? 'bg-orange-600 text-white'
                    : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                }`}
              >
                <Globe className="w-3 h-3" />
                Smart Mumbai
              </button>
            </div>
          </div>

          {/* Search & More Filters */}
          <div className="flex gap-3">
            <div className="relative flex-1 lg:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-gray-900 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Loan Details</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Documents</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
                    <p className="text-gray-500 mt-2">Loading applications...</p>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-gray-500">No applications found</p>
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.applicationId || app.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-600">
                          {app.name && app.name !== 'N/A' ? app.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'N/A'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{app.name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{app.applicationId || app.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getSourceBadge(app.source)}
                    </td>
                    <td className="px-6 py-4">
                      {app.type === 'consultancy' ? (
                        <>
                          <p className="font-semibold text-gray-900">Consultancy Request</p>
                          <p className="text-sm text-gray-500">{getTypeLabel(app)}</p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-gray-900">{formatAmount(app)}</p>
                          <p className="text-sm text-gray-500">{getTypeLabel(app)}</p>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{app.email || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{app.phone || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">-</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusStyle(app.status)}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1).replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleView(app)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors" 
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {app.status !== 'approved' && app.status !== 'disbursed' && (
                          <button 
                            onClick={() => handleStatusUpdate(app, 'approved')}
                            className="p-2 hover:bg-green-100 rounded-lg text-gray-500 hover:text-green-600 transition-colors" 
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {app.status !== 'rejected' && (
                          <button 
                            onClick={() => handleStatusUpdate(app, 'rejected')}
                            className="p-2 hover:bg-red-100 rounded-lg text-gray-500 hover:text-red-600 transition-colors" 
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && applications.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-700">{(currentPage - 1) * limit + 1}</span> to <span className="font-semibold text-gray-700">{Math.min(currentPage * limit, stats.total)}</span> of <span className="font-semibold text-gray-700">{stats.total}</span> applications
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
