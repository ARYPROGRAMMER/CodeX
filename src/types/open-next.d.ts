declare module '@opennextjs/aws/types/open-next' {
    export interface OpenNextConfig {
      default: {
        override: {
          wrapper: string;
          converter: string;
            incrementalCache: string;
          tagCache: string;
          queue: string;
        };
      };
      middleware: {
        external: boolean;
        override: {
          wrapper: string;
          converter: string;
          proxyExternalRequest: string
        };
      };
        dangerous: {
            enableCacheInterception: boolean;
        };
    }
  }