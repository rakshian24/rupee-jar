import {
  Avatar,
  Paper,
  Popper,
  Stack,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { colors, ROUTES, screenSize } from "../constants";
import { capitalizeFirstLetter, getInitials } from "../utils";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined, PersonOutlined } from "@mui/icons-material";
import client from "../apolloClient";

type Props = {
  open: boolean;
  anchorEl: HTMLElement | null;
  popperRef: React.RefObject<HTMLDivElement>;
  handleClose: () => void;
};

const ProfileTab = ({ open, anchorEl, popperRef, handleClose }: Props) => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  const handleLogout = () => {
    client.clearStore();
    logoutUser();
    navigate(ROUTES.LOGIN);
  };

  return (
    <Popper open={open} anchorEl={anchorEl} placement="bottom-end">
      <Paper
        ref={popperRef}
        sx={{ boxShadow: 3, mt: 1, mb: isTablet ? 1 : 0, width: "290px" }}
      >
        <Stack spacing={1}>
          <Stack gap={1.25} direction={"row"} alignItems={"center"} p={2}>
            <Avatar
              sx={{
                width: "45px",
                height: "45px",
                fontSize: "16px",
                fontWeight: 500,
                backgroundColor: colors.primary,
                color: colors.white,
              }}
            >
              {getInitials(user?.username)}
            </Avatar>
            <Stack>
              <Typography variant="h6" fontSize={15}>
                {capitalizeFirstLetter(user?.username)}
              </Typography>
              <Typography fontSize={14} color={colors.contentTertiary}>
                {user?.email}
              </Typography>
            </Stack>
          </Stack>
          <List
            component="nav"
            sx={{
              p: 0,
              "& .MuiListItemIcon-root": {
                minWidth: 32,
                color: colors.black,
              },
            }}
          >
            <ListItemButton
              onClick={() => {
                navigate(ROUTES.PROFILE);
                handleClose();
              }}
            >
              <ListItemIcon>
                <PersonOutlined />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                handleLogout();
                handleClose();
              }}
            >
              <ListItemIcon>
                <LogoutOutlined />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Stack>
      </Paper>
    </Popper>
  );
};

export default ProfileTab;
