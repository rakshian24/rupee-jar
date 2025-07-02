import { NavLink, useLocation } from "react-router-dom";
import { RiDashboardFill } from "react-icons/ri";
import { ROUTES, colors } from "../../constants";
import { Avatar, ClickAwayListener, Stack } from "@mui/material";
import { getInitials, isStandAloneAndRunningOnIos16 } from "../../utils";
import { User } from "../../context/authContext";
import { useRef, useState } from "react";
import ProfileTab from "../ProfileTab";

const { DASHBOARD, PROFILE } = ROUTES;

const Footer = ({ userInfo }: { userInfo: User | null }) => {
  const { pathname } = useLocation();

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
      alignItems={"center"}
      justifyContent={"space-between"}
      sx={{
        pb: isStandAloneAndRunningOnIos16() ? "55px" : "10px",
        px: "20px",
        pt: "10px",
        borderTop: `1px solid ${colors.lightGrey}`,
      }}
    >
      <NavLink to={DASHBOARD}>
        <RiDashboardFill
          size={30}
          color={pathname === DASHBOARD ? colors.brown : "#D7D8D9"}
        />
      </NavLink>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>
          <Avatar
            sx={{
              width: "32px",
              height: "32px",
              fontSize: "16px",
              fontWeight: 500,
              backgroundColor: pathname === PROFILE ? colors.brown : "#D7D8D9",
            }}
            onClick={handleAvatarClick}
          >
            {getInitials(userInfo?.username)}
          </Avatar>
          <ProfileTab
            open={open}
            anchorEl={anchorEl}
            popperRef={popperRef}
            handleClose={handleClose}
          />
        </div>
      </ClickAwayListener>
    </Stack>
  );
};

export default Footer;
