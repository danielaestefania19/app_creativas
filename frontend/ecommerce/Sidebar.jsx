import React from "react";
import { Card, Typography, List, ListItem, ListItemPrefix, ListItemSuffix, Chip } from "@material-tailwind/react";
import { PresentationChartBarIcon, ShoppingBagIcon, UserCircleIcon, Cog6ToothIcon, InboxIcon, PowerIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export function DefaultSidebar() {
  return (
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">Sidebar</Typography>
      </div>
      <List>
        <ListItem className="group">
          <ListItemPrefix><PresentationChartBarIcon className="h-5 w-5" /></ListItemPrefix>
          <span className="group-hover:inline">Dashboard</span>
        </ListItem>
        <ListItem className="group">
          <ListItemPrefix><ShoppingBagIcon className="h-5 w-5" /></ListItemPrefix>
          <span className="group-hover:inline">E-Commerce</span>
        </ListItem>
        <ListItem className="group">
          <ListItemPrefix><InboxIcon className="h-5 w-5" /></ListItemPrefix>
          <span className="group-hover:inline">Inbox</span>
          <ListItemSuffix><Chip value="14" size="sm" variant="ghost" color="blue-gray" className="rounded-full" /></ListItemSuffix>
        </ListItem>
        <ListItem className="group">
          <ListItemPrefix><UserCircleIcon className="h-5 w-5" /></ListItemPrefix>
          <span className="group-hover:inline">
            <Link to="/other/profile">Profile</Link>
          </span>
        </ListItem>
        <ListItem className="group">
          <ListItemPrefix><Cog6ToothIcon className="h-5 w-5" /></ListItemPrefix>
          <span className="group-hover:inline">Settings</span>
        </ListItem>
        <ListItem className="group">
          <ListItemPrefix><PowerIcon className="h-5 w-5" /></ListItemPrefix>
          <span className="group-hover:inline">Log Out</span>
        </ListItem>
      </List>
    </Card>
  );
}

