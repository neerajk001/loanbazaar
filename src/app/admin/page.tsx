'use client';
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye,
  Loader2,
  Globe
} from 'lucide-react';
import Link from 'next/link';

const StatCard = ({ title, value, change, changeType, icon: Icon, subtitle }: any) => (
  <div className="bg-white border border-gray-900 rounded-2xl p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
        <Icon className="h-6 w-6 text-gray-700" />
      </div>
      {change && (
        <div className={`flex items-center gap-1 text-sm font-medium ${changeType === 'up' ? 'text-green-600' : 'text-red-500'}`}>
          {changeType === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {change}
        </div>
      )}
    </div>
    <div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingReview: 0,
    approved: 0,
    totalLoanAmount: 0,
  });
  const [sourceStats, setSourceStats] = useState({
    loanSarathi: 0,
    smartMumbai: 0,
  });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all applications for accurate stats
      const response = await fetch('/api/admin/applications?limit=10000&type=all');
      const data = await response.json();
      
      if (data.success && data.applications) {
        // Calculate stats
        const allApps = data.applications;
        const totalApps = allApps.length;
        const pending = allApps.filter((app: any) => app.status === 'pending' || app.status === 'reviewing' || app.status === 'in-review').length;
        const approved = allApps.filter((app: any) => app.status === 'approved' || app.status === 'disbursed').length;
        const totalAmount = allApps
          .filter((app: any) => app.loanAmount)
          .reduce((sum: number, app: any) => sum + (app.loanAmount || 0), 0);

        setStats({
          totalApplications: totalApps,
          pendingReview: pending,
          approved: approved,
          totalLoanAmount: totalAmount,
        });

        // Calculate source statistics
        const loanSarathiCount = allApps.filter((app: any) => (app.source || 'loan-sarathi') === 'loan-sarathi').length;
        const smartMumbaiCount = allApps.filter((app: any) => app.source === 'smartmumbaisolutions').length;
        setSourceStats({
          loanSarathi: loanSarathiCount,
          smartMumbai: smartMumbaiCount,
        });

        // Format recent applications
        const recent = allApps.slice(0, 5).map((app: any) => ({
          id: app.applicationId || app.id,
          name: app.name || 'N/A',
          type: app.type === 'consultancy' ? 'Consultancy' : (app.loanType || app.insuranceType || 'N/A'),
          amount: app.type === 'consultancy' ? app.interestedIn || 'N/A' : (app.amount ? `₹${(app.amount / 100000).toFixed(2)}L` : app.sumInsured ? `₹${(app.sumInsured / 100000).toFixed(2)}L` : 'N/A'),
          status: app.status,
          date: app.createdAt || app.date,
          appType: app.type,
          source: app.source || 'loan-sarathi',
        }));

        setRecentApplications(recent);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'reviewing':
        return 'bg-blue-100 text-blue-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSourceBadge = (source: string) => {
    if (source === 'smartmumbaisolutions') {
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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Applications" 
            value={stats.totalApplications.toLocaleString()} 
            icon={FileText} 
            subtitle="All time"
          />
          <StatCard 
            title="Pending Review" 
            value={stats.pendingReview.toString()}
            icon={Clock} 
            subtitle="Requires action"
          />
          <StatCard 
            title="Approved" 
            value={stats.approved.toString()}
            icon={CheckCircle} 
            subtitle="Approved & disbursed"
          />
          <StatCard 
            title="Total Loan Amount" 
            value={stats.totalLoanAmount > 0 ? `₹${(stats.totalLoanAmount / 10000000).toFixed(2)}Cr` : '₹0'} 
            icon={TrendingUp} 
            subtitle="Total disbursed"
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications - Spans 2 columns */}
        <div className="lg:col-span-2 bg-white border border-gray-900 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
              <p className="text-sm text-gray-500">Latest loan applications received</p>
            </div>
            <Link 
              href="/admin/applications"
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              View All
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <div key={app.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-600">
                      {app.name !== 'N/A' ? app.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'N/A'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{app.name}</p>
                        {getSourceBadge(app.source)}
                      </div>
                      <p className="text-sm text-gray-500">{app.id} • {app.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{app.amount}</p>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusStyle(app.status)}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No applications yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white border border-gray-900 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                href="/admin/applications"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Review Applications</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-lg">{stats.pendingReview}</span>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </div>
              </Link>
              <Link 
                href="/admin/users"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Manage Users</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </Link>
              <Link 
                href="/"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">View Website</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </Link>
            </div>
          </div>

          {/* Performance Card */}
          <div className="bg-gray-900 border border-gray-900 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold">Overview</h3>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Total Applications</span>
                  <span className="font-semibold">{stats.totalApplications}</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: stats.totalApplications > 0 ? '100%' : '0%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Approved</span>
                  <span className="font-semibold">{stats.approved} / {stats.totalApplications}</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: stats.totalApplications > 0 ? `${(stats.approved / stats.totalApplications) * 100}%` : '0%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Pending</span>
                  <span className="font-semibold">{stats.pendingReview}</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: stats.totalApplications > 0 ? `${(stats.pendingReview / stats.totalApplications) * 100}%` : '0%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Source Breakdown Card */}
          <div className="bg-white border border-gray-900 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-gray-900">Source Breakdown</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span className="text-gray-600">Loan Sarathi</span>
                  </div>
                  <span className="font-bold text-gray-900">{sourceStats.loanSarathi}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: stats.totalApplications > 0 ? `${(sourceStats.loanSarathi / stats.totalApplications) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                    <span className="text-gray-600">Smart Mumbai Solutions</span>
                  </div>
                  <span className="font-bold text-gray-900">{sourceStats.smartMumbai}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-600 rounded-full" 
                    style={{ width: stats.totalApplications > 0 ? `${(sourceStats.smartMumbai / stats.totalApplications) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications Timeline */}
      {recentApplications.length > 0 && (
        <div className="bg-white border border-gray-900 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
              <p className="text-sm text-gray-500">Latest submissions</p>
            </div>
            <Link href="/admin/applications" className="p-2 hover:bg-gray-100 rounded-lg">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentApplications.slice(0, 5).map((app, index) => {
              const timeAgo = new Date(app.date).toLocaleDateString();
              return (
                <div key={app.id} className="flex items-center gap-4">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    app.status === 'approved' || app.status === 'disbursed' ? 'bg-green-500' : 
                    app.status === 'pending' || app.status === 'reviewing' ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-700">
                        Application {app.id} - {app.name} ({app.type})
                      </p>
                      {getSourceBadge(app.source)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
