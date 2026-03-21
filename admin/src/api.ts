const BASE_URL = process.env.REACT_APP_API_URL || '';

function getToken(): string | null {
  return localStorage.getItem('admin_token');
}

function getHeaders(isFormData = false): HeadersInit {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      errMsg = data.error || data.message || errMsg;
    } catch {
      // ignore
    }
    throw new Error(errMsg);
  }
  return res.json();
}

export async function apiGet(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse(res);
}

export async function apiPost(path: string, data?: unknown) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: getHeaders(),
    body: data !== undefined ? JSON.stringify(data) : undefined
  });
  return handleResponse(res);
}

export async function apiPut(path: string, data?: unknown) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: data !== undefined ? JSON.stringify(data) : undefined
  });
  return handleResponse(res);
}

export async function apiDelete(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return handleResponse(res);
}

export async function apiUpload(path: string, formData: FormData) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: getHeaders(true),
    body: formData
  });
  return handleResponse(res);
}
