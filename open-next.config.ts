import { OpenNextConfig } from "@opennextjs/aws/types/open-next";
import cache from "@opennextjs/cloudflare/kvCache";

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",   // Cloudflare wrapper for node environments
      converter: "edge",            // Using edge for the converter
      incrementalCache: "dummy",    // Placeholder for incremental cache (could be a function too)
      tagCache: "dummy",            // Placeholder for tag-based cache
      queue: "dummy",               // Placeholder for queue configuration
    },
  },

  middleware: {
    external: true, // External middleware enabled
    override: {
      wrapper: "cloudflare-edge",     // Cloudflare edge wrapper
      converter: "edge",              // Using edge for the converter
      proxyExternalRequest: "fetch",  // Use fetch to proxy external requests
    },
  },

  "dangerous": {
    enableCacheInterception: false,  // Disable cache interception
  },
};

export default config;
