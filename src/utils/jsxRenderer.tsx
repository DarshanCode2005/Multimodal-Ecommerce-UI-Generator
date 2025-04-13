'use client';

import React from 'react';

/**
 * A utility function that attempts to safely render JSX strings in a React app.
 * 
 * @param jsxString The JSX code as a string
 * @param fallback The fallback content to render if parsing fails
 * @returns A React element
 */
export function renderJSXString(jsxString: string, fallback: React.ReactNode): React.ReactNode {
  try {
    if (!jsxString || jsxString.trim() === '') {
      console.log('JSX string is empty, using fallback');
      return fallback;
    }
    
    // Convert any React-style props to DOM-compatible attributes
    const domFriendlyJsx = convertReactPropsToDOM(jsxString);
    
    console.log('Rendering JSX string:', domFriendlyJsx);
    
    // Use dangerouslySetInnerHTML with sanitized JSX string
    return (
      <div 
        className="jsx-renderer w-full h-full"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(domFriendlyJsx) }}
      />
    );
  } catch (error) {
    console.error('Failed to render JSX:', error);
    return fallback;
  }
}

/**
 * Convert React-style props to DOM-compatible attributes
 */
function convertReactPropsToDOM(jsxString: string): string {
  try {
    // Replace className with class
    let result = jsxString.replace(/className=/g, 'class=');
    
    // Replace style objects with inline style strings
    // This is a simplified version and might not handle all cases
    const styleRegex = /style=\{\{(.*?)\}\}/g;
    result = result.replace(styleRegex, (match, styleContent) => {
      try {
        // Convert the style object content to a style string
        const styleString = styleContent
          .split(',')
          .map((style: string) => {
            try {
              const [property, value] = style.split(':').map(s => s.trim());
              // Convert camelCase to kebab-case
              const kebabProperty = property.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
              // Remove quotes around the value
              const cleanValue = value.replace(/['"]/g, '');
              return `${kebabProperty}: ${cleanValue}`;
            } catch (e) {
              console.error('Error parsing style item:', style, e);
              return '';
            }
          })
          .filter(Boolean)
          .join('; ');
        
        return `style="${styleString}"`;
      } catch (e) {
        console.error('Error parsing style object:', styleContent, e);
        return '';
      }
    });
    
    // Handle JSX-style event handlers
    const eventHandlerRegex = /on(\w+)=\{(.*?)\}/g;
    result = result.replace(eventHandlerRegex, (match, event, handler) => {
      const lowerCaseEvent = `on${event.toLowerCase()}`;
      return `${lowerCaseEvent}="${handler}"`;
    });
    
    // Replace any remaining JSX expressions with empty strings or placeholders
    result = result.replace(/\{\/\*(.*?)\*\/\}/g, ''); // Remove comments in JSX
    result = result.replace(/\{(.*?)\}/g, ''); // Remove any remaining JSX expressions
    
    // Log the conversion result for debugging
    console.log('Converted JSX to HTML:', result);
    
    return result;
  } catch (error) {
    console.error('Error converting React props to DOM:', error);
    return jsxString; // Return original on error
  }
}

/**
 * Basic sanitization of HTML to prevent XSS
 * This is a simplified version - in production use a proper sanitizer library
 */
function sanitizeHtml(html: string): string {
  try {
    // Remove any script tags and event handlers that might be malicious
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=['"](.*?)['"]/g, ''); // Remove all event handlers for safety
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    return '';
  }
} 