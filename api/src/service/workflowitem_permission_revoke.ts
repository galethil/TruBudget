import logger from "lib/logger";
import { VError } from "verror";
import Intent from "../authz/intents";
import { Ctx } from "../lib/ctx";
import * as Result from "../result";
import * as Cache from "./cache2";
import { ConnToken } from "./conn";
import { Identity } from "./domain/organization/identity";
import { ServiceUser } from "./domain/organization/service_user";
import * as Project from "./domain/workflow/project";
import * as Subproject from "./domain/workflow/subproject";
import * as Workflowitem from "./domain/workflow/workflowitem";
import * as WorkflowitemPermissionRevoke from "./domain/workflow/workflowitem_permission_revoke";
import { store } from "./store";

export { RequestData } from "./domain/workflow/project_create";

export async function revokeWorkflowitemPermission(
  conn: ConnToken,
  ctx: Ctx,
  serviceUser: ServiceUser,
  projectId: Project.Id,
  subprojectId: Subproject.Id,
  workflowitemId: Workflowitem.Id,
  revokee: Identity,
  intent: Intent,
): Promise<Result.Type<void>> {
  logger.debug(
    { revokee, intent, projectId, subprojectId, workflowitemId },
    "Revoking workflowitem permission",
  );

  const newEventsResult = await Cache.withCache(conn, ctx, async (cache) =>
    WorkflowitemPermissionRevoke.revokeWorkflowitemPermission(
      ctx,
      serviceUser,
      projectId,
      subprojectId,
      workflowitemId,
      revokee,
      intent,
      {
        getWorkflowitem: async (pId, spId, wId) => {
          return cache.getWorkflowitem(pId, spId, wId);
        },
      },
    ),
  );

  if (Result.isErr(newEventsResult)) {
    return new VError(newEventsResult, "close project failed");
  }

  const newEvents = newEventsResult;

  for (const event of newEvents) {
    await store(conn, ctx, event, serviceUser.address);
  }
}
