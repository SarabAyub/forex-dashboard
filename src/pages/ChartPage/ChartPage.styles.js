import styled from "@emotion/styled";
import { Container } from "@mui/material";

export const FlexCol = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

export const FlexRow = styled(Container)({
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'center',
});

export const OptionsContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '30px',
    padding: '20px',
    marginTop: '20px',
});



export const StyledContainer = styled(Container)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: '8px',
    boxShadow: theme.shadows[4],
    padding: '20px',
    marginTop: '20px',
    width: '1000px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }));