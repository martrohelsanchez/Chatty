import styled, {keyframes} from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div<{icon: string}>`
    background-image: url(${({icon}) => icon});
    height: 40px;
    width: 40px;
    animation: ${rotate} .5s linear infinite;
`;