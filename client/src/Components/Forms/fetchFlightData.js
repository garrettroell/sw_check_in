export const fetchFlightData = async (backendUrl, values) => {
  const response = await fetch(`${backendUrl}/set-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  console.log("Response from server:", response);

  if (!response.ok) {
    throw new Error(`Server responded with status ${response.status}`);
  }

  const text = await response.text();
  console.log("Response text:", text);

  if (text.includes("error")) {
    const error = JSON.parse(text).error;
    console.log("Error from server:", error);
    throw new Error(error);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Server returned invalid JSON.");
  }
};
