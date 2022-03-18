function getBackendUrl() {
  if (import.meta.env.DEV) {
    return "http://localhost:1984";
  } else {
    return "https://sw-server.garrettroell.com";
  }
}
export default getBackendUrl;
