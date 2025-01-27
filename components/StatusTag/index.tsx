import COLORS from '@/styles/colors';
import {
  CalendarIcon,
  GreenDotOperationalIcon,
  GreyDotInProgressIcon,
} from '../../assets/Status-Tag-Icons/icons';
import { TagText1 } from '../../styles/texts';
import { AllTagStyles, CODTagStyles, TagStyle } from './styles';

export default function StatusTag({
  projectStatus,
  cod,
}: {
  projectStatus: string;
  cod: Date | undefined;
}) {
  function convertDateToString() {
    if (!cod) return '';
    const res = new Date(cod);
    const year = String(res.getFullYear()).slice(-2);
    const month = String(res.getMonth() + 1).padStart(2, '0');
    const day = String(res.getDate()).padStart(2, '0');
    return `${month}.${day}.${year}`;
  }

  const statusIcon: { [key: string]: JSX.Element } = {
    Operational: <GreenDotOperationalIcon />,
    Proposed: <GreyDotInProgressIcon />,
  };
  const statusTextColor: { [key: string]: string } = {
    Operational: COLORS.aceGreen,
    Proposed: COLORS.ashGrey,
  };

  return (
    <div>
      {cod ? (
        <AllTagStyles>
          <TagStyle $color={statusTextColor[projectStatus]}>
            {statusIcon[projectStatus]}{' '}
            <TagText1 $color={statusTextColor[projectStatus]}>
              {projectStatus}
            </TagText1>
          </TagStyle>
          <CODTagStyles>
            <CalendarIcon />
            <TagText1 $color={COLORS.electricBlue}>
              COD {convertDateToString()}
            </TagText1>
          </CODTagStyles>
        </AllTagStyles>
      ) : (
        <TagStyle $color={statusTextColor[projectStatus]}>
          {statusIcon[projectStatus]}{' '}
          <TagText1 $color={statusTextColor[projectStatus]}>
            {projectStatus}
          </TagText1>
        </TagStyle>
      )}
    </div>
  );
}
