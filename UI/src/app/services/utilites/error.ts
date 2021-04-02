export function parseHttpError(error) {
  if (typeof error === 'string') {
    return error;
  } else if (error.statusText) {
    return error.statusText;
  } else if (error.message) {
    return error.message;
  } else if (error.error) {
    return parseHttpError(error.error);
  } else {
    return null;
  }
}
