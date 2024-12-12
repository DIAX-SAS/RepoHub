export function getSiteURL(subdomain = ''): string {
  let finalUrl =
  "diax.website";
  // Make sure to include `https://` when not localhost.
  finalUrl = finalUrl.includes('http') ? finalUrl : `https://${finalUrl}`;
  // Make sure to include a trailing `/`.
  finalUrl = finalUrl.endsWith('/') ? finalUrl : `${finalUrl}/`;

  
   if (subdomain) {
    const url = new URL(finalUrl);
    url.hostname = `${subdomain}.${url.hostname}`;
    return url.toString();
  }
  return finalUrl;
}
