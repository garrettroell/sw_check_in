function getBackendUrl() {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_LOCAL_ENDPOINT;
  } else {
    return import.meta.env.VITE_PROD_ENDPOINT;
  }
}
export default getBackendUrl;
