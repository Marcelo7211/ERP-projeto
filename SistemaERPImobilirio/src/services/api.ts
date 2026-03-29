const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://localhost:5288/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ClientApiModel {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  interest: { propertyType: string; maxPrice: number } | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface PropertyApiModel {
  id: string;
  title: string;
  type: string;
  address: string;
  price: number;
  rentPrice: number;
  status: string;
  image: string;
  description?: string | null;
  features: {
    bedrooms: number;
    bathrooms: number;
    parking: number;
    area: number;
  };
  createdAt: string;
  updatedAt?: string | null;
}

export interface ContractApiModel {
  id: string;
  type: string;
  propertyId: string;
  propertyTitle: string;
  clientId: string;
  clientName: string;
  value: number;
  status: string;
  startDate: string;
  endDate: string;
  signedAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface PipelineDealApiModel {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  propertyId: string;
  propertyTitle: string;
  value: number;
  stage: string;
  lastInteractionAt: string;
  createdAt: string;
  updatedAt?: string | null;
}

export interface DashboardSummaryApiModel {
  totalProperties: number;
  totalClients: number;
  totalContracts: number;
  totalPipelineValue: number;
  activeDeals: number;
  activeContracts: number;
}

export interface CompanySettingApiModel {
  id: string;
  companyName: string;
  primaryColor: string;
  logoUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro na API (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return await response.json() as T;
}

export async function getClients(params: Record<string, string | number | undefined> = {}): Promise<PagedResult<ClientApiModel>> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  });
  const suffix = query.size > 0 ? `?${query.toString()}` : '';
  return request<PagedResult<ClientApiModel>>(`/clients${suffix}`);
}

export async function createClient(payload: {
  name: string;
  email: string;
  phone: string;
  type: string;
  interestPropertyType?: string;
  interestMaxPrice?: number;
}): Promise<ClientApiModel> {
  return request<ClientApiModel>('/clients', { method: 'POST', body: payload });
}

export async function updateClient(id: string, payload: {
  name: string;
  email: string;
  phone: string;
  type: string;
  interestPropertyType?: string;
  interestMaxPrice?: number;
}): Promise<ClientApiModel> {
  return request<ClientApiModel>(`/clients/${id}`, { method: 'PUT', body: payload });
}

export async function getProperties(params: Record<string, string | number | undefined> = {}): Promise<PagedResult<PropertyApiModel>> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  });
  const suffix = query.size > 0 ? `?${query.toString()}` : '';
  return request<PagedResult<PropertyApiModel>>(`/properties${suffix}`);
}

export async function createProperty(payload: {
  title: string;
  type: string;
  address: string;
  price: number;
  rentPrice: number;
  status: string;
  image: string;
  description?: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  area: number;
}): Promise<PropertyApiModel> {
  return request<PropertyApiModel>('/properties', { method: 'POST', body: payload });
}

export async function updateProperty(id: string, payload: {
  title: string;
  type: string;
  address: string;
  price: number;
  rentPrice: number;
  status: string;
  image: string;
  description?: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  area: number;
}): Promise<PropertyApiModel> {
  return request<PropertyApiModel>(`/properties/${id}`, { method: 'PUT', body: payload });
}

export async function getContracts(params: Record<string, string | number | undefined> = {}): Promise<PagedResult<ContractApiModel>> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  });
  const suffix = query.size > 0 ? `?${query.toString()}` : '';
  return request<PagedResult<ContractApiModel>>(`/contracts${suffix}`);
}

export async function createContract(payload: {
  type: string;
  propertyId: string;
  clientId: string;
  value: number;
  status: string;
  startDate: string;
  endDate: string;
  signedAt?: string | null;
}): Promise<ContractApiModel> {
  return request<ContractApiModel>('/contracts', { method: 'POST', body: payload });
}

export async function updateContract(id: string, payload: {
  type: string;
  propertyId: string;
  clientId: string;
  value: number;
  status: string;
  startDate: string;
  endDate: string;
  signedAt?: string | null;
}): Promise<ContractApiModel> {
  return request<ContractApiModel>(`/contracts/${id}`, { method: 'PUT', body: payload });
}

export async function getPipelineDeals(params: Record<string, string | number | undefined> = {}): Promise<PagedResult<PipelineDealApiModel>> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  });
  const suffix = query.size > 0 ? `?${query.toString()}` : '';
  return request<PagedResult<PipelineDealApiModel>>(`/pipeline${suffix}`);
}

export async function createPipelineDeal(payload: {
  title: string;
  clientId: string;
  propertyId: string;
  value: number;
  stage: string;
  lastInteractionAt: string;
}): Promise<PipelineDealApiModel> {
  return request<PipelineDealApiModel>('/pipeline', { method: 'POST', body: payload });
}

export async function updatePipelineDeal(id: string, payload: {
  title: string;
  clientId: string;
  propertyId: string;
  value: number;
  stage: string;
  lastInteractionAt: string;
}): Promise<PipelineDealApiModel> {
  return request<PipelineDealApiModel>(`/pipeline/${id}`, { method: 'PUT', body: payload });
}

export async function getDashboardSummary(): Promise<DashboardSummaryApiModel> {
  return request<DashboardSummaryApiModel>('/dashboard/summary');
}

export async function getCurrentSetting(): Promise<CompanySettingApiModel> {
  return request<CompanySettingApiModel>('/settings/current');
}

export async function updateSetting(id: string, payload: {
  companyName: string;
  primaryColor: string;
  logoUrl: string;
  isActive: boolean;
}): Promise<CompanySettingApiModel> {
  return request<CompanySettingApiModel>(`/settings/${id}`, { method: 'PUT', body: payload });
}
