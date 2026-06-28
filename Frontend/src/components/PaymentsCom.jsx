'use client';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInstance from "@/components/AxiosInstance";
import { AuthContext } from '@/components/AuthContext';
import {
  Search, Plus, Pencil, Trash2, X, DollarSign, Calendar,
  ChevronLeft, ChevronRight, CreditCard, Wallet, Banknote,
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

/* ── Small building blocks ───────────────────────────────────────────── */

const MethodPill = ({ method }) => {
  const config = {
    cash: { bg: '#EAF4EA', color: '#3D7A45', border: 'rgba(61,122,69,0.18)', icon: Banknote },
 card: { bg: '#F0F4FF', color: '#3B82F6', border: 'rgba(59,130,246,0.18)', icon: CreditCard },
    bank_transfer: { bg: '#FEF7E6', color: '#B8860B', border: 'rgba(184,134,11,0.18)', icon: Wallet },
    check: { bg: '#FBEAEA', color: '#B23B3B', border: 'rgba(178,59,59,0.18)', icon: DollarSign },
  };
  const c = config[method?.toLowerCase()] || config.cash;
  const Icon = c.icon;
  
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700,
        letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: bodyFont,
        background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      }}
    >
      <Icon size={12} />
      {method || 'Cash'}
    </span>
  );
};

const FormGroup = ({ label, required, children, hint }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{
      fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
      color: '#8A8270', marginBottom: 7, display: 'block', fontWeight: 600, fontFamily: bodyFont,
    }}>
      {label}{required && <span style={{ color: gold }}> *</span>}
    </label>
    {children}
    {hint && <div style={{ fontSize: 11, color: '#A39C8A', marginTop: 5, fontFamily: bodyFont }}>{hint}</div>}
  </div>
);

const inputStyle = {
  width: '100%', background: ivory, border: `1px solid ${line}`,
  borderRadius: 10, padding: '11px 14px', fontSize: 13.5, fontFamily: bodyFont,
  outline: 'none', color: ink, boxSizing: 'border-box', transition: 'border-color 0.15s',
};

function TextField({ value, onChange, ...rest }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      style={{ ...inputStyle, borderColor: focused ? gold : line }}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...rest}
    />
  );
}

/* ── Modal shell ──────────────────────────────────────────────────────── */

