import { CSSObject, styled, Theme, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SprintView from "../../features/SprintView/SprintView";
import { Task } from "../models/task";
import * as React from 'react';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Navigation from "./Navigation";


/*
  VISUAL NOTES

  Side bar using MUI mini-variant drawer
  List components in 3 wide grid
  Each task in cards
  Cards are ordered by the state of the task item

  App (Contains body) -> SprintView -> TaskStateColumn
*/

function App() {

  
  return (
    <>      
      <Navigation />
    </>
  );
}

export default App;
