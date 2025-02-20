import { config } from "../config";
import { HttpResponse } from "../httpd/lib";
import { MultichainClient } from "../service/Client.h";
import StorageServiceClient from "../service/Client_storage_service";
import { Version } from "../service/Client_storage_service.h";
import BlockchainApi from "./blockchainApi";

interface VersionMetadata {
  release?: string;
  ping?: number;
  commit?: string;
  buildTimeStamp?: string;
}

const blockchainApi = new BlockchainApi();

const bcVersionMetaData = async (blockchainHost, blockchainPort): Promise<VersionMetadata> => {
  blockchainApi.setBaseUrl(`http://${blockchainHost}:${blockchainPort}`);
  const { data } = await blockchainApi.fetchVersion();
  return data;
};

const apiVersionMetaData = () => {
  const metaData: VersionMetadata = {
    release: config.npmPackageVersion,
    commit: config.ciCommitSha,
    buildTimeStamp: config.buildTimeStamp,
  };
  return metaData;
};

const multichainVersionMetaData = async (
  multichainClient: MultichainClient,
): Promise<VersionMetadata> => {
  const { version, ping } = await multichainClient.getInfo();
  return {
    release: version,
    ping,
  };
};

const storageServiceMetaData = async (
  storageServiceClient: StorageServiceClient,
): Promise<Version> => storageServiceClient.getVersion();

export const getVersion = async (
  blockchainHost: string,
  blockchainPort: number,
  multichainClient: MultichainClient,
  storageServiceClient: StorageServiceClient,
): Promise<HttpResponse> => {
  if (config.documentFeatureEnabled) {
    return [
      200,
      {
        apiVersion: "1.0",
        data: {
          api: apiVersionMetaData(),
          blockchain: await bcVersionMetaData(blockchainHost, blockchainPort),
          multichain: await multichainVersionMetaData(multichainClient),
          storage: await storageServiceMetaData(storageServiceClient),
        },
      },
    ];
  }
  return [
    200,
    {
      apiVersion: "1.0",
      data: {
        api: apiVersionMetaData(),
        blockchain: await bcVersionMetaData(blockchainHost, blockchainPort),
        multichain: await multichainVersionMetaData(multichainClient),
      },
    },
  ];
};
