import * as config_site from '@/configs/site';
import * as lib_api_url from '@/lib/api_url';

/**
 * Structured data (schema.org JSON-LD) for the home page.
 * Describes the project as a software application plus its publisher and website.
 */
export function JsonLd() {
  const url = lib_api_url.get_frontend_url();
  const publisher = {
    '@type': 'Organization',
    '@id': `${url}/#organization`,
    name: config_site.info.git.sandbox.user,
    url: config_site.info.social.github.href,
    sameAs: [config_site.info.social.github.href, config_site.info.social.youtube.href, config_site.info.social.discord.href]
  };
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      publisher,
      {
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        name: config_site.info.name,
        url,
        description: config_site.info.seo.description,
        publisher: { '@id': publisher['@id'] },
        inLanguage: 'en'
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${url}/#software`,
        name: config_site.info.name,
        url,
        description: config_site.info.seo.description,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: config_site.info.seo.platforms.join(', '),
        programmingLanguage: ['Lua', 'C++'],
        license: 'https://www.gnu.org/licenses/gpl-3.0.html',
        isAccessibleForFree: true,
        codeRepository: `https://github.com/${config_site.info.git.sandbox.user}/${config_site.info.git.sandbox.repo}`,
        author: { '@id': publisher['@id'] },
        publisher: { '@id': publisher['@id'] },
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
