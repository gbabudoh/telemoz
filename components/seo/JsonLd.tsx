import React from "react";

export function JsonLd() {
  const baseUrl = process.env.NEXTAUTH_URL || "https://telemoz.com";

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": "Telemoz",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/logos/logo.png`,
      "width": "120",
      "height": "40"
    },
    "description": "The All-in-One Professional Hub for Digital Marketing Success and Client-Agency Collaboration.",
    "sameAs": [
      "https://twitter.com/telemoz",
      "https://linkedin.com/company/telemoz"
    ]
  };

  // WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "name": "Telemoz",
    "url": baseUrl,
    "description": "Hire vetted marketing agencies and independent freelancers.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/marketplace?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  // ProfessionalService (Local Business & Geo Search) Schema
  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${baseUrl}/#local-service`,
    "name": "Telemoz Marketplace",
    "image": `${baseUrl}/logos/logo.png`,
    "description": "Top-tier vetted Digital Marketing Professionals in London, UK and globally.",
    "url": `${baseUrl}/marketplace`,
    "telephone": "+442079460958",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "71-75 Shelton Street, Covent Garden",
      "addressLocality": "London",
      "postalCode": "WC2H 9JQ",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.514757,
      "longitude": -0.124239
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "United Kingdom"
      },
      {
        "@type": "AdministrativeArea",
        "name": "London"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Global"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
    </>
  );
}
