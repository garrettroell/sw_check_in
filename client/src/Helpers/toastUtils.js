export const showToast = (toast, toastIdRef, props) => {
  toastIdRef.current = toast(props);
};

export const closeToast = (toast, toastIdRef) => {
  if (toastIdRef.current) {
    toast.close(toastIdRef.current);
  }
};
