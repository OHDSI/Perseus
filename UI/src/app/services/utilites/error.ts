export function parseHtmlError(error) {
  if (typeof error === 'string') {
    return error;
  } else if (error.message) {
    return error.message;
  } else if (error.error) {
    return parseHtmlError(error.error);
  } else {
    return 'Error';
  }
}
