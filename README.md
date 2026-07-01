The Heritage Village — Hotel & Event & Venue Management System

القرية الشعبية — ١٩٩٨
Luxury Heritage Hotel & Event Management Platform

A modern full-stack Hotel & Event Management System built for managing halls, venues, customers, bookings, employees, payments, pricing, services, reports, and secure role-based staff operations.

The system is designed with a premium gold-on-black luxury theme, bilingual English/Arabic support, RTL-aware layouts, and enterprise-grade authentication.

Built using:

Backend: Django + Django REST Framework
Frontend: Next.js 14 (App Router)
Database: PostgreSQL
Authentication: JWT Access + Refresh Tokens
Architecture: Modular, scalable, role-based enterprise design
Features
Authentication & Security

A complete enterprise authentication system featuring:

User Signup & Invitation Flow
Secure Login
JWT Authentication
Access + Refresh Tokens
Forgot Password
OTP Verification
Password Reset
Password Change
Account Activation via Email
Login Attempt Tracking
User Blocking System
Secure Logout
Role-Based Access Control (RBAC)
Permission-Based Authorization
Tech Stack
Layer	Technology
Backend	Django
API	Django REST Framework
Frontend	Next.js 14
Database	PostgreSQL
Authentication	JWT
State Management	React Context API
Styling	Tailwind CSS + Custom Luxury Theme
File Uploads	Django Media Storage
Architecture	RESTful APIs
Design Language
Theme

Luxury heritage-inspired UI with premium hospitality aesthetics.

Color Palette
Color	Usage
#000000	Sidebar / Primary Background
#C6A43F	Gold Accent
#F6F3EC	Ivory Background
#FBF9F4	Light Cream
#26231D	Dark Typography
#CCCCCC	Secondary Text
Typography
Cormorant Garamond → Headings & Luxury Display
DM Sans → UI Labels & Body Text
Layout
Fixed dark sidebar
Gold accent navigation
Rounded luxury cards
Soft shadows
RTL support
Responsive admin dashboard
Enterprise-style data management screens
Core Modules
Dashboard
Revenue statistics
Hall occupancy analytics
Upcoming bookings
Popular halls
Activity logs
Customer insights
Financial overview
Halls & Venues

Manage hotel halls and venues:

Hall creation
Capacity management
Occupancy tracking
Hall images
Venue status
Booking analytics
Hall amenities
Dynamic pricing
Event Bookings

Complete event booking management:

Hall booking
Customer assignment
Booking code generation
Time slot management
Event scheduling
Booking status tracking
Revenue tracking

Supported shifts:

Morning Shift
Afternoon Shift
Night Shift
Payments

Payment management system:

Partial payments
Full payments
Payment history
Payment methods
Financial tracking
Booking-linked payments

Supported payment methods:

Cash
Card
Bank Transfer
Check
Hall Pricing

Dynamic hall pricing management:

Time-slot pricing
Seasonal pricing
Date-range pricing
Hall-specific rates
Booking Services

Additional booking add-ons:

Catering
Decoration
Photography
Sound System
Event Services
Hall Amenities

Manage amenities per hall:

WiFi
Parking
Air Conditioning
Projector
Sound System
Seating
Stage Setup
Customers

Customer relationship management:

Guest records
Booking history
Lifetime spending
Contact management
Customer analytics
Employees

Employee management system:

Employee onboarding
Invitation workflow
Role assignment
Employee activation/deactivation
Staff management
Roles & Permissions

Enterprise RBAC system:

Dynamic roles
Module-based permissions
Permission grouping
Secure authorization
Admin-controlled access
Reports & Analytics

Analytics and reporting system:

Revenue reports
Customer reports
Booking analytics
Export-ready data
Date-range filtering
Sidebar Navigation
MAIN
📊 Dashboard
🏛️ Halls & Venues
📅 Event Bookings
FINANCIAL
💳 Payments
💰 Hall Pricing
SERVICES
🎁 Booking Services
✨ Hall Amenities
MANAGEMENT
👥 Customers
👤 System Users
👤 Employees
🛡️ Roles
📋 Activity Log
📈 Reports & Analytics
Database Models
User App
User Model

Custom authentication user model using AbstractBaseUser.

Features
Username-based authentication
Email integration
Mobile number support
Profile image upload
OTP password reset
Account verification
Login attempt tracking
User blocking
Role assignment
Employee/Customer user types
Employee Model

Employee profile linked with User model.

Status Flow
INVITED → ACTIVE → DEACTIVATED
Role Model

Permission bundle system.

Example roles:

Super Admin
Event Manager
Accountant
Receptionist
Staff Member
Permission Model

Granular module-level permissions.

Examples:

CREATE_BOOKING
UPDATE_HALL
DELETE_CUSTOMER
VIEW_REPORTS
MANAGE_EMPLOYEES
Hotel App
Customer

Customer contact and booking profile.

Features
Booking count
Total spending
Contact management
Analytics support
Hall

Venue management model.

Features
Capacity tracking
Occupancy tracking
Hall images
Booking analytics
Upcoming events
Booking

Core event booking model.

Features
Auto-generated booking codes
Hall allocation
Customer assignment
Event scheduling
Time slots
Booking statuses
Revenue tracking

Example booking code:

B1001
B1002
B1003
ActivityLog

Tracks system activity across modules.

Tracks
Create actions
Updates
Deletions
Booking activities
Staff activities
Payment

Tracks booking payments.

Features
Multiple payment methods
Partial payments
Booking-linked transactions
Payment notes
HallPricing

Dynamic pricing system for halls.

BookingService

Additional services attached to bookings.

HallAmenity

Amenities available in halls.

Security Features
JWT Authentication
Access & Refresh Tokens
OTP Verification
Password Reset Tokens
Secure Password Hashing
Role-Based Authorization
Permission-Based Access
Login Attempt Monitoring
User Blocking
Protected APIs
API Features
RESTful APIs
Pagination
Filtering
Search
CSV Export
Consistent API responses
Secure endpoints
Role-protected routes

Example API response:

{
  "message": "Success",
  "count": 10,
  "data": []
}
Frontend Features
Next.js 14 App Router
Server Components
Client Components
Route Protection
Dynamic Routing
Context Authentication
UI Features
Luxury hotel theme
Responsive design
Sidebar navigation
Gold hover effects
RTL Arabic support
Dashboard analytics
Reusable components
Authentication Flow
Employee Invitation Flow
Admin Creates Employee
        ↓
Invitation Email Sent
        ↓
Employee Activates Account
        ↓
Password Setup
        ↓
Login Access Granted
Forgot Password Flow
User Requests Reset
        ↓
OTP Code Sent
        ↓
OTP Verification
        ↓
New Password Creation
        ↓
Secure Login
Project Structure
backend/
│
├── user/
├── hotel/
├── utils/
├── config/
│
frontend/
│
├── app/
├── components/
├── context/
├── services/
├── hooks/
Future Enhancements
Online payments
WhatsApp notifications
SMS OTP integration
Mobile application
Hall availability calendar
Invoice generation
PDF exports
Multi-branch hotel support
AI-powered analytics
Customer portal
System Type

This project is designed as:

Enterprise Hotel Management System
Event & Venue Management Platform
Luxury Hospitality ERP
Role-Based Staff Management System
Developed Using
Django
Django REST Framework
Next.js 14
PostgreSQL
React
Tailwind CSS
JWT Authentication