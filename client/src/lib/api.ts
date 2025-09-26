export async function authFetch(endpoint: string, options: RequestInit = {}) {
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  };

  try {
    const response = await fetch(`http://localhost:8000${endpoint}`, fetchOptions)

    if (!response.ok) {
        throw new Error(`Http error. status: ${response.status}`);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null;
    }

    return await response.json()
  }
  catch(err) {
    throw err
  }
}


