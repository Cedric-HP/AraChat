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
    const response = await fetch(`http:localhost:8000${endpoint}`, fetchOptions)

    if (!response.ok) {
      let errorDetail = `Erreur HTTP: ${response.status}`;
      
      // On vérifie si la réponse d'erreur est bien du JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorDetail = errorData.detail || JSON.stringify(errorData);
      } else {
        // Si ce n'est pas du JSON, on lit la réponse comme du texte brut
        errorDetail = await response.text();
      }
      
      throw new Error(errorDetail);
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


