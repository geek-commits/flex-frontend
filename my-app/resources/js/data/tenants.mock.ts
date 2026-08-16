import type { TenantRecord } from '@/features/tenants/shared/types';

/**
 * Synthetic tenants mock dataset for the POC platform directory.
 *
 * POC MOCK — replace with the real tenants backend behind `TenantRepository`.
 * Contains development-only synthetic data; never real credentials.
 */

export const TENANTS_MOCK_RECORDS: TenantRecord[] = [
    { id: 't1', name: 'FLEX HQ', email: 'admin@flexhq.com', domain: 'flexhq.com', contact: 'Grace Mwanga', phone: '+254 700 100 001', status: 'active', createdAt: '2024-02-11T08:00:00Z' },
    { id: 't2', name: 'Nairobi Central', email: 'ops@nairobidc.co.ke', domain: 'nairobidc.co.ke', contact: 'James Otieno', phone: '+254 700 100 002', status: 'active', createdAt: '2024-03-02T08:00:00Z' },
    { id: 't3', name: 'Acme Contact Center', email: 'admin@acmecc.com', domain: 'acmecc.com', contact: 'Fatuma Ally', phone: '+255 700 100 003', status: 'active', createdAt: '2024-05-19T08:00:00Z' },
    { id: 't4', name: 'Safari Support', email: 'support@safarisupport.co.tz', domain: 'safarisupport.co.tz', contact: 'David Kiprotich', phone: '+255 700 100 004', status: 'disabled', createdAt: '2024-06-04T08:00:00Z' },
    { id: 't5', name: 'RetailOne', email: 'admin@retailone.com', domain: 'retailone.com', contact: 'Sarah Smith', phone: '+1 415 555 0101', status: 'active', createdAt: '2024-08-22T08:00:00Z' },
    { id: 't6', name: 'FinServe Africa', email: 'ops@finserve.africa', domain: 'finserve.africa', contact: 'John Doe', phone: '+234 700 100 006', status: 'active', createdAt: '2024-09-01T08:00:00Z' },
    { id: 't7', name: 'MediCare Lines', email: 'admin@medicarel.ng', domain: 'medicarel.ng', contact: 'Amina Hassan', phone: '+234 700 100 007', status: 'active', createdAt: '2024-10-15T08:00:00Z' },
    { id: 't8', name: 'LogiTrack', email: 'support@logitrack.co.za', domain: 'logitrack.co.za', contact: 'Peter Ndungu', phone: '+27 700 100 008', status: 'disabled', createdAt: '2025-01-08T08:00:00Z' },
    { id: 't9', name: 'EduConnect', email: 'admin@educonnect.ke', domain: 'educonnect.ke', contact: 'Michael Brown', phone: '+254 700 100 009', status: 'active', createdAt: '2025-02-27T08:00:00Z' },
    { id: 't10', name: 'AgroBank', email: 'ops@agrobank.ug', domain: 'agrobank.ug', contact: 'Linda Wanjiru', phone: '+256 700 100 010', status: 'active', createdAt: '2025-04-10T08:00:00Z' },
    { id: 't11', name: 'SkyLink Airways', email: 'admin@skylink.aero', domain: 'skylink.aero', contact: 'Brian Otundo', phone: '+256 700 100 011', status: 'active', createdAt: '2025-06-19T08:00:00Z' },
    { id: 't12', name: 'GreenGrid Energy', email: 'support@greengrid.rw', domain: 'greengrid.rw', contact: 'Mary Chebet', phone: '+250 700 100 012', status: 'active', createdAt: '2025-07-03T08:00:00Z' },
];
