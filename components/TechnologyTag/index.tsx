import {
  EnergyStorageIcon,
  GeothermalIcon,
  HydroelectricIcon,
  LandBasedWindIcon,
  OffshoreWindIcon,
  PumpedStorageIcon,
  SolarPvIcon,
} from '../../assets/Technology-Tag-Icons/icons';
import COLORS from '../../styles/colors';
import { TagText1 } from '../../styles/texts';
import { TechnologyTagStyles } from './styles';

export default function TechnologyTag({
  technology,
}: {
  technology: string | undefined;
}) {
  const iconMap: { [key: string]: JSX.Element } = {
    'Offshore Wind': (
      <OffshoreWindIcon
        fill={COLORS.electricBlue}
        stroke={COLORS.navy}
        width={'9'}
        height={'11'}
      />
    ),
    'Energy Storage': (
      <EnergyStorageIcon
        fill={COLORS.teal}
        stroke={COLORS.white}
        width={'13'}
        height={'9'}
      />
    ),
    Geothermal: (
      <GeothermalIcon fill={COLORS.earthyGreen} width={'9'} height={'9'} />
    ),
    Hydroelectric: (
      <HydroelectricIcon fill={COLORS.frenchBlue} width={'12'} height={'9'} />
    ),
    'Land-Based Wind': (
      <LandBasedWindIcon fill={COLORS.skyBlue} width={'8'} height={'11'} />
    ),
    'Pumped Storage': (
      <PumpedStorageIcon fill={COLORS.cyanBlue} width={'12'} height={'9'} />
    ),
    'Solar PV': (
      <SolarPvIcon fill={COLORS.solarYellow} width={'10'} height={'9'} />
    ),
  };

  const icon = technology ? iconMap[technology] : null;

  return (
    <div>
      {icon && (
        <TechnologyTagStyles>
          {icon} <TagText1>{technology}</TagText1>
        </TechnologyTagStyles>
      )}
    </div>
  );
}