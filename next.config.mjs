/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
       remotePatterns: [
          {
            protocol: "https",
            hostname: "i.scdn.co",
            pathname: "**",
          },
          {
            protocol: "https",
            hostname: "mosaic.scdn.co",
            pathname: "**",
          },
          {
            protocol: "https",
            hostname: "image-cdn-fa.spotifycdn.com",
            pathname: "**",
          },
          {
            protocol: "https",
            hostname: "*.spotifycdn.com",
            pathname: "**",
          },
        ],
      },
};

export default nextConfig;
