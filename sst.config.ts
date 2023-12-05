import type { SSTConfig } from "sst";
import { AstroSite, type StackContext } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "portfolio-tmp",
      region: "eu-central-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }: StackContext) {
      const site = new AstroSite(stack, "site", {
        environment: {
          PUBLIC_SANITY_PROJECT_ID: process.env.PUBLIC_SANITY_PROJECT_ID!,
          PUBLIC_SANITY_DATASET: process.env.PUBLIC_SANITY_DATASET!,
          // SES_AWS_ACCESS_KEY_ID: process.env.SES_AWS_ACCESS_KEY_ID!,
          // SES_AWS_SECRET_ACCESS_KEY: process.env.SES_AWS_SECRET_ACCESS_KEY!,
          AWS_URL: process.env.AWS_URL!,
          AWS_KEY: process.env.AWS_KEY!,
          DOMAIN: process.env.DOMAIN!,
        },
        cdk: {
          responseHeadersPolicy: {
            responseHeadersPolicyId: process.env.RESPONSE_HEADER_POLICY_ID!
          }
        },
      });
      stack.addOutputs({
        url: site.url,
      });
    });
  },
} satisfies SSTConfig;
