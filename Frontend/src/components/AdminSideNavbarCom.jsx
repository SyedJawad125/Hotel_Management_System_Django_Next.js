'use client';
import React, { useState, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from '@/components/AuthContext';

const navSections = [
  {
    label: 'MAIN',
    items: [
      { icon: '📊', label: 'Dashboard', key: 'dashboard', path: '/admin/dashboard' },
      { icon: '🏛️', label: 'Halls & Venues', key: 'halls', path: '/admin/halls' },
      { icon: '📅', label: 'Event Bookings', key: 'bookings', path: '/admin/bookings' },
    ],
  },
  {
    label: 'FINANCIAL',
    items: [
      { icon: '💳', label: 'Payments', key: 'payments', path: '/admin/payments' },
      { icon: '💰', label: 'Hall Pricing', key: 'pricing', path: '/admin/hall-pricing' },
    ],
  },
  {
    label: 'SERVICES',
    items: [
      { icon: '🎁', label: 'Booking Services', key: 'services', path: '/admin/booking-services' },
      { icon: '✨', label: 'Hall Amenities', key: 'amenities', path: '/admin/hall-amenities' },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { icon: '👥', label: 'Customers', key: 'customers', path: '/admin/customers' },
      { icon: '👤', label: 'System Users', key: 'users', path: '/system_users' },
      { icon: '👤', label: 'Employees', key: 'employees', path: '/admin/employees' },
      { icon: '🛡️', label: 'Roles', key: 'roles', path: '/admin/roles' },
      { icon: '📈', label: 'Reports & Analytics', key: 'reports', path: '/admin/reports' },
    ],
  },
];

export default function AdminSideNavbarCom() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, loading } = useContext(AuthContext);
  const [activeScreen, setActiveScreen] = useState(() => {
    // Determine active screen based on current path
    const currentPath = pathname || '/admin/dashboard';
    for (const section of navSections) {
      for (const item of section.items) {
        if (item.path === currentPath) {
          return item.key;
        }
      }
    }
    return 'dashboard';
  });

  const handleNavigate = (key, path) => {
    setActiveScreen(key);
    router.push(path);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/Login');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return (user.first_name[0] + user.last_name[0]).toUpperCase();
    }
    if (user?.first_name) {
      return user.first_name.substring(0, 2).toUpperCase();
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'AD';
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.full_name) return user.full_name;
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.username || 'Admin User';
  };

  // Get user role display
  const getUserRoleDisplay = () => {
    if (user?.role?.name) return user.role.name;
    if (user?.is_superuser) return 'Super Administrator';
    if (user?.is_staff) return 'Staff Member';
    return 'User';
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col h-full bg-black overflow-y-auto items-center justify-center">
        <div className="text-yellow-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black overflow-y-auto">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-yellow-600/25 text-center bg-black">
        <div 
          style={{ 
            fontFamily: 'Cormorant Garamond, serif', 
            fontSize: 16, 
            letterSpacing: 2, 
            color: '#C6A43F', 
            marginBottom: 4, 
            fontWeight: 600 
          }}
        >
          القرية الشعبية
        </div>
        <div 
          style={{ 
            fontFamily: 'Cormorant Garamond, serif', 
            fontSize: 20, 
            fontWeight: 600, 
            color: '#C6A43F', 
            letterSpacing: 2 
          }}
        >
          The Heritage Village
        </div>
        <div 
          style={{ 
            fontFamily: 'Cormorant Garamond, serif', 
            fontSize: 11, 
            color: '#C6A43F', 
            letterSpacing: 2, 
            marginTop: 2 
          }}
        >
          — 1998 —
        </div>
        <div 
          style={{ 
            fontSize: 9, 
            letterSpacing: 2, 
            textTransform: 'uppercase', 
            color: '#ffffff', 
            marginTop: 6 
          }}
        >
          Event & Hall Management
        </div>
      </div>

      {/* Nav Sections */}
      <div className="flex-1 py-2">
        {navSections.map((section) => (
          <div key={section.label}>
            <div 
              style={{ 
                fontSize: 9, 
                letterSpacing: 2, 
                textTransform: 'uppercase', 
                color: '#666', 
                padding: '10px 24px 4px' 
              }}
            >
              {section.label}
            </div>
            {section.items.map((item) => {
              const isActive = activeScreen === item.key;
              return (
                <div
                  key={item.key}
                  onClick={() => handleNavigate(item.key, item.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 24px',
                    cursor: 'pointer',
                    fontSize: 14,
                    color: isActive ? '#C6A43F' : '#CCCCCC',
                    background: isActive ? 'rgba(198,164,63,0.18)' : 'transparent',
                    fontWeight: isActive ? 500 : 400,
                    borderLeft: isActive ? '2px solid #C6A43F' : '2px solid transparent',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#C6A43F';
                      e.currentTarget.style.background = 'rgba(198,164,63,0.12)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#CCCCCC';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              );
            })}
            {section.label === 'MAIN' && (
              <div style={{ borderTop: '1px solid rgba(198,164,63,0.15)', marginTop: 4 }} />
            )}
          </div>
        ))}
      </div>

      {/* Bottom User Card + Logout */}
      <div style={{ padding: 16, borderTop: '1px solid rgba(198,164,63,0.25)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px',
            background: '#111111',
            borderRadius: 12,
            marginBottom: 12,
            border: '1px solid rgba(198,164,63,0.3)',
            cursor: 'pointer',
          }}
          onClick={() => router.push('/admin/profile')}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: '#C6A43F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              color: 'black',
              fontSize: 14,
            }}
          >
            {getUserInitials()}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#EEEEEE' }}>
              {getUserDisplayName()}
            </div>
            <div style={{ fontSize: 10, color: '#C6A43F' }}>
              {getUserRoleDisplay()}
            </div>
          </div>
        </div>
        <div
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 16px',
            background: '#000000',
            borderRadius: 12,
            cursor: 'pointer',
            color: '#ff6b6b',
            fontSize: 12,
            fontWeight: 500,
            border: '1px solid rgba(217,83,79,0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(217,83,79,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#000000';
          }}
        >
          <span>🚪</span>
          <span>Logout / تسجيل الخروج</span>
        </div>
      </div>
    </div>
  );
}