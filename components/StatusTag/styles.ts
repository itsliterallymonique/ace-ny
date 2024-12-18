import styled from 'styled-components';

const BaseTagStyles = styled.div`
  border-radius: 6.25rem;
  border: 0.031rem solid rgba(46, 58, 89, 0.25);
  display: inline-flex;
  height: 1.375rem;
  padding: 0.1rem 0.625rem;
  align-items: center;
  flex-direction: row;
  gap: 0.25rem;
`;

export const StatusTagStyles = styled(BaseTagStyles)``;

export const ProposedCODTagStyles = styled(BaseTagStyles)`
  border-left: none;
  border-top: none;
  border-bottom: none;
`;

export const CODTagStyles = styled.div`
  display: inline-flex;
  height: 1.375rem;
  align-items: center;
  flex-direction: row;
  gap: 0.25rem;
  white-space: nowrap;
`;

export const AllTagStyles = styled(BaseTagStyles)`
  padding-left: 0rem;
  gap: 0.375rem;
`;
