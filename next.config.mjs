   /** @type {import('next').NextConfig} */
   const nextConfig = {
    reactStrictMode: true,
    env: {
      MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY,
      MAILCHIMP_SERVER_PREFIX: process.env.MAILCHIMP_SERVER_PREFIX,
    },
  }

  export default nextConfig