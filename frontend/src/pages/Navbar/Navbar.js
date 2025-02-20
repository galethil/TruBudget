import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import React from "react";

import LeftNavbarNavigation from "./LeftNavbarNavigation";
import MainNavbarNavigation from "./MainNavbarNavigation";
import RightNavbarNavigation from "./RightNavbarNavigation";
import SideNav from "./SideNav";

const Navbar = ({
  toggleSidebar,
  numberOfActivePeers,
  peers,
  unreadNotificationCount,
  showSidebar,
  history,
  route,
  logout,
  displayName,
  organization,
  avatar,
  avatarBackground,
  currentProject,
  currentSubProject,
  allowedIntents,
  groups,
  userId,
  createBackup,
  restoreBackup,
  versions,
  exportData,
  storeSearchTerm,
  searchTerm,
  storeSearchBarDisplayed,
  searchBarDisplayed,
  showUserProfile,
  fetchEmailAddress,
  projectView,
  ...props
}) => {
  return (
    <div>
      <AppBar
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none"
        }}
        position="absolute"
      >
        <Toolbar id="back-to-top">
          <LeftNavbarNavigation toggleSidebar={toggleSidebar} />
          <MainNavbarNavigation
            history={history}
            route={route}
            currentProject={currentProject}
            currentSubProject={currentSubProject}
            storeSearchBarDisplayed={storeSearchBarDisplayed}
            storeSearchTerm={storeSearchTerm}
          />
          <RightNavbarNavigation
            organization={organization}
            unreadNotificationCount={unreadNotificationCount}
            numberOfActivePeers={numberOfActivePeers}
            peers={peers}
            history={history}
            logout={logout}
            storeSearchTerm={storeSearchTerm}
            storeSearchBarDisplayed={storeSearchBarDisplayed}
            searchTerm={searchTerm}
            searchBarDisplayed={searchBarDisplayed}
            projectView={projectView}
          />
        </Toolbar>
      </AppBar>
      <SideNav
        toggleSidebar={toggleSidebar}
        showSidebar={showSidebar}
        history={history}
        logout={logout}
        allowedIntents={allowedIntents}
        displayName={displayName}
        organization={organization}
        avatar={avatar}
        avatarBackground={avatarBackground}
        groups={groups}
        userId={userId}
        createBackup={createBackup}
        restoreBackup={restoreBackup}
        exportData={exportData}
        showUserProfile={showUserProfile}
        fetchEmailAddress={fetchEmailAddress}
        {...props}
      />
    </div>
  );
};

export default Navbar;
