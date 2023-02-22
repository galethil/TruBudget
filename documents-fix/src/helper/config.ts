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
}

const config: ApplicationConfiguration = {
  SOURCE_RPC_PORT: env.SOURCE_RPC_PORT,
  SOURCE_RPC_USER: env.SOURCE_RPC_USER,
  SOURCE_RPC_PASSWORD: env.SOURCE_RPC_PASSWORD,
  SOURCE_RPC_HOST: env.SOURCE_RPC_HOST,

  ORGANIZATION: env.ORGANIZATION,
  ORGANIZATION_VAULT_SECRET: env.ORGANIZATION_VAULT_SECRET,
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
    config.ORGANIZATION_VAULT_SECRET
  )
    return config;

  throw new Error(
    "At least one environment variable is not set. Please review your settings!"
  );
};

export default isEnvironmentSet(config);
