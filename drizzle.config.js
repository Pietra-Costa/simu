/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://ai-interview-mockup_owner:SyCm8fZhGz5j@ep-hidden-cell-a59jjmf2.us-east-2.aws.neon.tech/ai-interview-mockup?sslmode=require' ,
  }
};