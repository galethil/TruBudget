import { documentUploader } from './customMigration/migrateDocuments';
import { makeProjectUploader } from './customMigration/migrateWorkflowitems';
import ApplicationConfiguration from './helper/config';
import { disableMigrationUser } from './helper/configureDestination';
import { getAllStreams } from './helper/migrationHelper';
import { CustomMigrations, migrate } from './migrate';
import { StreamInfo } from './types/stream';

let migrationSource = require("multichain-node")({
  port: ApplicationConfiguration.SOURCE_RPC_PORT,
  host: ApplicationConfiguration.SOURCE_RPC_HOST,
  user: ApplicationConfiguration.SOURCE_RPC_USER,
  pass: ApplicationConfiguration.SOURCE_RPC_PASSWORD,
});

let migrationDestination = require("multichain-node")({
  port: ApplicationConfiguration.DESTINATION_RPC_PORT,
  host: ApplicationConfiguration.DESTINATION_RPC_HOST,
  user: ApplicationConfiguration.DESTINATION_RPC_USER,
  pass: ApplicationConfiguration.DESTINATION_RPC_PASSWORD,
});

const customMigrationFunctions: CustomMigrations = {};
customMigrationFunctions["offchain_documents"] = documentUploader;

(async function () {
  try {
    console.log("generate Project Migration Function...");
    await generateProjectMigrationFunction();
    //console.log("configure Destination Chain...");
    //await configureDestinationChain();
    //console.log("create Migration User");
    //await createMigrationUser();
    console.log("run Migration");
    await runMigration();
    console.log("disable Migration User");
    await disableMigrationUser();
    await listStreams();
  } catch (e) {
    console.log(e);
  }
})();

async function listStreams() {
  console.log(
    "Available streams on src are: ",
    ((await getAllStreams(migrationSource)) || []).map(
      (e: StreamInfo) => e.name
    )
  );

  console.log(
    "Available streams on dest are: ",
    ((await getAllStreams(migrationDestination)) || []).map(
      (e: StreamInfo) => e.name
    )
  );
}

async function generateProjectMigrationFunction() {
  console.log(
    `Get projects of source stream ${ApplicationConfiguration.SOURCE_RPC_HOST}:${ApplicationConfiguration.SOURCE_RPC_PORT} ...`
  );
  const projectIds = await getProjectStreams(migrationSource);
  for (const projectId of projectIds) {
    customMigrationFunctions[projectId] = makeProjectUploader(projectId);
  }
}

async function getProjectStreams(multichain): Promise<string[]> {
  const streams = await getAllStreams(multichain);
  const projects = streams
    .filter((el) => el.details.kind === "project")
    .map((el) => el.name);
  return projects;
}

async function runMigration() {
  try {
    await migrate(
      migrationSource,
      migrationDestination,
      [
        "org:MySlaveOrga",
        "org:KfW",
        "global",
        "groups",
        "users",
        "nodes",
        "notifications",
        "network_log",
        "public_keys",
        "64c3b66979c2faaacf2d933e184fdb5d",
        "296193783a02d11de8a8176c42642c65",
        "6eee060d8c206e0cdeb53de428d40fcd",
        "8ec4dd92d83f976c38760fa4ecacc72f",
        "627a6c8a42c19070ba97b64967724767",
        "84730476ce30e53939fa27f7cd40e9c0",
        "org:DGSI-FINANCE",
        "3ea3eacb71962669de717ac0dca16196",
        "655cb53704df88f8640de14b79db5dab",
        "e0834e4f1fa088265d96e4fbb2a99ec8",
        "f95be23af74edcc67678602aa72d6217",
        "bb3af11d12d1c03b24493b3fbb48cf23",
        "ed4143e258a2be23e9e7c131e3be34b5",
        "b4892ab08e2623d22fd177b2704474f2",
        "52c4369600580e6e053f3632e3dcdbb9",
        "14da9313d00dc531e5b42b008d338f25",
        "f9dac2f75617d675dae452f474724c51",
        "24b180755a2c9dd7d10b81fca9be41bf",
        "c57a89a99f70ea422cb1a527fb2cd8f3",
        "5506bd69340971f1c3280bdc5ea552b8",
        "be0e9ff129d11192fe6baab5dc05c8dc",
        "9accc3cc48e940d8236d861ccbeccc7d",
        "cd611a759d01739f03db167704d8404a",
        "9c31c0e1e0d1abc35bb1ad3120f3adbc",
        "8b223c0554744955d4de8a427c53ac1b",
        "0d813181f662c6941c1045589b39bdb7",
        "19cb727da98b8a4b3b5d58f7283f160f",
        "e83991ed07128fc49810645caeb4b32d",
        "c81335c30a73ef53bb86e164d6ec2bbb",
        "aacdbf52f693a2e2e44efc9018a05278",
        "78c65c46b5d772adb5715135e76fae7a",
        "14aed0fbcf708cb3af1742aef4bbd736",
        "a2b575847ed2515eab8f628a5030ec5c",
        "8d7a6b175f05288d2dbe74ae3f19d3ff",
        "276bc365e48d119e3d828317ce3a1ddc",
        "498a95fe0a4f4679f34eb83a63563c2a",
        "7cccf29a60eef78d6693dc232f80090f",
        "479a98b857d5bfb909e3cb355fe7ef5d",
        "4c57f5ff1507c2b5a606177a53c28ccb",
        "a3be59c5880e12e7ed26f109d90b4c6b",
        "ce513a6326277ec32026cf3acfabf01f",
        "8a1f89a6ecf0edff0cc88fd47bf536fa",
        "07400153e96057b06694087c83765767",
        "44d5e8cff4519d8f6b4c38b7514489fb",
        "2205f27fdfcecce5b05fa3d38cefb75d",
        "bb8492dd90bffe4284ee2c44de061be1",
        "f15672e257567618b225463e5d09386d",
        "350b599bf98a5cfb70b369cf843e1694",
        "366c0f8293369606e07209b1154e29ff",
        "62a87d7807d876f05e8db1e7724cdf3e",
        "e5eec38496c6548562db887a47d8eb14",
        "a43c32de6e672a28feef19f6d10fd0da",
        "7ecf52c3dee8dca7830dad44cbd7bea6",
        "0f4c403c2fb9fd70a2676c78745fe590",
        "3f2405c305b157c59ed2d8aa793b1e75",
        // "offchain_documents",
      ],
      customMigrationFunctions
    );
  } catch (e) {
    throw new Error(e);
  }
}
