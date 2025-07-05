import * as React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import PaletteIcon from '@mui/icons-material/Palette';

const themeActions = [
  { icon: <NightsStayIcon />, name: 'Purple Dark' },
  { icon: <WbTwilightIcon />, name: 'Purple Light' },
  { icon: <WbSunnyIcon />, name: 'Minimalist' },
  { icon: <BlurOnIcon />, name: 'Vibrant Blue' },
];

export default function ThemeSpeedDial({ currentTheme, setTheme }) {
  return (
    <SpeedDial
      ariaLabel="Theme switcher"
      sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2000 }}
      icon={<SpeedDialIcon icon={<PaletteIcon />} openIcon={<PaletteIcon />} />}
      direction="up"
    >
      {themeActions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen
          onClick={() => setTheme(action.name)}
          FabProps={{
            color: currentTheme === action.name ? 'primary' : 'default',
            size: 'medium',
            sx: {
              border: currentTheme === action.name ? '2px solid #1976d2' : undefined,
            },
          }}
        />
      ))}
    </SpeedDial>
  );
} 