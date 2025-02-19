const en = {
  format: {
    currencyPositon: "%s %v",
    numberFormat: {
      decimal: ".",
      thousand: ",",
      precision: 2
    },
    dateFormat: "DD/MM/YYYY",
    datePlaceholder: "dd/mm/yyyy",
    // numberRegex describes values with "." as decimal separator (matches e.g. 1000; 1,000; 1000.00; 1,000.00)
    numberRegex: /^([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(\.[0-9]+)?$/
  },
  common: {
    action: "Action",
    actions: "Actions",
    add_tag_text: "Add tag to project",
    add: "Add",
    added: "Added",
    additional_data: "Additional Data",
    amount: "Amount",
    approver: "Approver",
    assign: "assign",
    assigned_budget: "Assigned Budget",
    assigned: "Assigned",
    assignees: "Assignee(s)",
    back: "Back",
    bank: "Bank",
    budget_distribution: "Budget distribution",
    budget: "Budget",
    cancel: "Cancel",
    close: "Close",
    closed: "Closed",
    comment_description: "Add some comments",
    comment: "Comment",
    completion: "Completion",
    confirm: "Confirm",
    create: "Create",
    created: "Created",
    currency: "Currency",
    disbursed_budget: "Paid Budget",
    disbursement: "Projected",
    disconnected: "Offline",
    display_name: "Display Name",
    done: "Done",
    download: "Download",
    edit: "Edit",
    edited: "Edited",
    email: "Email",
    finish: "Finish",
    global: "global",
    grant: "grant",
    hash: "Hash",
    history_end: "Last event reached",
    history: "History",
    workflowitem_history: "Workflowitem history",
    subproject_history: "Subproject history",
    project_history: "Project history",
    id: "Id",
    in_progress: "In Progress",
    in_review: "In Review",
    incorrect_password: "Incorrect password",
    incorrect_username: "Incorrect login ID",
    incorrect_username_or_password: "Incorrect login ID or password",
    invalid_tag: "Invalid tag",
    invalid_format: "Invalid format",
    name: "Name",
    next: "Next",
    no_budget: "No budget found",
    no_budget_project: "To add a budget for your project, navigate back to the main page.",
    no_budget_subproject: "To add a budget for your subproject, navigate back to the subproject overview page.",
    no_budget_distribution: "Unable to display distribution if not all items are visible",
    no_disabled_users: "No deactivated users found",
    no_groups: "No groups found",
    no_groups_text: "Create a new group by pressing the plus button.",
    no_history: "No events",
    no_items_text: "You can create one by pressing the plus button.",
    no_documents: "No documents found",
    no_documents_upload_text: "You can add one by pressing the upload button",
    no_documents_info_text: "You can edit the workflowitem to add documents",
    no_nodes: "No requests for additonal nodes found",
    no_notifications: "No notifications found",
    no_organizations: "No requests for new organizations found",
    no_resources: "No fields were added to this Resource",
    no_subprojects: "No subprojects found",
    no_users: "No users found",
    no_users_text: "Add a new user by pressing the plus button.",
    no_workflow_items: "No workflowitems found",
    not_assigned_budget: "Not Assigned Budget",
    not_assigned: "Not assigned",
    not_disbursed: "Not paid",
    not_ok: "Not OK",
    ok: "Ok",
    not_projected: "Not projected",
    open: "Open",
    organization: "Organization",
    password: "Password",
    permission: "Permission",
    project: "Project",
    projected_budget_exists: "Projected budget already exists",
    projected_budget: "Projected Budget",
    redacted: "Redacted",
    reset: "Reset",
    revoke: "revoke",
    reject: "Reject",
    rejected: "Rejected",
    search: "Search",
    show_permissions: "Show Permissions",
    status: "Status",
    submit: "Submit",
    subproject: "Subproject",
    subprojects: "Subprojects",
    tag_already_exists: "Tag already exists!",
    tag: "Tag",
    task_status: "Task status",
    thumbnail: "Thumbnail",
    total_budget: "Total Budget",
    type: "Type",
    update: "Update",
    username: "Login ID",
    view: "View",
    workflowitem: "Workflowitem",
    dueDate: "Due date",
    dueDate_exceeded: "Due date exceeded",
    login_disabled: "Login ID is disabled",
    login_data_error: "Login ID or password field cannot be empty",
    login_proxy_error: "Connection to the API could not be established! Please check proxy settings!",
    login_api_error: "API is not reachable, please make sure it is running!",
    refresh_assignments: "Refresh assignments",
    tags: "Tags",
    all: "all",
    assignee: "Assignee"
  },

  users: {
    account_name: "Account Name",
    add_group: "Add Group",
    add_user: "Add User",
    change_password_for: "Change password for {0}",
    current_user_password: "Your password",
    edit_group: "Edit Group",
    edit_permissions_for: "Edit permissions for",
    group_created: "Group successfully created",
    groups: "Groups",
    invalid_password: "Password invalid",
    new_group: "New Group",
    new_user_password_confirmation: "Confirm new password",
    new_user_password: "New password",
    new_user: "New User",
    no_password_match: "Passwords don't match",
    password_change_success: "Password successfully changed",
    password_conditions_length: "Be at least 8 characters long",
    password_conditions_letter: "Contain at least one letter",
    password_conditions_number: "Contain at least one number",
    password_conditions_preface: "Your password must:",
    privacy_notice:
      "Please make sure to not provide any personal information. By clicking SUBMIT your data is permanently saved and you hereby confirm the receipt of the privacy notice.",
    type_current_password: "Type in current password for {0}",
    type_new_password: "Type in new password for {0}",
    user_created: "User successfully created",
    username_invalid: "Invalid login ID",
    users: "Users",
    selected_users: "selected users",
    disabled_users: "Disabled users",
    disable_user: "Disable user",
    disable_userId: "Disable user {0}",
    disable_user_successfull: "The following user has been disabled: ",
    enable_user: "Restore user",
    enable_userId: "Restore user {0}",
    enable_userId_confirm: "Do you really want to enable user {0}?",
    enable_user_successfull: "The following user has been enabled: ",
    no_assignments: "No assignments",
    assigned_projects: "Assigned projects",
    assigned_subprojects: "Assigned subprojects",
    assigned_workflowitems: "Assigned workflowitems",
    assigned_message: "Before disabling, this user has to be unassigned from following elements",
    not_assigned_message: "This user is not assigned to any project, subproject and workflowitem and can be disabled",
    hidden_assignments: "Further redacted {0}"
  },

  userProfile: {
    invalid_email_address: "Invalid email address"
  },

  nodesDashboard: {
    access: "Access",
    additional_organization_node: "Requests for Additional Nodes",
    address: "Address",
    approve: "Approve",
    decline: "Decline",
    network: "Network",
    new_organization: "Requests for New Organizations",
    nodes: "Nodes",
    permissions: "Permissions",
    declined_by: "Declined by",
    connection_status: "Connection status",
    last_seen: "Last seen",
    admin_description:
      "The admin node is the initial node of the network and has additional 'mine' and 'admin' permissions"
  },

  login: {
    environment: "Environment",
    loading: "Loading ...",
    login_button_title: "Login",
    production_env: "Prod",
    test_env: "Test",
    frontend_name: "TruBudget",
    frontend_description: "A blockchain-based solution for budget expenditure"
  },

  project: {
    add_new_project: "Add new project",
    assignee: "Owner",
    project_budget_amount: "Project budget amount",
    project_budget: "Budget",
    project_close_info: "At least one subproject item has not been closed yet.",
    project_comment: "Comment",
    project_currency: "Project currency",
    project_details: "Details",
    project_edit_title: "Edit Project",
    project_name: "Name",

    project_roles: "Roles",
    project_thumbnail: "Thumbnail",
    project_title_description: "Name of the project",
    project_title: "Project title",
    project_searchtext: "Search projects"
  },

  subproject: {
    assignee: "Owner",
    fixed_workflowitem_type: "Fixed workflowitem type",
    subproject_add_title: "Add new subproject",
    subproject_assigned_organization: "Assigned organization",
    subproject_budget_amount: "Subproject  budget amount",
    subproject_close_info: "At least one workflowitem has not been closed yet",
    subproject_close_not_allowed: "You are not allowed to close the subproject",
    subproject_comment: "Subproject comment",
    subproject_completion_string: "{0} of {1} done",
    subproject_currency: "Subproject currency",
    subproject_edit_title: "Edit subproject",

    subproject_preview: "Subproject preview",
    subproject_select_button: "Select",
    subproject_title_description: "Name of the subproject",
    subproject_title: "Subproject title",
    subproject_searchtext: "Search subprojects",
    subproject_any_workflowitem_type: "Allow workflowitems to select general or restricted type",
    subproject_general_workflowitem_type: "Only allow workflowitems of type general",
    subproject_restricted_workflowitem_type:
      "Only allow workflowitem of type restricted. When assigning a restricted workflowitem permissions are automatically granted and revoked. The assigner will only keep the view permissions.",
    workflowitem_assignee: "Default assignee"
  },

  workflow: {
    add_item: "Create workflowitem",
    approval_required: "Approval required",
    assignee: "Assignee",
    edit_item: "Edit workflowitem",
    exchange_rate: "Exchange rate",

    workflow_budget_allocated: "allocated",

    workflow_budget_disbursed: "paid",
    workflow_budget_na: "Not applicable",
    workflow_budget_status_allocated: "Assigned",
    workflow_budget_status_disbursed: "Paid",
    workflow_budget_status_na: "N/A",
    workflow_budget: "Budget amount",
    workflow_comment: "Workflowitem comment",
    workflow_disable_sort: "Save",
    workflow_document_changed: "Changed",
    workflow_document_description: "Add name of document",
    workflow_document_not_available: "Document is not available",
    workflow_document_name: "Document Name",
    workflow_document_validate: "Validate",
    workflow_document_validated: "Validated",
    workflow_document_validation_ok: "Identical document",
    workflow_document_validation_not_ok: "Different document",
    workflow_documents: "Documents",
    workflow_enable_sort: "Sort",
    workflow_fingerprint: "Fingerprint",
    workflow_name: "Name",
    workflow_next_step: "Next step",
    workflow_no_actions: "No actions required",
    workflow_no_documents: "No documents",
    workflow_none: "None",
    workflow_permissions_title: "Set permissions for workflowitem",
    workflow_redacted: "Redacted",
    workflow_selection: "{0} workflowitems are selected",
    workflow_submit_for_review: "Submit for Review",
    workflow_table_title: "Workflowitems",
    workflow_title_description: "Name of the workflowitem",
    workflow_title: "Workflow title",
    workflow_type_transaction: "Transaction",
    workflow_type_workflow: "Workflow",
    workflow_type: "Type",
    workflow_upload_document: "Upload",
    workflowitem_details_documents: "Documents",
    workflowitem_details_history: "History",
    workflowitem_details_overview: "Overview",
    workflowitem_details: "Workflowitem details",
    workflowitem_type: "Workflowitem type",
    workflowitem_type_general: "Create a workflowitem of type general.",
    workflowitem_type_restricted:
      "When assigning a restricted workflowitem permissions are automatically granted and revoked. The assigner will only keep the view permissions.",
    workflow_reject_reason: "Reject reason"
  },

  snackbar: {
    update_succeed_message: "Successfully modified {0}",
    creation_succeed_message: "Successfully created {0}",
    permissions_warning: "No permissions allocated for {0}"
  },

  searchBar: {
    quick_search: "Quick search"
  },

  preview: {
    actions_done: "{0} from {1} actions done",
    assign_action_text: "assign {0}",
    grant_permission_action_text: "grant {0} to {1}",
    not_possible_action: "Not possible actions",
    possible_action: "Possible actions",
    preview: "Preview",
    revoke_permission_action_text: "revoke {0} from {1}",
    overwrite: "overwrite",
    overwrite_warning:
      "Warning: This resets all permissions to the current selection. If you want to add or remove only some permissions, you have to go to each workflowitem's permission dialog instead."
  },

  confirmation: {
    assign_permissions: "Assign permissions",
    additional_permissions_dialog_text:
      "Additional actions must be executed to ensure users are also able to view all required resources.",
    confirmation_required: "Confirmation required",
    execute_actions: "Execute Actions",
    failed_action_error:
      "Error: Grant {0} to {1} failed. All actions that would have been executed after the error occured including the original actions are cancelled.",
    grant_and_assign: "Grant & Assign",
    list_permissions_required_text: "Make sure you have required list Permissions for all resources involved",
    no_permission_warning: "You need following permissions in order to execute all requested actions:",
    no_permission_help: "Following Users are permitted to grant you permissions on the needed Resources:",
    original_actions: "You requested the following actions:",
    permissions_required: "Permissions required",
    permissions_text: `{0} needs additional permissions to view {1} "{2}".`,
    post_actions_dialog_text: "After creation following actions are executed",
    project_close: "Close project",
    project_close_text: "Are you sure, you want to close this project?",
    subproject_close: "Close subproject",
    subproject_close_text: "Are you sure, you want to close this subproject?",
    user_group: "User/Group",
    workflowitem_close: "Close workflowitem",
    workflowitem_close_text: "Do you want to accept and close this workflowitem?",
    workflowitem_close_reject: "Reject with comment",
    workflowitem_create: "Create workflowitem",
    workflowitem_close_accept: "Accept"
  },

  intents: {
    assign: "assign",
    close: "close",
    createSubproject: "create Subprojects",
    createWorkflowitem: "create Workflowitems",
    grantPermission: "grant permissions",
    listPermissions: "view permissions",
    reorderWorkflowitems: "reorder Workflowitems",
    revokePermission: "revoke permissions",
    update: "update",
    viewDetails: "view details",
    viewHistory: "view history",
    list: "view summary"
  },

  analytics: {
    assigned_budget_ratio: "Assigned Budget Ratio",
    available_unspent_budget: "Available Unspent Budget",
    converted_amount: "Converted Amount",
    disbursed_budget_ratio: "Paid Budget Ratio",
    insufficient_permissions_text:
      "One or more workflowitem are redacted. The analytics are hidden because they would be falsified.",
    project_analytics: "Project Analytics",
    projected_budget_ratio: "Projected Budget Ratio",
    projected_budgets_distribution: "Projected Budgets Distribution",
    subproject_analytics: "Subproject Analytics",
    total_budget_distribution: "Total Budget Distribution",
    total: "Total:"
  },

  navigation: {
    admin_permission: "Admin",
    backup: "Backup",
    connected_peers: "Peers connected",
    disconnected_peers: "No Peers connected",
    logout: "Logout",
    main_site: "Main",
    menu_item_export: "Export",
    menu_item_network: "Network",
    menu_item_notifications: "Notifications",
    menu_item_projects: "Projects",
    menu_item_users: "Users",
    no_peers: "No peers",
    options: "Options",
    peers: "Peers",
    projects_site: "Projects",
    restore: "Restore",
    rtUpdates: "Real-Time Updates",
    selections: "Selections",
    service_status: "Service Status",
    unread_notifications: "Unread Notifications",
    write_permission: "Write"
  },

  notification: {
    create_transaction: "Transaction {0} created ",
    create_workflow: "Workflow {0} created ",
    done_transaction: "Status of transaction {0} set to Done",
    done_workflow: "Status of workflow {0} set to Done",
    edit_transaction: "Transaction {0} got adapted",
    edit_workflow: "Workflowitem {0} got adapted",
    email_saved: "Email {0} saved",
    next_page: "Next page",
    no_permissions: "(No permissions to see further details)",
    notification_subtitle: "Unread",
    notification_table_all_read: "all read",
    notification_table_by: "By",
    notification_table_description: "Description",
    notification_table_project: "Project",
    notification_table_role: "Role",
    notification_table_subproject: "Subproject",
    notification_table_view: "View",
    notification_title: "Notifications",
    previous_page: "Previous page",
    project_assign: "Project {0} was assigned to you",
    project_assigned: "Project {0} was assigned to you",
    project_close: "Project {0} was closed",
    project_closed: "Project {0} was closed",
    project_createSubproject: "A new subproject was created for project {0}",
    project_intent_grantPermission: "The permissions for project {0} changed",
    project_intent_revokePermission: "The permissions for project {0} changed",
    project_projected_budget_deleted: "Projected budget of project {0} was deleted",
    project_projected_budget_updated: "Projected budget of project {0} was updated",
    project_update: "Project {0} was updated",
    project_updated: "Project {0} was updated",
    read_all: "Read All",
    review_transaction: "You are assigned to review the transaction {0}",
    review_workflow: "You are assigned to review the workflowitem {0}",
    rows_per_page: "Rows per page",
    save_email_error: "Couldn't save email",
    subproject_assign: "Subproject {0} was assigned to you",
    subproject_assigned: "Subproject {0} was assigned to you",
    subproject_close: "Subproject {0} was closed",
    subproject_closed: "Subproject {0} was closed",
    subproject_createWorkflowitem: "A new workflowitem was created for subproject {0}",
    subproject_intent_grantPermission: "The permissions for subproject {0} changed",
    subproject_intent_revokePermission: "The permissions for subproject {0} changed",
    subproject_projected_budget_deleted: "Projected budget of subproject {0} was deleted",
    subproject_projected_budget_updated: "Projected budget of subproject {0} was updated",
    subproject_reorderWorkflowitems: "The workflowitems of subproject {0} were reordered",
    subproject_update: "Subproject {0} was updated",
    subproject_updated: "Subproject {0} was updated",
    workflowitem_assign: "Workflowitem {0} was assigned to you",
    workflowitem_assigned: "Workflowitem {0} was assigned to you",
    workflowitem_close: "Workflowitem {0} was closed",
    workflowitem_closed: "Workflowitem {0} was closed",
    workflowitem_intent_grantPermission: "The permissions for workflowitem {0} changed",
    workflowitem_intent_revokePermission: "The permissions for workflowitem {0} changed",
    workflowitem_update: "Workflowitem {0} was updated",
    workflowitem_updated: "Workflowitem {0} was updated",
    payload_error_message:
      "Oops!...Its not your fault - A client side validation error occured. Please inform the administrator."
  },

  history: {
    edit_currency: "Currency of workflowitem {0} changed to {1} ",
    edit_documents: "Documents changed for workflowitem {0}",
    edit_status: "Status of workflowitem {0} changed to {1}",
    edit_subproject: "Amount of {0} increased to {1}",
    edit_workflowName: "Name of workflowitem {0} changed to {1} ",
    end_date: "End date",
    event_type: "Event type",
    first_sort: "Moved {0} to first position",
    project_assign: "{0} assigned project {1} to {2}",
    project_close: "{0} closed project {1}",
    project_create: "{0} created project {1}",
    project_createSubproject: "{0} created subproject {1}",
    project_grantPermission_details: "{0} granted permission {1} to {2} on {3}",
    project_grantPermission: "{0} granted permission {1} to {2}",
    project_projected_budget_deleted: "{0} deleted the projected budget of {1}",
    project_projected_budget_updated: "{0} updated the projected budget of {1}",
    project_revokePermission_details: "{0} revoked permission {1} from {2} on {3}",
    project_revokePermission: "{0} revoked permission {1} from {2}",
    project_update: "{0} changed project {1} ",
    publisher: "Publisher",
    sort: "Moved {0} after {1}",
    start_date: "Start date",
    subproject_assign: "{0} assigned subproject {1} to {2}",
    subproject_close: "{0} closed subproject {1}",
    subproject_create: "{0} created subproject {1}",
    subproject_createWorkflowitem: "{0} created workflowitem {1}",
    subproject_grantPermission_details: "{0} granted permission {1} to {2} on {3}",
    subproject_grantPermission: "{0} granted permission {1} to {2}",
    subproject_reorderWorkflowitems: "{0} changed the workflowitem ordering from {1}",
    subproject_revokePermission_details: "{0} revoked permission {1} from {2} on {3}",
    subproject_revokePermission: "{0} revoked permission {1} from {2}",
    subproject_update: "{0} changed subproject {1} ",
    to: "{0} to {1}",
    workflowitem_assign: "{0} assigned workflowitem {1} to {2}",
    workflowitem_close: "{0} closed workflowitem {1}",
    workflowitem_grantPermission_details: "{0} granted permission {1} to {2} on {3}",
    workflowitem_grantPermission: "{0} granted permission {1} to {2}",
    workflowitem_revokePermission_details: "{0} revoked permission {1} from {2} on {3}",
    workflowitem_revokePermission: "{0} revoked permission {1} from {2}",
    workflowitem_update_docs: "{0} added documents to workflowitem {1} ",
    workflowitem_update: "{0} changed workflowitem {1} ",
    workflowitem_update_amount: "{0} changed workflowitem {1} budget in {2} ",
    workflowitem_document_validated: "{0} validated workflowitem document named {1} in {2} ",
    workflowitem_document_invalidated:
      "{0} used different document in workflowitem to validate document named with  {1} in {2} "
  },

  permissions: {
    admin: "Admin permissions",
    dialog_title: "Set permissions for {0}",
    global_createGroup: "Create groups",
    global_createProject: "Create projects",
    global_createUser: "Create users",
    global_disableUser: "Disable users",
    global_enableUser: "Enable users",
    global_grantPermission: "Grant global permissions for others",
    global_listPermissions: "List all global permissions",
    global_revokePermission: "Revoke global permissions for others",
    network_list: "List all connected nodes",
    network_voteForPermission: "Vote if a node should join the network",
    project_assign: "Assign project to others",
    project_close: "Close project",
    project_createSubproject: "Create subprojects",
    project_intent_grantPermission: "Grant project permissions",
    project_intent_listPermissions: "View project permissions",
    project_intent_revokePermission: "Revoke project permissions",
    project_update: "Update project",
    project_viewDetails: "View project details",
    project_list: "View project in overview",
    read_only: "Read-only permissions",
    subproject_assign: "Assign subproject",
    subproject_close: "Close subproject",
    subproject_createWorkflowitem: "Create workflowitems",
    subproject_intent_grantPermission: "Grant subproject permissions",
    subproject_intent_listPermissions: "View subproject permissions",
    subproject_intent_revokePermission: "Revoke subproject permissions",
    subproject_reorderWorkflowitems: "Reorder workflowitems",
    subproject_update: "Update subproject",
    subproject_viewDetails: "View subproject details",
    subproject_list: "View subproject overview",
    view: "View permissions",
    workflowitem_assign: "Assign workflowitem",
    workflowitem_close: "Close workflowitem",
    workflowitem_intent_grantPermission: "Grant workflowitem permission",
    workflowitem_intent_listPermissions: "View workflowitem permissions",
    workflowitem_intent_revokePermission: "Revoke workflowitem permission",
    workflowitem_update: "Update workflowitem",
    workflowitem_view: "View workflowitem",
    write: "Write permissions"
  },

  eventTypes: {
    project_created: "Project created",
    project_updated: "Project updated",
    project_assigned: "Project assigned",
    project_closed: "Project closed",
    project_permission_granted: "Project permission granted",
    project_permission_revoked: "Project permission revoked",
    project_projected_budget_updated: "Project budget updated",
    project_projected_budget_deleted: "Project budget closed",

    subproject_created: "Subproject created",
    subproject_updated: "Subproject updated",
    subproject_assigned: "Subproject assigned",
    subproject_closed: "Subproject closed ",
    subproject_permission_granted: "Subproject permission granted",
    subproject_permission_revoked: "Subproject permission revoked",
    subproject_projected_budget_updated: "Subproject budget updated",
    subproject_projected_budget_deleted: "Subproject budget closed",

    workflowitem_created: "Workflowitem created",
    workflowitem_document_validated: "Workflowitem document validated",
    workflowitem_updated: "Workflowitem updated",
    workflowitem_assigned: "Workflowitem assigned",
    workflowitem_closed: "Workflowitem closed",
    workflowitem_permission_granted: "Workflowitem permission granted",
    workflowitem_permission_revoked: "Workflowitem permission revoked",
    workflowitems_reordered: "Workflowitems reordered"
  },

  status: {
    average: "average",
    connection: "Connection",
    fast: "fast",
    no_ping_available: "no ping available",
    not_connected: "not connected",
    ping: "Ping",
    service: "Service",
    slow: "slow",
    version: "Version",
    very_slow: "very slow",
    error: "Error",
    warning: "Warning",
    done: "Done",
    toBeDone: "To Be Done"
  },

  language: {
    english: "English",
    french: "French",
    german: "German",
    portuguese: "Portuguese",
    georgian: "Georgian"
  }
};

export default en;
