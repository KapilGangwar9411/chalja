import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO component for managing page metadata
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.keywords - Comma-separated keywords
 * @param {string} props.image - Social media image URL
 * @param {string} props.url - Canonical URL
 * @param {Object} props.schemaData - JSON-LD schema data
 */
const SEOHead = ({ 
  title = "Spectrum Club | Unleash Your Creativity", 
  description = "Spectrum is a premier student club focused on creative arts, filmmaking, photography, and design.", 
  keywords = "spectrum club, creative arts, student filmmaking",
  image = "/images/spectrum-og-image.jpg",
  url = "https://spectrum-club.com",
  schemaData = null
}) => {
  // Base URL for constructing absolute URLs
  const baseUrl = "https://spectrum-club.com";
  const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
  const canonicalUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* Structured Data */}
      {schemaData && (
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead; 