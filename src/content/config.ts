import { z, defineCollection } from "astro:content"

const anyApiCollection = defineCollection({
  type: "content",
  schema: z
    .object({
      section: z.string(),
      date: z.string(),
      title: z.string(),
      isMdx: z.boolean(),
      permalink: z.string(),
      whatsnext: z.record(z.string(), z.string()).optional(),
      metadata: z
        .object({
          title: z.string(),
          description: z.string(),
          image: z.object({
            0: z.string(),
          }),
        })
        .optional(),
    })
    .strict(),
})
const architectureOverviewCollection = defineCollection({
  type: "content",
  schema: z
    .object({
      section: z.string(),
      date: z.string(),
      title: z.string(),
      permalink: z.string(),
      whatsnext: z.record(z.string(), z.string()).optional(),
      metadata: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          image: z
            .object({
              0: z.string(),
            })
            .optional(),
        })
        .optional(),
    })
    .strict(),
})
const bifCollection = defineCollection({
  type: "content",
  schema: z
    .object({
      section: z.string(),
      date: z.string(),
      title: z.string(),
      isIndex: z.boolean(),
    })
    .strict(),
})
const chainlinkAutomationCollection = defineCollection({
  type: "content",
  schema: z
    .object({
      section: z.string(),
      date: z.string(),
      title: z.string(),
      whatsnext: z.record(z.string(), z.string()).optional(),
      isMdx: z.boolean().optional(),
    })
    .strict(),
})
const chainlinkFunctionsCollection = defineCollection({
  type: "content",
  schema: z
    .object({
      section: z.string(),
      date: z.string(),
      title: z.string(),
      metadata: z
        .object({
          linkToWallet: z.boolean(),
        })
        .optional(),
      whatsnext: z.record(z.string(), z.string()).optional(),
      isIndex: z.boolean().optional(),
    })
    .strict(),
})
const chainlinkNodesCollection = defineCollection({
  type: "content",
  schema: z
    .object({
      section: z.string(),
      date: z.string(),
      title: z.string(),
      permalink: z.string().optional(),
      whatsnext: z.record(z.string(), z.string()).optional(),
      metadata: z
        .object({
          title: z.string(),
          description: z.string(),
        })
        .optional(),
    })
    .strict(),
})

const dataFeedsCollection = defineCollection({
  type: "content",
  schema: z
    .object({
      section: z.string(),
      date: z.string(),
      title: z.string(),
      permalink: z.string().optional(),
      isIndex: z.boolean().optional(),
      excerpt: z.string().optional(),
      datafeedtype: z.string().optional(),
      whatsnext: z.record(z.string(), z.string()).optional(),
      metadata: z
        .object({
          title: z.string().optional(),
          description: z.string(),
        })
        .optional(),
    })
    .strict(),
})

const gettingStartedCollection = defineCollection({
  type: "content",
  schema: z
    .object({
      section: z.string(),
      date: z.string(),
      title: z.string(),
      permalink: z.string().optional(),
      excerpt: z.string().optional(),
      whatsnext: z.record(z.string(), z.string()).optional(),
      metadata: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          image: z.object({
            0: z.string(),
          }),
        })
        .optional(),
    })
    .strict(),
})
const resourcesCollection = defineCollection({
  type: "content",
  schema: z
    .object({
      section: z.string(),
      date: z.string(),
      title: z.string(),
      permalink: z.string().optional(),
      whatsnext: z.record(z.string(), z.string()).optional(),
      metadata: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          linkToWallet: z.boolean().optional(),
          image: z
            .object({
              0: z.string(),
            })
            .optional(),
        })
        .optional(),
    })
    .strict(),
})
const vrfCollection = defineCollection({
  type: "content",
  schema: z
    .object({
      section: z.string(),
      date: z.string().optional(),
      title: z.string(),
      permalink: z.string().optional(),
      whatsnext: z.record(z.string(), z.string()).optional(),
      metadata: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          linkToWallet: z.boolean().optional(),
          image: z
            .object({
              0: z.string(),
            })
            .optional(),
        })
        .optional(),
      isMdx: z.boolean().optional(),
    })
    .strict(),
})
const ccipCollection = defineCollection({
  type: "content",
  schema: z
    .object({
      section: z.string(),
      date: z.string(),
      title: z.string(),
      whatsnext: z.record(z.string(), z.string()).optional(),
      isIndex: z.boolean().optional(),
    })
    .strict(),
})

export const collections = {
  "any-api": anyApiCollection,
  "architecture-overview": architectureOverviewCollection,
  "blockchain-integrations-framework": bifCollection,
  "chainlink-automation": chainlinkAutomationCollection,
  "chainlink-functions": chainlinkFunctionsCollection,
  "chainlink-nodes": chainlinkNodesCollection,
  "data-feeds": dataFeedsCollection,
  "getting-started": gettingStartedCollection,
  resources: resourcesCollection,
  vrf: vrfCollection,
  ccip: ccipCollection,
}
