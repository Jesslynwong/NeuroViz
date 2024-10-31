import styled, { keyframes } from "styled-components";

export default function LoadingLogo() {
  return (
    <Wrapper>
      <Rectangle />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  cursor: progress;
  scale: 1.3;
`;

const rectangleAnimation = keyframes`

    0%, 80%, 100% {
    height: 20px;
    box-shadow: 0 0 #8a92da;
  }

    40% {
    height: 30px;
    box-shadow: 0 -20px #8a92da;
  }
 
`;

const Rectangle = styled.div`
  display: block;
  position: relative;
  width: 6px;
  height: 10px;
  animation: ${rectangleAnimation} infinite 1s ease-in-out -0.2s;
  background-color: #8a92da;

  &:before,
  &:after {
    position: absolute;
    width: 6px;
    height: 10px;
    content: "";
    background-color: #8a92da;
  }

  &:before {
    left: -14px;
    animation: ${rectangleAnimation} infinite 1s ease-in-out -0.4s;
  }

  &:after {
    right: -14px;
    animation: ${rectangleAnimation} infinite 1s ease-in-out;
  }
`;
