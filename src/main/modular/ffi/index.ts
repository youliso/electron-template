export async function FFiInit() {
  switch (process.platform) {
    case 'win32':
      return await import('./win32');
  }
  return null;
}
