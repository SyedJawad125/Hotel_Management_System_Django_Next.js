'use client';
import React, { useState, useEffect, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInstance from "@/components/AxiosInstance";
import { AuthContext } from '@/components/AuthContext';
import {
  Calendar, Download, Filter, DollarSign, Users,
  FileText, TrendingUp, ArrowDown, ArrowUp,
  RefreshCw, X, CheckCircle, Clock, XCircle,
} from 'lucide-react';

/* ── Design tokens — Gulf Hotel gold-on-ivory ───────────────────────── */
const gold = '#C6A43F';
const goldDeep = '#9C7F2C';
const ink = '#26231D';
const ivory = '#FBF9F4';
const line = 'rgba(198,164,63,0.22)';
const lineSoft = 'rgba(198,164,63,0.12)';
const shadowCard = '0 10px 30px -12px rgba(38,35,29,0.10)';

const displayFont = "'Cormorant Garamond', serif";
const bodyFont = "'DM Sans', sans-serif";

const ReportsCom = () => {
  const { permissions = {} } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('revenue');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [revenueData, setRevenueData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    // Set default date range (current month)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(lastDay.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchReports();
    }
  }, [startDate, endDate]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Fetch bookings for revenue report
      const bookingsRes = await AxiosInstance.get('/api/hotel/v1/booking/', {
        params: {
          limit: 1000,
          date__gte: startDate,
          date__lte: endDate,
        },
      });
      const bookings = bookingsRes?.data?.data || bookingsRes?.data?.data?.data || [];

      // Process revenue data
      const revenue = bookings.map(b => ({
        bookingCode: b.booking_code,
        hallName: b.hall_name_en || b.hall?.name_en || '—',
        customerName: b.customer_name || b.customer?.name_en || '—',
        date: b.date,
        status: b.status,
        total: Number(b.total || 0),
      }));

      setRevenueData(revenue);
      setTotalRevenue(revenue.reduce((sum, r) => sum + r.total, 0));

      // Process customer data
      const customerMap = new Map();
      bookings.forEach(b => {
        const customerName = b.customer_name || b.customer?.name_en || 'Unknown';
        if (customerMap.has(customerName)) {
          customerMap.set(customerName, customerMap.get(customerName) + 1);
        } else {
          customerMap.set(customerName, 1);
        }
      });

      const customers = Array.from(customerMap.entries())
        .map(([name, bookings]) => ({ customerName: name, bookings }))
        .sort((a, b) => b.bookings - a.bookings);

      setCustomerData(customers);

    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Error loading reports data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = (data, filename) => {
    if (data.length === 0) {
      toast.warning('No data to export');
      return;
    }

    const headers = activeTab === 'revenue'
      ? ['Booking Code', 'Hall', 'Customer', 'Date', 'Status', 'Total (SAR)']
      : ['Customer Name', 'Bookings in Period'];

    const rows = data.map(row =>
      activeTab === 'revenue'
        ? [row.bookingCode, row.hallName, row.customerName, row.date, row.status, row.total]
        : [row.customerName, row.bookings]
    );

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${startDate}_to_${endDate}.csv`;
    link.click();
    toast.success('CSV exported successfully');
  };

  const getStatusConfig = (status) => {
    const configs = {
      confirmed: { color: '#3D7A45', bg: '#EAF4EA', icon: CheckCircle, label: 'Confirmed' },
      pending: { color: '#B8860B', bg: '#FEF7E6', icon: Clock, label: 'Pending' },
      cancelled: { color: '#B23B3B', bg: '#FBEAEA', icon: XCircle, label: 'Cancelled' },
    };
    return configs[status] || configs.pending;
  };

  return (
    <div style={{ width: '100%', minHeight: '100%', background: '#F6F3EC', fontFamily: bodyFont }}>
      <ToastContainer position="top-right" autoClose={3000} theme="light" className="mt-16" />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '36px 28px 60px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, fontWeight: 700, marginBottom: 8 }}>
            Analytics
          </div>
          <h1 style={{ fontFamily: displayFont, fontSize: 42, color: ink, fontWeight: 600, lineHeight: 1.1 }}>
            Reports & Analytics
          </h1>
          <p style={{ color: '#A39C8A', fontSize: 14, marginTop: 8 }}>
            Generate revenue and customer reports with date range filtering
          </p>
        </div>

        {/* Date Range Filter */}
        <div style={{
          background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
          padding: 24, boxShadow: shadowCard, marginBottom: 32,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${gold}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Filter size={22} color={gold} />
              </div>
              <div>
                <h2 style={{ fontFamily: displayFont, fontSize: 18, color: ink, fontWeight: 600, marginBottom: 2 }}>
                  Date Range Filter
                </h2>
                <p style={{ fontSize: 12, color: '#A39C8A' }}>Select period for reports</p>
              </div>
            </div>
            <button
              onClick={fetchReports}
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: ink, color: '#FBF6E8', border: 'none',
                padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                opacity: loading ? 0.6 : 1,
              }}
            >
              <RefreshCw size={16} color={gold} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#A39C8A', marginBottom: 6, fontWeight: 600 }}>
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 10,
                  border: `1px solid ${line}`, background: ivory, color: ink,
                  fontSize: 14, fontFamily: bodyFont,
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#A39C8A', marginBottom: 6, fontWeight: 600 }}>
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 10,
                  border: `1px solid ${line}`, background: ivory, color: ink,
                  fontSize: 14, fontFamily: bodyFont,
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#A39C8A', marginBottom: 6, fontWeight: 600 }}>
                Period
              </label>
              <div style={{
                padding: '12px 16px', borderRadius: 10,
                border: `1px solid ${line}`, background: `${gold}08`, color: ink,
                fontSize: 14, fontWeight: 600,
              }}>
                {startDate && endDate ? `${startDate} to ${endDate}` : 'Select dates'}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex', gap: 8, marginBottom: 24,
          background: '#FFFFFF', padding: 8, borderRadius: 14,
          border: `1px solid ${line}`, boxShadow: shadowCard,
        }}>
          <button
            onClick={() => setActiveTab('revenue')}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '14px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600,
              background: activeTab === 'revenue' ? ink : 'transparent',
              color: activeTab === 'revenue' ? '#FBF6E8' : ink,
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <DollarSign size={18} color={activeTab === 'revenue' ? gold : '#A39C8A'} />
            Revenue Report
          </button>
          <button
            onClick={() => setActiveTab('customer')}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '14px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600,
              background: activeTab === 'customer' ? ink : 'transparent',
              color: activeTab === 'customer' ? '#FBF6E8' : ink,
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <Users size={18} color={activeTab === 'customer' ? gold : '#A39C8A'} />
            Customer Report
          </button>
        </div>

        {/* Revenue Report */}
        {activeTab === 'revenue' && (
          <div style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
            padding: 24, boxShadow: shadowCard,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: '#EAF4EA', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <TrendingUp size={22} color="#3D7A45" />
                </div>
                <div>
                  <h2 style={{ fontFamily: displayFont, fontSize: 22, color: ink, fontWeight: 600, marginBottom: 4 }}>
                    Revenue Report
                  </h2>
                  <p style={{ fontSize: 13, color: '#A39C8A' }}>
                    {revenueData.length} booking{revenueData.length !== 1 ? 's' : ''} • Total: SAR {totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleExportCSV(revenueData, 'revenue_report')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: '#FFFFFF', color: ink, border: `1px solid ${line}`,
                  padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <Download size={16} color={gold} />
                Export CSV
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#A39C8A' }}>
                <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }} />
                <p>Loading revenue data…</p>
              </div>
            ) : revenueData.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${line}` }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 700 }}>
                        Booking Code
                      </th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 700 }}>
                        Hall
                      </th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 700 }}>
                        Customer
                      </th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 700 }}>
                        Date
                      </th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 700 }}>
                        Status
                      </th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 700 }}>
                        Total (SAR)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.map((row, index) => {
                      const statusConfig = getStatusConfig(row.status);
                      const StatusIcon = statusConfig.icon;
                      return (
                        <tr
                          key={index}
                          style={{ borderBottom: `1px solid ${lineSoft}`, transition: 'background 0.2s' }}
                        >
                          <td style={{ padding: '14px 16px', fontSize: 13, color: ink, fontWeight: 600 }}>
                            {row.bookingCode || '—'}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 13, color: ink }}>
                            {row.hallName}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 13, color: ink }}>
                            {row.customerName}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 13, color: '#A39C8A' }}>
                            {row.date || '—'}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                              padding: '4px 10px', borderRadius: 999,
                              background: statusConfig.bg, color: statusConfig.color,
                              fontSize: 11, fontWeight: 600,
                            }}>
                              <StatusIcon size={12} />
                              {statusConfig.label}
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 13, color: ink, fontWeight: 600 }}>
                            SAR {row.total.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 60, color: '#A39C8A' }}>
                <FileText size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                <p>No revenue data for selected period</p>
              </div>
            )}
          </div>
        )}

        {/* Customer Report */}
        {activeTab === 'customer' && (
          <div style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
            padding: 24, boxShadow: shadowCard,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Users size={22} color="#3D7A45" />
                </div>
                <div>
                  <h2 style={{ fontFamily: displayFont, fontSize: 22, color: ink, fontWeight: 600, marginBottom: 4 }}>
                    Customer Report
                  </h2>
                  <p style={{ fontSize: 13, color: '#A39C8A' }}>
                    {customerData.length} customer{customerData.length !== 1 ? 's' : ''} in selected period
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleExportCSV(customerData, 'customer_report')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: '#FFFFFF', color: ink, border: `1px solid ${line}`,
                  padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <Download size={16} color={gold} />
                Export CSV
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#A39C8A' }}>
                <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }} />
                <p>Loading customer data…</p>
              </div>
            ) : customerData.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${line}` }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 700 }}>
                        #
                      </th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 700 }}>
                        Customer Name
                      </th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 700 }}>
                        Bookings in Period
                      </th>
                      <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 700 }}>
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerData.map((row, index) => (
                      <tr
                        key={index}
                        style={{ borderBottom: `1px solid ${lineSoft}`, transition: 'background 0.2s' }}
                      >
                        <td style={{ padding: '14px 16px', fontSize: 13, color: '#A39C8A', fontWeight: 600 }}>
                          {index + 1}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: ink, fontWeight: 600 }}>
                          {row.customerName}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 13, color: ink, fontWeight: 600 }}>
                          {row.bookings}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '4px 10px', borderRadius: 999,
                            background: '#EAF4EA', color: '#3D7A45',
                            fontSize: 11, fontWeight: 600,
                          }}>
                            {index < 3 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                            {index < 3 ? 'Top' : 'Regular'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 60, color: '#A39C8A' }}>
                <Users size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                <p>No customer data for selected period</p>
              </div>
            )}
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ReportsCom;
