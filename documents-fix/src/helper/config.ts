require("dotenv").config();
const { env } = process;

export type ApplicationConfiguration = {
  [configName in ConfigOption]: string;
};

export enum ConfigOption {
  SOURCE_RPC_PORT = "SOURCE_RPC_PORT",
  SOURCE_RPC_USER = "SOURCE_RPC_USER",
  SOURCE_RPC_PASSWORD = "SOURCE_RPC_PASSWORD",
  SOURCE_RPC_HOST = "SOURCE_RPC_HOST",
  ORGANIZATION = "ORGANIZATION",
  ORGANIZATION_VAULT_SECRET = "ORGANIZATION_VAULT_SECRET",
  MINIO_ACCESS_KEY = "MINIO_ACCESS_KEY",
  MINIO_SECRET_KEY = "MINIO_SECRET_KEY",
  MINIO_HOST = "MINIO_HOST",
  MINIO_PORT = "MINIO_PORT",
  MINIO_BUCKET_NAME = "MINIO_BUCKET_NAME",
}

const config: ApplicationConfiguration = {
  SOURCE_RPC_PORT: env.SOURCE_RPC_PORT,
  SOURCE_RPC_USER: env.SOURCE_RPC_USER,
  SOURCE_RPC_PASSWORD: env.SOURCE_RPC_PASSWORD,
  SOURCE_RPC_HOST: env.SOURCE_RPC_HOST,

  ORGANIZATION: env.ORGANIZATION,
  ORGANIZATION_VAULT_SECRET: env.ORGANIZATION_VAULT_SECRET,
  MINIO_ACCESS_KEY: env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: env.MINIO_SECRET_KEY,
  MINIO_HOST: env.MINIO_HOST,
  MINIO_PORT: env.MINIO_PORT,
  MINIO_BUCKET_NAME: env.MINIO_BUCKET_NAME,
};

const isEnvironmentSet = (
  config: ApplicationConfiguration
): ApplicationConfiguration => {
  if (
    config.SOURCE_RPC_PORT &&
    config.SOURCE_RPC_USER &&
    config.SOURCE_RPC_PASSWORD &&
    config.SOURCE_RPC_HOST &&
    config.ORGANIZATION &&
    config.ORGANIZATION_VAULT_SECRET &&
    config.MINIO_ACCESS_KEY &&
    config.MINIO_SECRET_KEY &&
    config.MINIO_HOST &&
    config.MINIO_PORT &&
    config.MINIO_BUCKET_NAME
  )
    return config;

  throw new Error(
    "At least one environment variable is not set. Please review your settings!"
  );
};

export default isEnvironmentSet(config);
