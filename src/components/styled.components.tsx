import styled, { keyframes } from "styled-components";

export const StyledImg = styled.img<{
  heigh?: string;
  width?: string;
}>`
  padding: 1px;
  width: ${(p) => p.width ?? "12px"};
  height: ${(p) => p.heigh ?? "12px"};
  cursor: pointer;
  vertical-align: middle;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`;

export const SVGWrapper = styled.div<{
  width?: string;
  heigh?: string;
  color?: string;
  hoverColor?: string;
}>`
  display: inline-block;
  vertical-align: bottom;
  width: ${(p) => p.width ?? "20px"};
  height: ${(p) => p.heigh ?? "20px"};
  color: ${(p) => p.color ?? "black"};
  &:hover {
    color: ${(p) => p.hoverColor ?? "black"};
  }
  > svg {
    width: 100%;
    height: 100%;
  }
`;

export const filterAnimation = keyframes`
  0% {
    filter: contrast(100%)  saturate(150%) hue-rotate(0);
  }
 
  50% {
    filter: contrast(100%)  saturate(150%) hue-rotate(0);
  }

  60% {
    filter: contrast(100%)  saturate(150%) hue-rotate(15deg);
  }

  80% {
    filter:  contrast(175%)  saturate(200%) hue-rotate(0);

  }

  100% {
    filter: contrast(100%)  saturate(150%) hue-rotate(0);
  }
`;
