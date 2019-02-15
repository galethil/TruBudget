import { registerRoutes } from "./httpd/router";
import { createBasicApp } from "./httpd/server";
import deepcopy from "./lib/deepcopy";
import logger from "./lib/logger";
import { isReady } from "./lib/readiness";
import timeout from "./lib/timeout";
import { registerNode } from "./network/controller/registerNode";
import { ensureOrganizationStream } from "./organization/organization";
import * as Multichain from "./service";
import { randomString } from "./service/hash";
import * as HttpdMultichainAdapter from "./service/HttpdMultichainAdapter";
import { ConnectionSettings } from "./service/RpcClient.h";

const URL_PREFIX = "/api";
/*
 * Deal with the environment:
 */

const port: number = (process.env.PORT && parseInt(process.env.PORT, 10)) || 8080;

const jwtSecret: string = process.env.JWT_SECRET || randomString(32);
if (jwtSecret.length < 32) {
  logger.warn("Warning: the JWT secret key should be at least 32 characters long.");
}
const rootSecret: string = process.env.ROOT_SECRET || randomString(32);
if (!process.env.ROOT_SECRET) {
  logger.warn(`Warning: root password not set; autogenerated to ${rootSecret}`);
}
const organization: string | undefined = process.env.ORGANIZATION;
if (!organization) {
  logger.fatal(`Please set ORGANIZATION to the organization this node belongs to.`);
  process.exit(1);
}
const organizationVaultSecret: string | undefined = process.env.ORGANIZATION_VAULT_SECRET;
if (!organizationVaultSecret) {
  logger.fatal(
    `Please set ORGANIZATION_VAULT_SECRET to the secret key used to encrypt the organization's vault.`,
  );
  process.exit(1);
}

const SWAGGER_BASEPATH = process.env.SWAGGER_BASEPATH || "/";

/*
 * Initialize the components:
 */

const multichainHost = process.env.RPC_HOST || "localhost";
const backupApiPort = process.env.BACKUP_API_PORT || "8085";

const rpcSettings: ConnectionSettings = {
  protocol: "http",
  host: multichainHost,
  port: parseInt(process.env.RPC_PORT || "8000", 10),
  username: process.env.RPC_USER || "multichainrpc",
  password: process.env.RPC_PASSWORD || "s750SiJnj50yIrmwxPnEdSzpfGlTAHzhaUwgqKeb0G1j",
};

const env = process.env.NODE_ENV || "";

logger.info(
  { rpcSettings: rpcSettingsWithoutPassword(rpcSettings) },
  "Connecting to MultiChain node",
);
const db = Multichain.init(rpcSettings);
const { multichainClient } = db;

const server = createBasicApp(jwtSecret, URL_PREFIX, port, SWAGGER_BASEPATH, env);

/*
 * Run the app:
 */
// server.register(require('./'), { prefix: '/api' })

// Enable useful traces of unhandled-promise warnings:
process.on("unhandledRejection", err => {
  logger.fatal(err, "UNHANDLED PROMISE REJECTION");
  process.exit(1);
});

function registerSelf(): Promise<boolean> {
  return multichainClient
    .getRpcClient()
    .invoke("listaddresses", "*", false, 1, 0)
    .then(addressInfos =>
      addressInfos
        .filter(info => info.ismine)
        .map(info => info.address)
        .find(_ => true),
    )
    .then(address => {
      const req = {
        body: {
          data: {
            address,
            organization,
          },
        },
      };
      registerNode(multichainClient, req);
    })
    .then(() => true)
    .catch(() => false);
}

registerRoutes(
  server,
  multichainClient,
  jwtSecret,
  rootSecret,
  organization!,
  organizationVaultSecret!,
  URL_PREFIX,
  multichainHost,
  backupApiPort,
  {
    assignProject: HttpdMultichainAdapter.assignProject(db),
    createProject: HttpdMultichainAdapter.createProject(db),
    getProjectPermissions: HttpdMultichainAdapter.getProjectPermissionList(db),
    getProjectWithSubprojects: HttpdMultichainAdapter.getProject(db),
    grantAllPermissions: HttpdMultichainAdapter.grantAllPermissions(db),
    grantGlobalPermission: HttpdMultichainAdapter.grantPermission(db),
    grantProjectPermission: HttpdMultichainAdapter.grantProjectPermission(db),
    listGlobalPermissions: HttpdMultichainAdapter.getPermissionList(db),
    listProjects: HttpdMultichainAdapter.getProjectList(db),
    revokeGlobalPermission: HttpdMultichainAdapter.revokePermission(db),
    updateProject: HttpdMultichainAdapter.updateProject(db),
    workflowitemAssigner: HttpdMultichainAdapter.assignWorkflowitem(db),
    workflowitemCloser: HttpdMultichainAdapter.closeWorkflowitem(db),
    workflowitemLister: HttpdMultichainAdapter.getWorkflowitemList(db),
    workflowitemUpdater: HttpdMultichainAdapter.updateWorkflowitem(db),
  },
);

server.listen(port, "0.0.0.0", async err => {
  if (err) {
    logger.fatal({ err }, "Connection could not be established. Aborting.");
    process.exit(1);
  }

  const retryIntervalMs = 5000;

  while (!(await isReady(multichainClient))) {
    logger.info(
      `MultiChain connection/permissions not ready yet. Trying again in ${retryIntervalMs / 1000}s`,
    );
    await timeout(retryIntervalMs);
  }

  while (
    !(await ensureOrganizationStream(multichainClient, organization!, organizationVaultSecret!)
      .then(() => true)
      .catch(() => false))
  ) {
    logger.info(
      { multichainClient, organization },
      `Failed to create organization stream. Trying again in ${retryIntervalMs / 1000}s`,
    );
    await timeout(retryIntervalMs);
  }
  logger.debug({ multichainClient, organization }, "Organization stream present");

  while (!(await registerSelf())) {
    logger.info(
      { multichainClient, organization },
      `Failed to register node. Trying again in ${retryIntervalMs / 1000}s`,
    );
    await timeout(retryIntervalMs);
  }
  logger.debug({ params: { multichainClient, organization } }, "Node registered in nodes stream");
});

function rpcSettingsWithoutPassword(settings) {
  const tmp = deepcopy(settings);
  delete tmp.password;
  return tmp;
}
