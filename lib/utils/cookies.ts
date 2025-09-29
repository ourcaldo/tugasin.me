'use client';

/**
 * Cookie utility functions for managing browser cookies
 */

export interface CookieOptions {
  expires?: Date | number; // Date object or days from now
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Set a cookie with the given name, value, and options
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  if (typeof window === 'undefined') return; // SSR protection
  
  const { expires, path = '/', domain, secure, sameSite = 'lax' } = options;
  
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  // Handle expires
  if (expires) {
    if (typeof expires === 'number') {
      // Convert days to actual date
      const date = new Date();
      date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
      cookieString += `; expires=${date.toUTCString()}`;
    } else {
      cookieString += `; expires=${expires.toUTCString()}`;
    }
  }
  
  cookieString += `; path=${path}`;
  
  if (domain) {
    cookieString += `; domain=${domain}`;
  }
  
  if (secure) {
    cookieString += '; secure';
  }
  
  cookieString += `; samesite=${sameSite}`;
  
  document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null; // SSR protection
  
  const cookieName = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(cookieName) === 0) {
      return decodeURIComponent(cookie.substring(cookieName.length));
    }
  }
  
  return null;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string, path: string = '/') {
  if (typeof window === 'undefined') return; // SSR protection
  
  setCookie(name, '', { expires: new Date(0), path });
}

/**
 * Check if a cookie exists
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}

/**
 * PWA Install Prompt specific cookie functions
 */
const PWA_DISMISS_COOKIE = 'pwa-install-dismissed';

/**
 * Set cookie to remember PWA install prompt dismissal for 24 hours
 */
export function setPWAInstallDismissed() {
  const expiryDate = new Date();
  expiryDate.setTime(expiryDate.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
  
  setCookie(PWA_DISMISS_COOKIE, new Date().toISOString(), {
    expires: expiryDate,
    path: '/',
    sameSite: 'lax'
  });
}

/**
 * Check if PWA install prompt was dismissed within the last 24 hours
 */
export function isPWAInstallDismissed(): boolean {
  return hasCookie(PWA_DISMISS_COOKIE);
}

/**
 * Clear PWA install dismissal cookie (for testing purposes)
 */
export function clearPWAInstallDismissed() {
  deleteCookie(PWA_DISMISS_COOKIE);
}