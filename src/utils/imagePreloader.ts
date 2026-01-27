/**
 * Preloads an array of image URLs.
 *
 * @param imageUrls - Array of image URLs to preload
 * @returns Promise that resolves when all images are loaded or rejects if any fail
 */
export function preloadImages(imageUrls: string[]): Promise<void[]> {
  const promises = imageUrls.map((url) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => {
        console.warn(`Failed to preload image: ${url}`);
        // Resolve instead of reject to allow partial loading
        resolve();
      };
      img.src = url;
    });
  });

  return Promise.all(promises);
}

/**
 * Extracts image URLs from StackIcon components in the skills data.
 * Note: This function handles CustomIcon components that use src attribute.
 *
 * @param skillsData - Array of skill categories
 * @returns Array of unique image URLs to preload
 */
export function extractImageUrls(skillsData: any[]): string[] {
  const urls = new Set<string>();

  skillsData.forEach((category) => {
    category.skills.forEach((skill: any) => {
      // Check if the icon has a props.src (CustomIcon pattern)
      if (skill.icon?.props?.src) {
        urls.add(skill.icon.props.src);
      }
    });
  });

  return Array.from(urls);
}
