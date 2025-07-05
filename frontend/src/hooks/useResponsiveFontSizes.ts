import { useMediaQuery } from "@mui/material";
import { screenSize } from "../constants";

type FontSizes = {
  pageHeading: number;
  sectionTitle: number;
  subSectionTitle: number;
  bodyText: number;
  smallText: number;
};

const useResponsiveFontSizes = (): FontSizes => {
  const isMobile = useMediaQuery(`(max-width:${screenSize.mobile})`);
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);
  const isPcAndAbove = useMediaQuery(`(min-width:${screenSize.pc})`);

  let fontSizes: FontSizes;

  if (isMobile) {
    fontSizes = {
      pageHeading: 22,
      sectionTitle: 18,
      subSectionTitle: 16,
      bodyText: 14,
      smallText: 12,
    };
  } else if (isTablet) {
    fontSizes = {
      pageHeading: 26,
      sectionTitle: 20,
      subSectionTitle: 18,
      bodyText: 16,
      smallText: 14,
    };
  } else if (isPcAndAbove) {
    fontSizes = {
      pageHeading: 32,
      sectionTitle: 24,
      subSectionTitle: 21,
      bodyText: 18,
      smallText: 14,
    };
  } else {
    // Fallback
    fontSizes = {
      pageHeading: 24,
      sectionTitle: 20,
      subSectionTitle: 18,
      bodyText: 16,
      smallText: 14,
    };
  }

  return fontSizes;
};

export default useResponsiveFontSizes;
