import React, { useState, useRef } from "react";
import {
  Avatar,
  Box,
  Stack,
  ClickAwayListener,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { APP_NAME, colors } from "../constants";
import { getInitials } from "../utils";
import ProfileTab from "./ProfileTab";
import logo from "../assets/pngs/logo.png";

const Header = () => {
  const { user } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    if (popperRef.current && popperRef.current.contains(event.target as Node)) {
      return;
    }
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{
        px: 2,
        py: 2,
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px;",
        position: "sticky",
        bgcolor: colors.white,
      }}
    >
      <Link to={"/"}>
        <Box>
          <Box display="flex" alignItems="center" gap={1}>
            <img src={logo} alt="logo" width={28} />
            <Typography
              fontWeight="500"
              color={colors.primary}
              fontSize={"20px"}
            >
              {APP_NAME}
            </Typography>
          </Box>
        </Box>
      </Link>
      {user?.userId && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <div>
            <Avatar
              sx={{
                width: "40px",
                height: "40px",
                fontSize: "16px",
                fontWeight: 500,
                backgroundColor: colors.primary,
                color: colors.white,
                cursor: "pointer",
              }}
              onClick={handleAvatarClick}
            >
              {getInitials(user.username)}
            </Avatar>
            <ProfileTab
              open={open}
              anchorEl={anchorEl}
              popperRef={popperRef}
              handleClose={handleClose}
            />
          </div>
        </ClickAwayListener>
      )}
    </Stack>
  );
};

export default Header;
