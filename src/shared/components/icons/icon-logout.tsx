import { ComponentProps } from "react";

export const IconLogout = (props: ComponentProps<"svg">) => {
  return (
    <svg
      fill="none"
      height="24"
      stroke="#070D31"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.1104 7.56048C14.8004 3.96048 12.9504 2.49048 8.90039 2.49048H8.77039C4.30039 2.49048 2.51039 4.28048 2.51039 8.75048V15.2705C2.51039 19.7405 4.30039 21.5305 8.77039 21.5305H8.90039C12.9204 21.5305 14.7704 20.0805 15.1004 16.5405"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
      <g opacity="0.4">
        <path
          d="M9.0011 12.0005H20.3811"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.2"
        />
        <path
          d="M18.151 8.65112L21.501 12.0011L18.151 15.3511"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.2"
        />
      </g>
    </svg>
  );
};
