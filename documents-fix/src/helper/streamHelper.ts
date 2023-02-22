const getOrganizationStreamName = (organization: string): string => {
  return streamName(organization, "org");
};

function streamName(organization: string, prefix: string): string {
  let name = `${prefix}:${organization}`.replace(/ /g, "_").substring(0, 16);
  while (Buffer.byteLength(name) > 16) {
    name = name.substring(0, name.length - 1);
  }
  return name;
}

export { getOrganizationStreamName };