function Modal({ title, subtitle, onClose, children, wide }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(38,35,29,0.45)',
        backdropFilter: 'blur(6px)', zIndex: 2000, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#FFFFFF', borderRadius: 22, width: '100%',
        maxWidth: wide ? 640 : 480, maxHeight: '88vh', overflowY: 'auto',
        boxShadow: '0 30px 60px -15px rgba(38,35,29,0.35)',
        border: `1px solid ${line}`,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          padding: '22px 26px', borderBottom: `1px solid ${lineSoft}`,
          position: 'sticky', top: 0, background: '#FFFFFF', borderRadius: '22px 22px 0 0',
        }}>
          <div>
            <div style={{ fontFamily: displayFont, fontSize: 23, color: ink, fontWeight: 600 }}>{title}</div>
            {subtitle && <div style={{ fontFamily: bodyFont, fontSize: 12.5, color: '#A39C8A', marginTop: 3 }}>{subtitle}</div>}
          </div>
          <button
            onClick={onClose}
            style={{
              cursor: 'pointer', width: 30, height: 30, borderRadius: '50%',
              border: `1px solid ${line}`, background: ivory, color: '#8A8270',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <X size={15} />
          </button>
        </div>
        <div style={{ padding: 26 }}>{children}</div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────── */

const PaymentsCom = () => {
  const { permissions = {} } = useContext(AuthContext);

  const [records, setRecords] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(count / recordsPerPage));

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [saving, setSaving] = useState(false);

  const [bookings, setBookings] = useState([]);

  const emptyForm = {
    booking: '', amount: '', payment_method: 'cash', payment_date: '', notes: '',
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchPayments();
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get('/api/hotel/v1/payment/', {
        params: {
          limit: recordsPerPage,
          offset: (currentPage - 1) * recordsPerPage,
        },
      });

      const payload = res?.data;
      const list = Array.isArray(payload?.data) ? payload.data : payload?.data?.data;
      const total = Array.isArray(payload?.data) ? payload.count : payload?.data?.count;

      if (Array.isArray(list)) {
        setRecords(list);
        setCount(total ?? list.length);
      } else {
        console.error('Unexpected response structure:', res);
        toast.error('Could not load payments');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error('Error fetching payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await AxiosInstance.get('/api/hotel/v1/booking/', { params: { limit: 100 } });
      const list = res?.data?.data || res?.data?.data?.data || [];
      setBookings(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const filteredRecords = useMemo(() => {
    if (!Array.isArray(records)) return [];
    const q = searchTerm.trim().toLowerCase();
    if (!q) return records;
    return records.filter((p) => {
      const idMatch = p.id?.toString() === q;
      const bookingMatch = p.booking?.booking_code?.toLowerCase().includes(q);
      const methodMatch = p.payment_method?.toLowerCase().includes(q);
      const amountMatch = p.amount?.toString().includes(q);
      return idMatch || bookingMatch || methodMatch || amountMatch;
    });
  }, [records, searchTerm]);

  const totalPayments = count;
  const totalAmount = records.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const cashPayments = records.filter((p) => p.payment_method === 'cash').length;
  const cardPayments = records.filter((p) => p.payment_method === 'card').length;

  /* ── Modal handlers ── */

  const openCreate = () => {
    setEditingPayment(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (payment) => {
    setEditingPayment(payment);
    setForm({
      booking: payment.booking?.id || '',
      amount: payment.amount || '',
      payment_method: payment.payment_method || 'cash',
      payment_date: payment.payment_date || '',
      notes: payment.notes || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const savePayment = async (e) => {
    e.preventDefault();
    if (!form.booking || !form.amount || !form.payment_date) {
      toast.error('Booking, amount, and payment date are required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        booking: form.booking,
        amount: form.amount,
        payment_method: form.payment_method,
        payment_date: form.payment_date,
        notes: form.notes,
      };

      if (editingPayment) {
        await AxiosInstance.patch(`/api/hotel/v1/payment/?id=${editingPayment.id}`, payload);
        toast.success('Payment updated successfully');
      } else {
        await AxiosInstance.post('/api/hotel/v1/payment/', payload);
        toast.success('Payment recorded successfully');
      }
      setModalOpen(false);
      setCurrentPage(1);
      fetchPayments();
    } catch (error) {
      console.error('Error saving payment:', error);
      const msg = error?.response?.data?.message || error?.response?.data?.data || 'Error saving payment';
      toast.error(typeof msg === 'string' ? msg : 'Error saving payment');
    } finally {
      setSaving(false);
    }
  };

  const deletePayment = async (payment) => {
    if (!window.confirm(`Remove this payment record? This cannot be undone.`)) return;
    try {
      const res = await AxiosInstance.delete(`/api/hotel/v1/payment/?id=${payment.id}`);
      if (res) {
        toast.success('Payment deleted successfully');
        setCurrentPage(1);
        fetchPayments();
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast.error(typeof msg === 'string' ? msg : 'Error deleting payment');
    }
  };

  /* ── Render ── */

  return (
    <div style={{ width: '100%', minHeight: '100%', background: '#F6F3EC', fontFamily: bodyFont }}>
      <ToastContainer position="top-right" autoClose={3000} theme="light" className="mt-16" />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 28px 60px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 18, marginBottom: 30 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, fontWeight: 700, marginBottom: 8 }}>
              Financial Management
            </div>
            <h1 style={{ fontFamily: displayFont, fontSize: 38, color: ink, fontWeight: 600, lineHeight: 1.1 }}>
              Payments
            </h1>
          </div>

          {permissions.create_payment && (
            <button
              onClick={openCreate}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: ink, color: '#FBF6E8', border: 'none',
                padding: '13px 24px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', letterSpacing: '0.02em', boxShadow: '0 8px 18px -6px rgba(38,35,29,0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
            >
              <Plus size={16} color={gold} />
              Record Payment
            </button>
          )}
        </div>

        {/* Stat strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 26 }}>
          {[
            { label: 'Total Payments', value: totalPayments, icon: DollarSign },
            { label: 'Total Amount', value: `SAR ${totalAmount.toLocaleString()}`, icon: Wallet, accent: goldDeep },
            { label: 'Cash Payments', value: cashPayments, icon: Banknote, accent: '#3D7A45' },
            { label: 'Card Payments', value: cardPayments, icon: CreditCard, accent: '#3B82F6' },
          ].map(({ label, value, icon: Icon, accent }) => (
            <div key={label} style={{
              background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
              padding: '18px 20px', boxShadow: shadowCard,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 600 }}>{label}</span>
                <Icon size={16} color={accent || gold} />
              </div>
              <div style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 600, color: accent || ink }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{
          background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 14,
          padding: 14, marginBottom: 22, boxShadow: shadowCard,
        }}>
          <div style={{ position: 'relative' }}>
            <Search size={17} color="#A39C8A" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by booking code, method, or amount…"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%', padding: '11px 14px 11px 42px', background: ivory,
                border: `1px solid ${line}`, borderRadius: 10, fontSize: 13.5,
                color: ink, outline: 'none', boxSizing: 'border-box', fontFamily: bodyFont,
              }}
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '70px 0' }}>
            <div style={{
              width: 40, height: 40, border: `3px solid ${line}`, borderTopColor: gold,
              borderRadius: '50%', animation: 'cc-spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes cc-spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ marginTop: 16, color: '#A39C8A', fontSize: 13 }}>Loading payments…</p>
          </div>
        )}

        {/* Table */}
        {!loading && filteredRecords.length > 0 && (
          <div style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
            overflow: 'hidden', boxShadow: shadowCard,
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                <thead>
                  <tr style={{ background: ivory, borderBottom: `1px solid ${line}` }}>
                    {['Booking', 'Amount', 'Method', 'Payment Date', 'Notes', ''].map((h, i) => (
                      <th key={i} style={{
                        textAlign: i === 5 ? 'right' : 'left', padding: '14px 18px',
                        fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: '#8A8270', fontWeight: 700,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((p, idx) => (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: idx === filteredRecords.length - 1 ? 'none' : `1px solid ${lineSoft}`,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#FCFAF4'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          fontSize: 11.5, fontFamily: 'monospace', color: '#8A8270',
                          background: ivory, border: `1px solid ${lineSoft}`, borderRadius: 6, padding: '3px 8px',
                          fontWeight: 600,
                        }}>{p.booking?.booking_code || '—'}</span>
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 13.5, color: goldDeep, fontWeight: 600 }}>
                        SAR {Number(p.amount || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <MethodPill method={p.payment_method} />
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 13.5, color: ink }}>
                        {p.payment_date || '—'}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 12.5, color: '#A39C8A', maxWidth: 200 }}>
                        {p.notes || '—'}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          {permissions.update_payment && (
                            <button
                              onClick={() => openEdit(p)}
                              title="Update"
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: 34, height: 34, borderRadius: 9,
                                background: 'rgba(198,164,63,0.10)', border: `1px solid ${line}`,
                                color: goldDeep, cursor: 'pointer',
                              }}
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                          {permissions.delete_payment && (
                            <button
                              onClick={() => deletePayment(p)}
                              title="Delete"
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: 34, height: 34, borderRadius: 9,
                                background: 'rgba(178,59,59,0.08)', border: '1px solid rgba(178,59,59,0.22)',
                                color: '#B23B3B', cursor: 'pointer',
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 20px', borderTop: `1px solid ${lineSoft}`, background: ivory,
              }}>
                <span style={{ fontSize: 12, color: '#A39C8A' }}>
                  Page {currentPage} of {totalPages} · {count} payment{count !== 1 ? 's' : ''}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                      width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${line}`, background: '#FFFFFF',
                      color: currentPage === 1 ? '#D8D2C0' : ink,
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${line}`, background: '#FFFFFF',
                      color: currentPage === totalPages ? '#D8D2C0' : ink,
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredRecords.length === 0 && (
          <div style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
            padding: '70px 20px', textAlign: 'center', boxShadow: shadowCard,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: ivory,
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
            }}>
              <DollarSign size={28} color={gold} />
            </div>
            <h3 style={{ fontFamily: displayFont, fontSize: 21, color: ink, marginBottom: 6 }}>No payments found</h3>
            <p style={{ color: '#A39C8A', fontSize: 13.5, marginBottom: 22 }}>
              {searchTerm ? 'Try a different search term' : 'Record your first payment to get started'}
            </p>
            {permissions.create_payment && !searchTerm && (
              <button
                onClick={openCreate}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: ink, color: '#FBF6E8', border: 'none',
                  padding: '12px 22px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                <Plus size={16} color={gold} />
                Record Payment
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      {modalOpen && (
        <Modal
          title={editingPayment ? 'Update Payment' : 'Record Payment'}
          subtitle={editingPayment ? `Editing payment for booking ${editingPayment.booking?.booking_code}` : 'Add a new payment record'}
          onClose={closeModal}
        >
          <form onSubmit={savePayment}>
            <FormGroup label="Booking" required>
              <select
                style={inputStyle}
                value={form.booking}
                onChange={(e) => setForm({ ...form, booking: e.target.value })}
              >
                <option value="">Select Booking</option>
                {bookings.map((b) => (
                  <option key={b.id} value={b.id}>{b.booking_code} - {b.event_type_en}</option>
                ))}
              </select>
            </FormGroup>

            <FormGroup label="Amount (SAR)" required>
              <TextField
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
              />
            </FormGroup>

            <FormGroup label="Payment Method" required>
              <select
                style={inputStyle}
                value={form.payment_method}
                onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="check">Check</option>
              </select>
            </FormGroup>

            <FormGroup label="Payment Date" required>
              <TextField
                type="date"
                value={form.payment_date}
                onChange={(e) => setForm({ ...form, payment_date: e.target.value })}
              />
            </FormGroup>

            <FormGroup label="Notes">
              <textarea
                style={{
                  ...inputStyle,
                  minHeight: 80,
                  resize: 'vertical',
                }}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Additional notes..."
              />
            </FormGroup>

            <button
              type="submit"
              disabled={saving}
              style={{
                width: '100%', background: ink, color: '#FBF6E8', border: 'none',
                borderRadius: 12, padding: '14px', fontSize: 13.5, fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer', marginTop: 6, opacity: saving ? 0.6 : 1,
                letterSpacing: '0.02em',
              }}
            >
              {saving ? 'Saving…' : editingPayment ? 'Save Changes' : 'Record Payment'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default PaymentsCom;
