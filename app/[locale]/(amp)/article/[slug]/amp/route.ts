//TODO:
// 1. translate
// 2. change font
// 3. add amp ads

import { notFound } from "next/navigation"
import type { NextRequest } from "next/server"

import env from "@/env"
import { api } from "@/lib/trpc/server"
import {
  convertArticleContentToAMP,
  sanitizeMetaDataAMP,
} from "@/lib/utils/amp"
import type { LanguageType } from "@/lib/validation/language"
import { generateAMPJsonLdSchema } from "./json-ld"
import { basecolor, htmlStyle } from "./style"

export async function GET(
  _req: NextRequest,
  params: { params: Promise<{ slug: string; locale: LanguageType }> },
) {
  const { slug, locale } = await params.params

  const article = await api.article.bySlug(slug)

  if (!article) {
    return notFound()
  }

  const htmlcontent = await convertArticleContentToAMP(article)
  //@ts-expect-error FIX: handle drizzle send null data
  const { newsArticle, breadcrumbList } = generateAMPJsonLdSchema(article!)

  const ampScript = `
  <script type="application/json">
    "light-mode"
  </script>
</amp-state>
<amp-state id="darkModeSwitcherClass">
  <script type="application/json">
    "amp-dark-mode-container light-mode"
  </script>
</amp-state>
<amp-script layout="container" script="dark-mode-script">
<div class="amp-dark-mode-container">
  <button id="dark-mode-switcher-light"  class="amp-dark-mode-button">
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" aria-label="Dark Theme"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
  </button>
  <button id="dark-mode-switcher-dark"  class="amp-dark-mode-button">
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" aria-label="light-theme" class="amp-light-icon"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
  </button>
</div>
</amp-script>
<script id="dark-mode-script" type="text/plain" target="amp-script">
const lightButton = document.getElementById('dark-mode-switcher-light');
const darkButton = document.getElementById('dark-mode-switcher-dark');
lightButton.addEventListener('click', () => {
 AMP.setState({ darkClass: 'dark-mode'}); 
});
darkButton.addEventListener('click', () => {
 AMP.setState({ darkClass: 'light-mode'}); 
});

</script>
`

  const ampBoilerplateStyle = `<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>`

  const ampShare = `
    <div class="amp-share-container">
      <div class="amp-share-title">
        <span>Share</span>
      </div>
      <div class="amp-share-button-container">
        <a
          target="_blank"
          rel="noopener noreferrer"
          title=""
          class="amp-share-button"
          href="https://facebook.com/sharer/sharer.php?u=${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}/amp"
        >
          <svg
            stroke="currentColor"
            fill="none"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke-linecap="round"
            stroke-linejoin="round"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
            ></path>
          </svg>
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          title=""
          class="amp-share-button"
          href="https://twitter.com/intent/tweet/?text=${encodeURI(
            article?.metaDescription!,
          )}&amp;url=${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}/amp"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 2H1L9.26086 13.0145L1.44995 21.9999H4.09998L10.4883 14.651L16 22H23L14.3917 10.5223L21.8001 2H19.1501L13.1643 8.88578L8 2ZM17 20L5 4H7L19 20H17Z"
            ></path>
          </svg>
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          title=""
          class="amp-share-button"
          href="whatsapp://send?text=${encodeURI(
            article.title,
          )}${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}/amp"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 448 512"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"
            ></path>
          </svg>
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          title="${article.title}"
          class="amp-share-button"
          href="mailto:?subject=${encodeURI(
            article.title,
          )};body=${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}/amp"
        >
          <svg
            stroke="currentColor"
            fill="none"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke-linecap="round"
            stroke-linejoin="round"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </svg>
        </a>
      </div>
    </div>
  `

  const ampComment = `
    <div class="amp-comment-action">
      <a
        aria-label="Leave a comment"
        href="${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}#comment"
      >
        Leave a comment
      </a>
    </div>
  `

  const ampLayout = `
      <!doctype html>
        <html amp lang="en">
        <head>
        <meta charset="utf-8" />
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <script
          async
          custom-element="amp-script"
          src="https://cdn.ampproject.org/v0/amp-script-0.1.js"
        ></script>
        <script
          async
          custom-element="amp-youtube"
          src="https://cdn.ampproject.org/v0/amp-youtube-0.1.js"
        ></script>
        <script
          async
          custom-element="amp-ad"
          src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"
        ></script>
        <script
          async
          custom-element="amp-twitter"
          src="https://cdn.ampproject.org/v0/amp-twitter-0.1.js"
        ></script>
        <script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>
        <script
          async
          custom-element="amp-bind"
          src="https://cdn.ampproject.org/v0/amp-bind-0.1.js"
        ></script>
        <meta
          name="amp-script-src"
          content="sha384-HLjhGFoQL5ruBX6qnMC1eyKy-QVvXvGLwT0Pe55bKhv3Ov21f0S15eWC0gwkcxHg"
        />
        <script async custom-element="amp-auto-ads" src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"></script>
        <title>${article.title}</title>
        <link
          rel="canonical"
          href="${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}"
        />
        <meta
          name="viewport"
          content="width=device-width,minimum-scale=1,initial-scale=1"
        />
        <meta property="og:title" content="${article.title}" />
        <meta name="twitter:title" content="${article.title}" />
        <meta
          name="description"
          content="${sanitizeMetaDataAMP(article?.metaDescription!)}"
        />
        <meta
          property="og:description"
          content="${sanitizeMetaDataAMP(article?.metaDescription!)}"
        />
        <meta
          name="twitter:description"
          content="${sanitizeMetaDataAMP(article?.metaDescription!)}"
        />
        <meta property="og:site_name" content="${env.NEXT_PUBLIC_SITE_URL}" />
        <meta property="og:locale" content="${locale}" />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content="${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}"
        />
        <meta
          name="twitter:url"
          content="${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}"
        />
        <meta property="og:image" content="${article.featuredImage}" />
        <meta name="twitter:image" content="${article.featuredImage}" />
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content="${article.authors[0].name!}" />
        ${article.topics
          .map(
            (topic) => `
        <meta property="article:tag" content="${topic.title}">
        `,
          )
          .join("")}
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icon/favicon-16x16.png"
        />
        <link
          rel="preload"
          fetchpriority="high"
          as="image"
          href="${article.featuredImage}"
        />
        <link rel="dns-prefetch" href="${env.NEXT_PUBLIC_SITE_URL}" />
        <link rel="dns-prefetch" href="https://cdn.ampproject.org" />
        ${ampBoilerplateStyle}
        <style amp-custom>
           ${basecolor}
          ${htmlStyle}
        </style>
        <script type="application/ld+json">
          ${JSON.stringify(newsArticle)}
        </script>
        <script type="application/ld+json">
          ${JSON.stringify(breadcrumbList)}
        </script>
      </head>
      <body>
      <amp-auto-ads type="adsense" data-ad-client="ca-${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}"></amp-auto-ads>
      <amp-analytics type="gtag" data-credentials="include">
      <script type="application/json">
      {
        "vars" : {
          "gtag_id": "${env.NEXT_PUBLIC_GA_ID}",
          "config" : {
            "${env.NEXT_PUBLIC_GA_ID}": { "groups": "default" }
          }
        }
      }
      </script>
      </amp-analytics>
        <div id="amp-dark-mode-wrapper" class="ligth-mode" [class]="darkClass">
          <header id="#top" class="amp-header-container">
            <div class="amp-container">
              <a class="amp-logo" href="/">
                <svg
                  version="1.0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="100px"
                  height="18px"
                  viewBox="0 0 337.4484693013283 60"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g
                    data-v-423bf9ae=""
                    id="47f88596-83cf-4f53-bb77-cccbcf3e67b4"
                    fill="currentColor"
                    transform="matrix(5.888125304749934,0,0,5.888125304749934,-4.298332131282194,-27.968596151236504)"
                  >
                    <path d="M5.04 13.69L5.04 10.39L5.04 10.39Q5.04 9.95 4.79 9.75L4.79 9.75L4.79 9.75Q4.55 9.55 4.13 9.55L4.13 9.55L4.13 9.55Q3.85 9.55 3.58 9.62L3.58 9.62L3.58 9.62Q3.30 9.69 3.11 9.83L3.11 9.83L3.11 14.69L3.11 14.69Q2.97 14.73 2.67 14.77L2.67 14.77L2.67 14.77Q2.37 14.81 2.04 14.81L2.04 14.81L2.04 14.81Q1.74 14.81 1.49 14.77L1.49 14.77L1.49 14.77Q1.25 14.73 1.08 14.60L1.08 14.60L1.08 14.60Q0.91 14.48 0.82 14.26L0.82 14.26L0.82 14.26Q0.73 14.04 0.73 13.69L0.73 13.69L0.73 9.49L0.73 9.49Q0.73 9.11 0.89 8.88L0.89 8.88L0.89 8.88Q1.05 8.64 1.33 8.44L1.33 8.44L1.33 8.44Q1.81 8.11 2.53 7.90L2.53 7.90L2.53 7.90Q3.25 7.69 4.13 7.69L4.13 7.69L4.13 7.69Q5.71 7.69 6.57 8.38L6.57 8.38L6.57 8.38Q7.42 9.07 7.42 10.30L7.42 10.30L7.42 14.69L7.42 14.69Q7.28 14.73 6.98 14.77L6.98 14.77L6.98 14.77Q6.68 14.81 6.36 14.81L6.36 14.81L6.36 14.81Q6.05 14.81 5.80 14.77L5.80 14.77L5.80 14.77Q5.56 14.73 5.39 14.60L5.39 14.60L5.39 14.60Q5.22 14.48 5.13 14.26L5.13 14.26L5.13 14.26Q5.04 14.04 5.04 13.69L5.04 13.69ZM8.83 6.01L8.83 6.01L8.83 6.01Q8.83 5.47 9.19 5.11L9.19 5.11L9.19 5.11Q9.55 4.75 10.14 4.75L10.14 4.75L10.14 4.75Q10.72 4.75 11.08 5.11L11.08 5.11L11.08 5.11Q11.44 5.47 11.44 6.01L11.44 6.01L11.44 6.01Q11.44 6.54 11.08 6.90L11.08 6.90L11.08 6.90Q10.72 7.27 10.14 7.27L10.14 7.27L10.14 7.27Q9.55 7.27 9.19 6.90L9.19 6.90L9.19 6.90Q8.83 6.54 8.83 6.01ZM11.33 8.99L11.33 14.69L11.33 14.69Q11.17 14.71 10.87 14.76L10.87 14.76L10.87 14.76Q10.57 14.81 10.26 14.81L10.26 14.81L10.26 14.81Q9.95 14.81 9.71 14.77L9.71 14.77L9.71 14.77Q9.46 14.73 9.30 14.60L9.30 14.60L9.30 14.60Q9.13 14.48 9.04 14.26L9.04 14.26L9.04 14.26Q8.95 14.04 8.95 13.69L8.95 13.69L8.95 7.99L8.95 7.99Q9.10 7.97 9.40 7.92L9.40 7.92L9.40 7.92Q9.70 7.87 10.01 7.87L10.01 7.87L10.01 7.87Q10.32 7.87 10.56 7.91L10.56 7.91L10.56 7.91Q10.81 7.95 10.98 8.08L10.98 8.08L10.98 8.08Q11.14 8.20 11.24 8.42L11.24 8.42L11.24 8.42Q11.33 8.64 11.33 8.99L11.33 8.99ZM18.58 12.67L18.58 12.67L18.58 12.67Q18.58 13.73 17.78 14.34L17.78 14.34L17.78 14.34Q16.98 14.94 15.43 14.94L15.43 14.94L15.43 14.94Q14.84 14.94 14.34 14.85L14.34 14.85L14.34 14.85Q13.83 14.77 13.48 14.60L13.48 14.60L13.48 14.60Q13.12 14.42 12.92 14.15L12.92 14.15L12.92 14.15Q12.71 13.89 12.71 13.52L12.71 13.52L12.71 13.52Q12.71 13.19 12.85 12.96L12.85 12.96L12.85 12.96Q12.99 12.73 13.19 12.57L13.19 12.57L13.19 12.57Q13.59 12.80 14.12 12.97L14.12 12.97L14.12 12.97Q14.64 13.15 15.33 13.15L15.33 13.15L15.33 13.15Q15.76 13.15 16.00 13.02L16.00 13.02L16.00 13.02Q16.23 12.89 16.23 12.68L16.23 12.68L16.23 12.68Q16.23 12.49 16.06 12.38L16.06 12.38L16.06 12.38Q15.89 12.26 15.50 12.19L15.50 12.19L15.08 12.11L15.08 12.11Q13.86 11.87 13.27 11.36L13.27 11.36L13.27 11.36Q12.67 10.85 12.67 9.90L12.67 9.90L12.67 9.90Q12.67 9.38 12.89 8.96L12.89 8.96L12.89 8.96Q13.12 8.54 13.52 8.26L13.52 8.26L13.52 8.26Q13.93 7.98 14.50 7.83L14.50 7.83L14.50 7.83Q15.06 7.67 15.75 7.67L15.75 7.67L15.75 7.67Q16.27 7.67 16.72 7.75L16.72 7.75L16.72 7.75Q17.18 7.83 17.51 7.98L17.51 7.98L17.51 7.98Q17.85 8.13 18.05 8.38L18.05 8.38L18.05 8.38Q18.24 8.62 18.24 8.96L18.24 8.96L18.24 8.96Q18.24 9.28 18.12 9.51L18.12 9.51L18.12 9.51Q18.00 9.74 17.82 9.90L17.82 9.90L17.82 9.90Q17.71 9.83 17.49 9.75L17.49 9.75L17.49 9.75Q17.26 9.67 17.00 9.61L17.00 9.61L17.00 9.61Q16.73 9.55 16.46 9.51L16.46 9.51L16.46 9.51Q16.18 9.46 15.96 9.46L15.96 9.46L15.96 9.46Q15.50 9.46 15.25 9.57L15.25 9.57L15.25 9.57Q14.99 9.67 14.99 9.90L14.99 9.90L14.99 9.90Q14.99 10.05 15.13 10.15L15.13 10.15L15.13 10.15Q15.27 10.25 15.67 10.33L15.67 10.33L16.10 10.43L16.10 10.43Q17.44 10.74 18.01 11.28L18.01 11.28L18.01 11.28Q18.58 11.82 18.58 12.67ZM26.77 11.30L26.77 11.30L26.77 11.30Q26.77 12.17 26.50 12.85L26.50 12.85L26.50 12.85Q26.24 13.52 25.75 13.99L25.75 13.99L25.75 13.99Q25.27 14.45 24.60 14.69L24.60 14.69L24.60 14.69Q23.93 14.92 23.10 14.92L23.10 14.92L23.10 14.92Q22.27 14.92 21.60 14.67L21.60 14.67L21.60 14.67Q20.93 14.42 20.45 13.95L20.45 13.95L20.45 13.95Q19.96 13.48 19.70 12.81L19.70 12.81L19.70 12.81Q19.43 12.14 19.43 11.30L19.43 11.30L19.43 11.30Q19.43 10.47 19.70 9.80L19.70 9.80L19.70 9.80Q19.96 9.13 20.45 8.66L20.45 8.66L20.45 8.66Q20.93 8.19 21.60 7.94L21.60 7.94L21.60 7.94Q22.27 7.69 23.10 7.69L23.10 7.69L23.10 7.69Q23.93 7.69 24.60 7.95L24.60 7.95L24.60 7.95Q25.27 8.20 25.75 8.67L25.75 8.67L25.75 8.67Q26.24 9.14 26.50 9.81L26.50 9.81L26.50 9.81Q26.77 10.49 26.77 11.30ZM21.87 11.30L21.87 11.30L21.87 11.30Q21.87 12.15 22.20 12.61L22.20 12.61L22.20 12.61Q22.53 13.06 23.11 13.06L23.11 13.06L23.11 13.06Q23.70 13.06 24.02 12.60L24.02 12.60L24.02 12.60Q24.33 12.14 24.33 11.30L24.33 11.30L24.33 11.30Q24.33 10.46 24.01 10.00L24.01 10.00L24.01 10.00Q23.69 9.55 23.10 9.55L23.10 9.55L23.10 9.55Q22.51 9.55 22.19 10.00L22.19 10.00L22.19 10.00Q21.87 10.46 21.87 11.30ZM31.19 7.69L31.19 7.69L31.19 7.69Q31.77 7.69 32.32 7.85L32.32 7.85L32.32 7.85Q32.87 8.01 33.28 8.33L33.28 8.33L33.28 8.33Q33.70 8.05 34.22 7.87L34.22 7.87L34.22 7.87Q34.75 7.69 35.49 7.69L35.49 7.69L35.49 7.69Q36.02 7.69 36.53 7.83L36.53 7.83L36.53 7.83Q37.04 7.97 37.44 8.27L37.44 8.27L37.44 8.27Q37.84 8.57 38.08 9.07L38.08 9.07L38.08 9.07Q38.32 9.56 38.32 10.28L38.32 10.28L38.32 14.69L38.32 14.69Q38.18 14.73 37.88 14.77L37.88 14.77L37.88 14.77Q37.58 14.81 37.25 14.81L37.25 14.81L37.25 14.81Q36.95 14.81 36.70 14.77L36.70 14.77L36.70 14.77Q36.46 14.73 36.29 14.60L36.29 14.60L36.29 14.60Q36.12 14.48 36.03 14.26L36.03 14.26L36.03 14.26Q35.94 14.04 35.94 13.69L35.94 13.69L35.94 10.35L35.94 10.35Q35.94 9.93 35.70 9.74L35.70 9.74L35.70 9.74Q35.46 9.55 35.06 9.55L35.06 9.55L35.06 9.55Q34.86 9.55 34.64 9.64L34.64 9.64L34.64 9.64Q34.41 9.73 34.30 9.83L34.30 9.83L34.30 9.83Q34.31 9.88 34.31 9.93L34.31 9.93L34.31 9.93Q34.31 9.98 34.31 10.02L34.31 10.02L34.31 14.69L34.31 14.69Q34.16 14.73 33.86 14.77L33.86 14.77L33.86 14.77Q33.56 14.81 33.25 14.81L33.25 14.81L33.25 14.81Q32.94 14.81 32.70 14.77L32.70 14.77L32.70 14.77Q32.45 14.73 32.28 14.60L32.28 14.60L32.28 14.60Q32.12 14.48 32.03 14.26L32.03 14.26L32.03 14.26Q31.93 14.04 31.93 13.69L31.93 13.69L31.93 10.35L31.93 10.35Q31.93 9.93 31.68 9.74L31.68 9.74L31.68 9.74Q31.42 9.55 31.05 9.55L31.05 9.55L31.05 9.55Q30.80 9.55 30.62 9.63L30.62 9.63L30.62 9.63Q30.44 9.70 30.31 9.77L30.31 9.77L30.31 14.69L30.31 14.69Q30.17 14.73 29.87 14.77L29.87 14.77L29.87 14.77Q29.57 14.81 29.25 14.81L29.25 14.81L29.25 14.81Q28.94 14.81 28.69 14.77L28.69 14.77L28.69 14.77Q28.45 14.73 28.28 14.60L28.28 14.60L28.28 14.60Q28.11 14.48 28.02 14.26L28.02 14.26L28.02 14.26Q27.93 14.04 27.93 13.69L27.93 13.69L27.93 9.46L27.93 9.46Q27.93 9.09 28.09 8.86L28.09 8.86L28.09 8.86Q28.25 8.64 28.53 8.44L28.53 8.44L28.53 8.44Q29.01 8.11 29.72 7.90L29.72 7.90L29.72 7.90Q30.42 7.69 31.19 7.69ZM44.09 13.69L44.09 10.39L44.09 10.39Q44.09 9.95 43.84 9.75L43.84 9.75L43.84 9.75Q43.60 9.55 43.18 9.55L43.18 9.55L43.18 9.55Q42.90 9.55 42.62 9.62L42.62 9.62L42.62 9.62Q42.35 9.69 42.15 9.83L42.15 9.83L42.15 14.69L42.15 14.69Q42.01 14.73 41.71 14.77L41.71 14.77L41.71 14.77Q41.41 14.81 41.09 14.81L41.09 14.81L41.09 14.81Q40.78 14.81 40.54 14.77L40.54 14.77L40.54 14.77Q40.29 14.73 40.12 14.60L40.12 14.60L40.12 14.60Q39.96 14.48 39.87 14.26L39.87 14.26L39.87 14.26Q39.77 14.04 39.77 13.69L39.77 13.69L39.77 9.49L39.77 9.49Q39.77 9.11 39.94 8.88L39.94 8.88L39.94 8.88Q40.10 8.64 40.38 8.44L40.38 8.44L40.38 8.44Q40.85 8.11 41.57 7.90L41.57 7.90L41.57 7.90Q42.29 7.69 43.18 7.69L43.18 7.69L43.18 7.69Q44.76 7.69 45.61 8.38L45.61 8.38L45.61 8.38Q46.47 9.07 46.47 10.30L46.47 10.30L46.47 14.69L46.47 14.69Q46.33 14.73 46.02 14.77L46.02 14.77L46.02 14.77Q45.72 14.81 45.40 14.81L45.40 14.81L45.40 14.81Q45.09 14.81 44.85 14.77L44.85 14.77L44.85 14.77Q44.60 14.73 44.44 14.60L44.44 14.60L44.44 14.60Q44.27 14.48 44.18 14.26L44.18 14.26L44.18 14.26Q44.09 14.04 44.09 13.69L44.09 13.69ZM47.88 6.01L47.88 6.01L47.88 6.01Q47.88 5.47 48.24 5.11L48.24 5.11L48.24 5.11Q48.59 4.75 49.18 4.75L49.18 4.75L49.18 4.75Q49.77 4.75 50.13 5.11L50.13 5.11L50.13 5.11Q50.48 5.47 50.48 6.01L50.48 6.01L50.48 6.01Q50.48 6.54 50.13 6.90L50.13 6.90L50.13 6.90Q49.77 7.27 49.18 7.27L49.18 7.27L49.18 7.27Q48.59 7.27 48.24 6.90L48.24 6.90L48.24 6.90Q47.88 6.54 47.88 6.01ZM50.37 8.99L50.37 14.69L50.37 14.69Q50.22 14.71 49.92 14.76L49.92 14.76L49.92 14.76Q49.62 14.81 49.31 14.81L49.31 14.81L49.31 14.81Q49 14.81 48.75 14.77L48.75 14.77L48.75 14.77Q48.51 14.73 48.34 14.60L48.34 14.60L48.34 14.60Q48.17 14.48 48.08 14.26L48.08 14.26L48.08 14.26Q47.99 14.04 47.99 13.69L47.99 13.69L47.99 7.99L47.99 7.99Q48.15 7.97 48.45 7.92L48.45 7.92L48.45 7.92Q48.75 7.87 49.06 7.87L49.06 7.87L49.06 7.87Q49.36 7.87 49.61 7.91L49.61 7.91L49.61 7.91Q49.85 7.95 50.02 8.08L50.02 8.08L50.02 8.08Q50.19 8.20 50.28 8.42L50.28 8.42L50.28 8.42Q50.37 8.64 50.37 8.99L50.37 8.99ZM54.80 13.19L54.80 13.19L54.80 13.19Q55.03 13.19 55.32 13.14L55.32 13.14L55.32 13.14Q55.61 13.09 55.75 13.01L55.75 13.01L55.75 11.89L54.74 11.97L54.74 11.97Q54.35 12.00 54.10 12.14L54.10 12.14L54.10 12.14Q53.84 12.28 53.84 12.56L53.84 12.56L53.84 12.56Q53.84 12.84 54.06 13.01L54.06 13.01L54.06 13.01Q54.28 13.19 54.80 13.19ZM54.68 7.69L54.68 7.69L54.68 7.69Q55.44 7.69 56.06 7.84L56.06 7.84L56.06 7.84Q56.69 7.99 57.13 8.31L57.13 8.31L57.13 8.31Q57.57 8.62 57.81 9.11L57.81 9.11L57.81 9.11Q58.04 9.59 58.04 10.25L58.04 10.25L58.04 13.38L58.04 13.38Q58.04 13.75 57.84 13.98L57.84 13.98L57.84 13.98Q57.64 14.21 57.36 14.38L57.36 14.38L57.36 14.38Q56.45 14.92 54.80 14.92L54.80 14.92L54.80 14.92Q54.05 14.92 53.46 14.78L53.46 14.78L53.46 14.78Q52.86 14.64 52.44 14.36L52.44 14.36L52.44 14.36Q52.01 14.08 51.78 13.65L51.78 13.65L51.78 13.65Q51.55 13.22 51.55 12.64L51.55 12.64L51.55 12.64Q51.55 11.68 52.12 11.16L52.12 11.16L52.12 11.16Q52.70 10.64 53.90 10.51L53.90 10.51L55.73 10.32L55.73 10.22L55.73 10.22Q55.73 9.81 55.38 9.64L55.38 9.64L55.38 9.64Q55.02 9.46 54.35 9.46L54.35 9.46L54.35 9.46Q53.82 9.46 53.31 9.58L53.31 9.58L53.31 9.58Q52.81 9.69 52.40 9.86L52.40 9.86L52.40 9.86Q52.22 9.73 52.09 9.47L52.09 9.47L52.09 9.47Q51.97 9.21 51.97 8.93L51.97 8.93L51.97 8.93Q51.97 8.57 52.14 8.35L52.14 8.35L52.14 8.35Q52.32 8.13 52.68 7.98L52.68 7.98L52.68 7.98Q53.09 7.83 53.64 7.76L53.64 7.76L53.64 7.76Q54.19 7.69 54.68 7.69Z"></path>
                  </g>
                </svg>
              </a>
              <div>
              <amp-state id="darkClass">
              ${ampScript}
              </div>
            </div>
          </header>
          <main>
            <article class="amp-article">
              <header class="amp-article-header">
                <h1 class="amp-article-title">${article.title}</h1>
                <div class="amp-author-container">
                  <div class="amp-author">
                      <a href="${env.NEXT_PUBLIC_SITE_URL}/artice/user/${article.authors[0].username!}"
                        >${article.authors[0].name!}</a
                      >
                  </div>
                </div>
              </header>
              <figure class="amp-article-image">
                <amp-img
                  noloading
                  data-hero
                  src="${article.featuredImage}"
                  width="600"
                  height="340"
                  layout="responsive"
                  alt="${article.title}"
                ></amp-img>
              </figure>
              <section class="amp-article-content">
                ${htmlcontent.firstCleanHtml}
                ${htmlcontent.secondCleanHtml}
              </section>
                <div class="amp-topic-list">
                  ${article.topics
                    .map((topic) => {
                      return `<a href="${env.NEXT_PUBLIC_SITE_URL}/article/topic/${topic.slug}" rel="topics tag">${topic.title}</a>`
                    })
                    .join(" ")}
                </div>
            ${ampShare}
            ${ampComment}
            </article>
          </main>
          <footer class="amp-footer-container">
            <div class="amp-footer-copy">
              &copy; ${JSON.stringify(new Date().getFullYear())} ${env.NEXT_PUBLIC_SITE_TITLE}
            </div>
          </footer>
        </div>
      </body>
    </html>`

  return new Response(ampLayout, {
    headers: { "content-type": "text/html" },
  })
}
