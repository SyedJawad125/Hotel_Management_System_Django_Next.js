'use client';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInstance from "@/components/AxiosInstance";
import {
  Activity, Clock, User, Bell, Filter,
  RefreshCw, Calendar, CheckCircle, AlertCircle,
  Info, TrendingUp, Settings, Users, DollarSign,
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

const ActivityLogCom = () => {
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([]);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get('/api/hotel/v1/activity/log/', {
        params: { limit: 100 }
      });
      const data = response?.data?.data || response?.data?.data?.data || [];
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Error loading activity logs');
    } finally {
      setLoading(false);
    }
  };

  const getIconForActivity = (icon) => {
    const iconMap = {
      '🔔': Bell,
      '📅': Calendar,
      '✅': CheckCircle,
      '⚠️': AlertCircle,
      'ℹ️': Info,
      '📈': TrendingUp,
      '⚙️': Settings,
      '👥': Users,
      '💰': DollarSign,
    };
    return iconMap[icon] || Activity;
  };

  const filteredActivities = activities.filter(activity => {
    if (filterType === 'all') return true;
    return activity.icon === filterType;
  });

  const iconCounts = activities.reduce((acc, activity) => {
    acc[activity.icon] = (acc[activity.icon] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ width: '100%', minHeight: '100%', background: '#F6F3EC', fontFamily: bodyFont }}>
      <ToastContainer position="top-right" autoClose={3000} theme="light" className="mt-16" />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 28px 60px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, fontWeight: 700, marginBottom: 8 }}>
            System Logs
          </div>
          <h1 style={{ fontFamily: displayFont, fontSize: 42, color: ink, fontWeight: 600, lineHeight: 1.1 }}>
            Activity Log
          </h1>
          <p style={{ color: '#A39C8A', fontSize: 14, marginTop: 8 }}>
            Track all system activities and user actions
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20, marginBottom: 32,
        }}>
          <div style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
            padding: 24, boxShadow: shadowCard,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${gold}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Activity size={22} color={gold} />
              </div>
              <div>
                <p style={{ fontSize: 32, color: ink, fontWeight: 600, lineHeight: 1 }}>
                  {activities.length}
                </p>
                <p style={{ fontSize: 12, color: '#A39C8A', fontWeight: 600, letterSpacing: '0.05em' }}>
                  Total Activities
                </p>
              </div>
            </div>
          </div>

          <div style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
            padding: 24, boxShadow: shadowCard,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: '#EAF4EA', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckCircle size={22} color="#3D7A45" />
              </div>
              <div>
                <p style={{ fontSize: 32, color: ink, fontWeight: 600, lineHeight: 1 }}>
                  {iconCounts['✅'] || 0}
                </p>
                <p style={{ fontSize: 12, color: '#A39C8A', fontWeight: 600, letterSpacing: '0.05em' }}>
                  Completed
                </p>
              </div>
            </div>
          </div>

          <div style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
            padding: 24, boxShadow: shadowCard,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: '#FEF7E6', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <AlertCircle size={22} color="#B8860B" />
              </div>
              <div>
                <p style={{ fontSize: 32, color: ink, fontWeight: 600, lineHeight: 1 }}>
                  {iconCounts['⚠️'] || 0}
                </p>
                <p style={{ fontSize: 12, color: '#A39C8A', fontWeight: 600, letterSpacing: '0.05em' }}>
                  Warnings
                </p>
              </div>
            </div>
          </div>

          <div style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
            padding: 24, boxShadow: shadowCard,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Users size={22} color="#3D7A45" />
              </div>
              <div>
                <p style={{ fontSize: 32, color: ink, fontWeight: 600, lineHeight: 1 }}>
                  {new Set(activities.map(a => a.user_name).filter(Boolean)).size}
                </p>
                <p style={{ fontSize: 12, color: '#A39C8A', fontWeight: 600, letterSpacing: '0.05em' }}>
                  Active Users
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{
          background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
          padding: 20, marginBottom: 24, boxShadow: shadowCard,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Filter size={20} color={gold} />
              <span style={{ fontSize: 14, color: ink, fontWeight: 600 }}>Filter by Type:</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() => setFilterType('all')}
                style={{
                  padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: filterType === 'all' ? ink : '#FFFFFF',
                  color: filterType === 'all' ? '#FBF6E8' : ink,
                  border: filterType === 'all' ? 'none' : `1px solid ${line}`,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('🔔')}
                style={{
                  padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: filterType === '🔔' ? ink : '#FFFFFF',
                  color: filterType === '🔔' ? '#FBF6E8' : ink,
                  border: filterType === '🔔' ? 'none' : `1px solid ${line}`,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                🔔 Notifications
              </button>
              <button
                onClick={() => setFilterType('✅')}
                style={{
                  padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: filterType === '✅' ? ink : '#FFFFFF',
                  color: filterType === '✅' ? '#FBF6E8' : ink,
                  border: filterType === '✅' ? 'none' : `1px solid ${line}`,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                ✅ Completed
              </button>
              <button
                onClick={() => setFilterType('⚠️')}
                style={{
                  padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: filterType === '⚠️' ? ink : '#FFFFFF',
                  color: filterType === '⚠️' ? '#FBF6E8' : ink,
                  border: filterType === '⚠️' ? 'none' : `1px solid ${line}`,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                ⚠️ Warnings
              </button>
            </div>
            <button
              onClick={fetchActivities}
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
              Refresh
            </button>
          </div>
        </div>

        {/* Activity List */}
        <div style={{
          background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
          padding: 24, boxShadow: shadowCard,
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#A39C8A' }}>
              <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }} />
              <p>Loading activities…</p>
            </div>
          ) : filteredActivities.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filteredActivities.map((activity, index) => {
                const IconComponent = getIconForActivity(activity.icon);
                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 16,
                      padding: 20, borderRadius: 14,
                      background: index % 2 === 0 ? '#FFFFFF' : `${gold}04`,
                      border: `1px solid ${lineSoft}`,
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: `${gold}12`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span style={{ fontSize: 24 }}>{activity.icon}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                        <h3 style={{ fontSize: 15, color: ink, fontWeight: 600, lineHeight: 1.4 }}>
                          {activity.text}
                        </h3>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '4px 10px', borderRadius: 999,
                          background: `${gold}08`, color: gold,
                          fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
                        }}>
                          <Clock size={12} />
                          {activity.time_ago || 'Just now'}
                        </div>
                      </div>
                      {activity.user_name && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                          <User size={14} color="#A39C8A" />
                          <span style={{ fontSize: 13, color: '#A39C8A' }}>
                            {activity.user_name}
                          </span>
                        </div>
                      )}
                      {activity.created_at && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                          <Calendar size={14} color="#A39C8A" />
                          <span style={{ fontSize: 12, color: '#A39C8A' }}>
                            {new Date(activity.created_at).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 60, color: '#A39C8A' }}>
              <Activity size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
              <p>No activities found</p>
            </div>
          )}
        </div>

      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ActivityLogCom;
