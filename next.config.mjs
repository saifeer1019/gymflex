/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    output: 'standalone',
    images: {
      domains: ['pub-67bde4aa3aa34d01a261d06d103bf2d6.r2.dev']
    },
  }
 
  
  export default nextConfig;
