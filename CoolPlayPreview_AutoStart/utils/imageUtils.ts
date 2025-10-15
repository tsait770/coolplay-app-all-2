import { ImageSourcePropType } from 'react-native';

export function validateImageSource(source: any): ImageSourcePropType | null {
  if (!source) {
    console.warn('[ImageUtils] Empty image source provided');
    return null;
  }

  if (typeof source === 'object' && 'uri' in source) {
    if (!source.uri || source.uri.trim() === '') {
      console.warn('[ImageUtils] Empty URI in image source');
      return null;
    }
  }

  return source;
}

export function getValidImageSource(source: any, fallback?: ImageSourcePropType): ImageSourcePropType | null {
  const validSource = validateImageSource(source);
  
  if (!validSource && fallback) {
    return fallback;
  }
  
  return validSource;
}
