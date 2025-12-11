const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:8000").replace(/\/+$/, "");

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

async function request(path, opts = {}, explicitToken = null) {
  const url = `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers = {
    ...(opts.headers || {}),
  };

  if (opts.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const tokenToUse = explicitToken ?? getToken();
  if (tokenToUse) headers["Authorization"] = `Bearer ${tokenToUse}`;

  const res = await fetch(url, { ...opts, headers });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }

  if (!res.ok) {
    const errMsg = (data && (data.detail || data.message || data.error)) || res.statusText;
    const err = new Error(errMsg);
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data;
}

export async function login(email, password) {
  const data = await request("/auth/token", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (data?.access_token) setToken(data.access_token);
  return data;
}

export function logout() {
  setToken(null);
}

export async function register(email, password) {
  return await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function verifyOtp(email, otp) {
  return await request("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

export async function getProducts() {
  return await request("/products", { method: "GET" });
}

export async function getProduct(id) {
  return await request(`/products/${id}`, { method: "GET" });
}

export async function createProduct(product) {
  return await request("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export async function updateProduct(id, product) {
  return await request(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id) {
  return await request(`/products/${id}`, {
    method: "DELETE",
  });
}
