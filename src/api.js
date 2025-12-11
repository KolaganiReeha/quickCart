const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, opts = {}, explicitToken = null) {
  const url = `${API_BASE}${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
  };
  const tokenToUse = explicitToken ?? localStorage.getItem("token");
  if (tokenToUse) headers.Authorization = `Bearer ${tokenToUse}`;

  if (!headers.Authorization) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...opts, headers });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }

  if (!res.ok) {
    const errMsg =
      (data && (data.detail || data.message || data.error)) || res.statusText;
    const err = new Error(errMsg);
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data;
}


export async function login(email, password) {
  return await request("/auth/token", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" },
  });
}

export async function register(email, password) {
  return await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" },
  });
}

export async function verifyOtp(email, otp) {
  return await request("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
    headers: { "Content-Type": "application/json" },
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

