export const fetchFlightData = async (backendUrl, values) => {
  const response = await fetch(`${backendUrl}/set-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    return {
      flights: [],
      error: `Server responded with status ${response.status}`,
    };
  }

  try {
    const text = await response.text();
    const { flights, error } = JSON.parse(text);

    return {
      flights,
      error,
    };
  } catch {
    return {
      flights: [],
      error: `Server responded with status ${response.status}`,
    };
  }
};
